"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteLocalDocument,
  getAllLocalDocuments,
  saveLocalDocument,
  type LocalDocumentItem,
} from "@/lib/localDocuments";

interface Props {
  open: boolean;
  onClose: () => void;
}

type Category = "passport" | "voucher" | "ticket" | "insurance" | "other";
type FilterValue = "all" | Category;

const categoryLabelMap: Record<Category, string> = {
  passport: "여권",
  voucher: "바우처",
  ticket: "항공권",
  insurance: "보험",
  other: "기타",
};

const filterOptions: Array<{ value: FilterValue; label: string }> = [
  { value: "all", label: "전체" },
  { value: "passport", label: "여권" },
  { value: "voucher", label: "바우처" },
  { value: "ticket", label: "항공권" },
  { value: "insurance", label: "보험" },
  { value: "other", label: "기타" },
];

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6 6 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DocumentIcon({ type }: { type: "image" | "pdf" }) {
  if (type === "image") {
    return (
      <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
        <rect
          x="3"
          y="4"
          width="18"
          height="16"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle cx="9" cy="10" r="1.5" fill="currentColor" />
        <path
          d="M6 17l4-4 3 3 3-4 2 5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
      <path
        d="M8 3h6l5 5v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M14 3v5h5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9 14h6M9 17h4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function LocalDocumentVaultModal({ open, onClose }: Props) {
  const [documents, setDocuments] = useState<LocalDocumentItem[]>([]);
  const [titleInput, setTitleInput] = useState("");
  const [category, setCategory] = useState<Category>("passport");
  const [filter, setFilter] = useState<FilterValue>("all");
  const [loading, setLoading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [viewerDocId, setViewerDocId] = useState("");

  const loadDocuments = useCallback(async () => {
    const docs = await getAllLocalDocuments();
    setDocuments(docs);
  }, []);

  useEffect(() => {
    if (!open) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    void loadDocuments();

    return () => {
      document.body.style.overflow = original;
    };
  }, [loadDocuments, open]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const docType = file.type.startsWith("image/") ? "image" : "pdf";

      const saved = await saveLocalDocument({
        title: titleInput.trim() || file.name,
        type: docType,
        category,
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
        blob: file,
      });

      const next = await getAllLocalDocuments();
      setDocuments(next);
      setViewerDocId(saved.id);
      setTitleInput("");
      setShowUploadForm(false);
      e.target.value = "";
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const ok = window.confirm("이 문서를 이 기기에서 삭제할까요?");
    if (!ok) return;

    await deleteLocalDocument(id);
    const next = await getAllLocalDocuments();
    setDocuments(next);
    setViewerDocId((currentId) => (currentId === id ? "" : currentId));
  }

  const filteredDocuments = useMemo(() => {
    const list =
      filter === "all"
        ? documents
        : documents.filter((doc) => doc.category === filter);

    return [...list].sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === "image" ? -1 : 1;
      }
      return b.createdAt - a.createdAt;
    });
  }, [documents, filter]);

  const viewerDoc = useMemo(
    () => documents.find((doc) => doc.id === viewerDocId) ?? null,
    [documents, viewerDocId]
  );

  const imagePreviewUrls = useMemo(() => {
    const entries = filteredDocuments
      .filter((doc) => doc.type === "image")
      .map((doc) => [doc.id, URL.createObjectURL(doc.blob)] as const);

    return Object.fromEntries(entries);
  }, [filteredDocuments]);

  useEffect(() => {
    return () => {
      Object.values(imagePreviewUrls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviewUrls]);

  const viewerUrl = useMemo(() => {
    if (!viewerDoc) return "";
    return URL.createObjectURL(viewerDoc.blob);
  }, [viewerDoc]);

  useEffect(() => {
    return () => {
      if (viewerUrl) URL.revokeObjectURL(viewerUrl);
    };
  }, [viewerUrl]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <>
      <div className="modalDim" role="dialog" aria-modal="true" aria-label="문서함">
        <div className="assetModalCard documentVaultCard">
          <div className="modalHead">
            <div>
              <div className="modalTitle">문서함 📁</div>
              <div className="small">저장된 문서를 먼저 보고, 필요할 때만 추가합니다.</div>
            </div>

            <button type="button" className="iconBtn" onClick={onClose} aria-label="닫기">
              <CloseIcon />
            </button>
          </div>

          <div className="documentToolbar">
            <div className="documentFilterRow">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`documentFilterChip ${filter === option.value ? "active" : ""}`}
                  onClick={() => setFilter(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="btn documentAddToggle"
              onClick={() => setShowUploadForm((prev) => !prev)}
            >
              {showUploadForm ? "추가 닫기" : "문서 추가"}
            </button>
          </div>

          {showUploadForm ? (
            <div className="documentUploadBox">
              <div className="documentUploadRow">
                <input
                  className="exchangeInput"
                  placeholder="문서 제목 (예: 엄마 여권 사본)"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                />

                <select
                  className="documentSelect"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                >
                  <option value="passport">여권</option>
                  <option value="ticket">항공권</option>
                  <option value="voucher">바우처</option>
                  <option value="insurance">보험</option>
                  <option value="other">기타</option>
                </select>

                <label className="btn documentUploadBtn">
                  {loading ? "저장 중..." : "파일 선택"}
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    hidden
                  />
                </label>
              </div>
              <div className="small">
                이미지/PDF는 서버 업로드 없이 이 기기 브라우저에만 저장됩니다.
              </div>
            </div>
          ) : null}

          <div className="documentGallerySection">
            {filteredDocuments.length === 0 ? (
              <div className="documentEmptyState">
                <div className="small">
                  {documents.length === 0
                    ? "아직 저장된 문서가 없습니다."
                    : "선택한 필터에 해당하는 문서가 없습니다."}
                </div>
              </div>
            ) : (
              <div className="documentGalleryGrid">
                {filteredDocuments.map((doc) => {
                  const previewSrc = doc.type === "image" ? imagePreviewUrls[doc.id] : "";

                  return (
                    <button
                      key={doc.id}
                      type="button"
                      className="documentGalleryCard"
                      onClick={() => setViewerDocId(doc.id)}
                    >
                      <div className={`documentThumb ${doc.type === "pdf" ? "isPdf" : ""}`}>
                        {doc.type === "image" && previewSrc ? (
                          <Image
                            src={previewSrc}
                            alt={doc.title}
                            fill
                            unoptimized
                            className="documentThumbImage"
                          />
                        ) : (
                          <div className="documentThumbPdf">
                            <DocumentIcon type={doc.type} />
                            <span>{doc.type === "pdf" ? "PDF" : "이미지"}</span>
                          </div>
                        )}
                      </div>

                      <div className="documentCardMeta">
                        <div className="documentCardTitle">{doc.title}</div>
                        <div className="documentCardFooter">
                          <span className="documentItemBadge">
                            {categoryLabelMap[doc.category]}
                          </span>
                          <span className="documentCardType">
                            {doc.type === "image" ? "이미지" : "PDF"}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {viewerDoc ? (
        <div className="modalDim" role="dialog" aria-modal="true" aria-label={viewerDoc.title}>
          <div className="assetModalCard documentViewerCard">
            <div className="modalHead">
              <div>
                <div className="modalTitle">{viewerDoc.title}</div>
                <div className="small">
                  {categoryLabelMap[viewerDoc.category]} · {viewerDoc.fileName}
                </div>
              </div>

              <button
                type="button"
                className="iconBtn"
                onClick={() => setViewerDocId("")}
                aria-label="닫기"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="documentViewerBody">
              {viewerDoc.type === "image" && viewerUrl ? (
                <Image
                  src={viewerUrl}
                  alt={viewerDoc.title}
                  width={1200}
                  height={1600}
                  unoptimized
                  className="assetPreviewImage"
                />
              ) : (
                <div className="documentPdfPanel">
                  <DocumentIcon type="pdf" />
                  <div className="documentPdfTitle">{viewerDoc.title}</div>
                  <div className="small">PDF는 새 창에서 여는 방식이 가장 안정적입니다.</div>
                </div>
              )}
            </div>

            <div className="actionRow">
              <a
                href={viewerUrl}
                target="_blank"
                rel="noreferrer"
                className="btn"
              >
                {viewerDoc.type === "image" ? "원본 열기" : "PDF 열기"}
              </a>
              <button
                type="button"
                className="btn"
                onClick={() => void handleDelete(viewerDoc.id)}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>,
    document.body
  );
}
