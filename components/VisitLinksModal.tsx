"use client";

import type { VisitLink } from "@/types/itinerary";

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
    if (!open) return null;

    return (
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
                    {links.map((link, idx) => (
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
                    ))}
                </div>
            </div>
        </div>
    );
}