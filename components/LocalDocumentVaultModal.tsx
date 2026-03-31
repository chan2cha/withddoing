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

const categoryLabelMap: Record<Category, string> = {
  passport: "여권",
  voucher: "바우처",
  ticket: "항공권",
  insurance: "보험",
  other: "기타",
};

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

export default function LocalDocumentVaultModal({ open, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const [documents, setDocuments] = useState<LocalDocumentItem[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [category, setCategory] = useState<Category>("passport");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const loadDocuments = useCallback(async () => {
    const docs = await getAllLocalDocuments();
    setDocuments(docs);
    if (!selectedId && docs.length > 0) {
      setSelectedId(docs[0].id);
    }
  }, [selectedId]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";

    void loadDocuments();

    return () => {
      document.body.style.overflow = "";
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
      setSelectedId(saved.id);
      setTitleInput("");
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
    setSelectedId(next[0]?.id ?? "");
  }

  const selectedDoc = useMemo(
    () => documents.find((d) => d.id === selectedId) ?? documents[0] ?? null,
    [documents, selectedId]
  );

  const previewUrl = useMemo(() => {
    if (!selectedDoc) return "";
    return URL.createObjectURL(selectedDoc.blob);
  }, [selectedDoc]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="modalDim" role="dialog" aria-modal="true" aria-label="문서함">
      <div className="assetModalCard documentVaultCard">
        <div className="modalHead">
          <div>
            <div className="modalTitle">문서함 📁</div>
            <div className="small">문서는 이 기기 브라우저에만 저장됩니다.</div>
          </div>

          <button type="button" className="iconBtn" onClick={onClose} aria-label="닫기">
            <CloseIcon />
          </button>
        </div>

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
              {loading ? "저장 중..." : "문서 추가"}
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                hidden
              />
            </label>
          </div>
          <div className="small">
            이미지나 PDF를 선택하면 서버 업로드 없이 이 기기에만 저장됩니다.
          </div>
        </div>

        <div className="documentVaultLayout">
          <aside className="documentVaultSidebar">
            <div className="documentVaultList">
              {documents.length === 0 ? (
                <div className="small">아직 저장된 문서가 없습니다.</div>
              ) : (
                documents.map((doc) => {
                  const active = selectedDoc?.id === doc.id;

                  return (
                    <button
                      key={doc.id}
                      type="button"
                      className={`documentItemBtn ${active ? "active" : ""}`}
                      onClick={() => setSelectedId(doc.id)}
                    >
                      <div className="documentItemTop">
                        <span className="documentItemTitle">{doc.title}</span>
                        <span className="documentItemBadge">
                          {categoryLabelMap[doc.category]}
                        </span>
                      </div>

                      <div className="small">
                        {doc.type === "image" ? "이미지 문서" : "PDF 문서"} · {doc.fileName}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          <section className="documentVaultPreview">
            {selectedDoc ? (
              <>
                <div className="documentPreviewHead">
                  <div>
                    <div className="documentPreviewTitle">{selectedDoc.title}</div>
                    <div className="small">
                      {categoryLabelMap[selectedDoc.category]} · {selectedDoc.fileName}
                    </div>
                  </div>

                  <div className="actionRow">
                    <button
                      type="button"
                      className="btn"
                      onClick={() => handleDelete(selectedDoc.id)}
                    >
                      삭제
                    </button>
                  </div>
                </div>

                <div className="documentPreviewBody">
                  {selectedDoc.type === "image" ? (
                    <Image
                      src={previewUrl}
                      alt={selectedDoc.title}
                      width={1200}
                      height={1600}
                      unoptimized
                      className="assetPreviewImage"
                    />
                  ) : (
                    <iframe
                      src={previewUrl}
                      title={selectedDoc.title}
                      className="assetPreviewFrame"
                    />
                  )}
                </div>
              </>
            ) : (
              <div className="small">왼쪽에서 문서를 추가해 주세요.</div>
            )}
          </section>
        </div>
      </div>
    </div>,
    document.body
  );
}
