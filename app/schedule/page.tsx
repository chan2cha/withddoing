"use client";

import { useState } from "react";
import LayoutShell from "@/components/LayoutShell";
import VisitLinksModal from "@/components/VisitLinksModal";
import itineraryData from "@/data/itinerary.json";
import type { ItineraryData, VisitLink } from "@/types/itinerary";
const itinerary = itineraryData as ItineraryData;

export default function SchedulePage() {
    const [modalTitle, setModalTitle] = useState("");
    const [modalLinks, setModalLinks] = useState<VisitLink[]>([]);
    const [open, setOpen] = useState(false);

    const openLinks = (title: string | undefined, links: VisitLink[] | undefined) => {
        setModalTitle(title ?? "");
        setModalLinks(links ?? []);
        setOpen(true);
    };

    return (
        <LayoutShell>
            <section className="card" style={{ marginTop: 14 }}>
                <h2 className="h2">🗓️ 전체 일정</h2>
                <div className="small">날짜별로 확인하세요.</div>

                <div style={{ marginTop: 10 }}>
                    {itinerary.days.map((day, i) => (
                        <div key={i} style={{ marginBottom: 14 }}>
                            <div className="pillrow">
                <span className="pill">
                  <b>{day.date.slice(5).replace("-", "/")}({day.dow})</b>
                </span>
                                <span className="pill">{day.title}</span>
                            </div>

                            <div style={{ marginTop: 8 }}>
                                {day.items.map((item, idx) => (
                                    <div className="item" key={idx}>
                                        <div>
                                            <div className="time">{item.time}</div>
                                            <div className="icon">{item.icon}</div>
                                        </div>

                                        <div>
                                            <div className="ititle">{item.title}</div>
                                            <div className="detail">{item.detail}</div>

                                            {(item.transport || item.planB) && (
                                                <div className="metaBlock">
                                                    {item.transport && (
                                                        <div className="small"><b>이동</b> {item.transport}</div>
                                                    )}
                                                    {item.planB && (
                                                        <div className="small"><b>플랜B</b> {item.planB}</div>
                                                    )}
                                                </div>
                                            )}

                                            {item.visit && (
                                                <div className="visitCard">
                                                    <div className="visitHead">
                                                        <span className="visitName">{item.visit.name}</span>
                                                        <span className="visitType">{item.visit.type}</span>
                                                    </div>

                                                    <div className="visitList">
                                                        {item.visit.location && (
                                                            <div className="small"><b>위치</b> {item.visit.location}</div>
                                                        )}
                                                        {item.visit.duration && (
                                                            <div className="small"><b>체류</b> {item.visit.duration}</div>
                                                        )}
                                                        {item.visit.note && (
                                                            <div className="small"><b>메모</b> {item.visit.note}</div>
                                                        )}
                                                        {item.visit.highlight && (
                                                            <div className="small"><b>포인트</b> {item.visit.highlight}</div>
                                                        )}
                                                        {item.visit.caution && (
                                                            <div className="small"><b>주의</b> {item.visit.caution}</div>
                                                        )}
                                                        {item.visit.orderTip && (
                                                            <div className="small"><b>주문팁</b> {item.visit.orderTip}</div>
                                                        )}
                                                    </div>

                                                    {(item.visit.recommendedMenu?.length ?? 0) > 0 && (
                                                        <div className="pillrow" style={{ marginTop: 8 }}>
                                                            {(item.visit.recommendedMenu ?? []).map((menu, mi) => (
                                                                <span className="pill" key={mi}>{menu}</span>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {(item.visit.links?.length ?? 0) > 0 && (
                                                        <div className="actionRow">
                                                            <button
                                                                className="btn"
                                                                type="button"
                                                                onClick={() =>
                                                                    openLinks(item.visit?.name, item.visit?.links)
                                                                }
                                                            >
                                                                🔎 후기 보기
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <VisitLinksModal
                open={open}
                title={modalTitle}
                links={modalLinks}
                onClose={() => setOpen(false)}
            />
        </LayoutShell>
    );
}