"use client";

import { createPortal } from "react-dom";
import { useEffect } from "react";

interface VoucherModalProps {
  open: boolean;
  title: string;
  file: string;
  onClose: () => void;
}

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

export default function VoucherModal({
  open,
  title,
  file,
  onClose,
}: VoucherModalProps) {
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="modalDim" role="dialog" aria-modal="true" aria-label={title}>
      <div className="assetModalCard">
        <div className="modalHead">
          <div>
            <div className="modalTitle">{title}</div>
            <div className="small">바우처 PDF 미리보기</div>
          </div>

          <button
            type="button"
            className="iconBtn"
            onClick={onClose}
            aria-label="닫기"
          >
            <CloseIcon />
          </button>
        </div>

        <div style={{ marginTop: 12 }}>
          <iframe
            src={file}
            title={title}
            className="assetPreviewFrame"
          />
        </div>

        <div className="actionRow">
          <a
            href={file}
            target="_blank"
            rel="noreferrer"
            className="btn"
          >
            새 창에서 열기
          </a>
        </div>
      </div>

      <button
        type="button"
        className="bottomSheetDim"
        aria-label="닫기"
        onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: -1 }}
      />
    </div>,
    document.body
  );
}
