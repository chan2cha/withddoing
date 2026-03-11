"use client";

import { useState } from "react";
import type { VisitLink } from "@/types/itinerary";

function isInternalAsset(url: string) {
    return url.startsWith("/");
}

function isImageAsset(link: VisitLink) {
    return (
        link.kind === "image" ||
        /\.(png|jpe?g|gif|webp|svg)$/i.test(link.url)
    );
}

function isPdfAsset(link: VisitLink) {
    return link.kind === "pdf" || /\.pdf$/i.test(link.url);
}

export default function VisitLinksModal({
                                            open,
                                            title,
                                            links,
                                            onClose,
                                        }: {
    open: boolean;
    title: string;
    links: VisitLink[];
    onClose: () => void;
}) {
    const [selectedAsset, setSelectedAsset] = useState<VisitLink | null>(null);

    if (!open) return null;

    return (
        <>
            <div className="modalDim" onClick={onClose}>
                <div
                    className="modalCard"
                    onClick={(e) => e.stopPropagation()}
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${title} 관련 링크`}
                >
                    <div className="modalHead">
                        <div>
                            <div className="modalTitle">🔎 {title}</div>
                            <div className="small">후기/지도/영상 링크 모음</div>
                        </div>

                        <button className="iconBtn" type="button" onClick={onClose}>
                            ✕
                        </button>
                    </div>

                    <div className="list" style={{ marginTop: 12 }}>
                        {links.map((link, idx) => {
                            const internal = isInternalAsset(link.url);

                            if (internal) {
                                return (
                                    <button
                                        key={`${link.url}-${idx}`}
                                        type="button"
                                        className="linkCard linkCardButton"
                                        onClick={() => setSelectedAsset(link)}
                                    >
                                        <div style={{ fontWeight: 900 }}>{link.label}</div>
                                        <div className="small">{link.kind ?? "asset"}</div>
                                    </button>
                                );
                            }

                            return (
                                <a
                                    key={`${link.url}-${idx}`}
                                    className="linkCard"
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <div style={{ fontWeight: 900 }}>{link.label}</div>
                                    <div className="small">{link.kind ?? "link"}</div>
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>

            {selectedAsset ? (
                <div className="modalDim" onClick={() => setSelectedAsset(null)}>
                    <div
                        className="assetModalCard"
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-label={selectedAsset.label}
                    >
                        <div className="modalHead">
                            <div>
                                <div className="modalTitle">{selectedAsset.label}</div>
                            </div>

                            <button
                                className="iconBtn"
                                type="button"
                                onClick={() => setSelectedAsset(null)}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={{ marginTop: 12 }}>
                            {isImageAsset(selectedAsset) ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={selectedAsset.url}
                                    alt={selectedAsset.label}
                                    className="assetPreviewImage"
                                />
                            ) : isPdfAsset(selectedAsset) ? (
                                <iframe
                                    src={selectedAsset.url}
                                    title={selectedAsset.label}
                                    className="assetPreviewFrame"
                                />
                            ) : (
                                <div className="check">
                                    <div className="small">미리보기를 지원하지 않는 파일이에요.</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}