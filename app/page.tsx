"use client";

import { useMemo, useState } from "react";
import LayoutShell from "@/components/LayoutShell";
import VisitLinksModal from "@/components/VisitLinksModal";
import itineraryData from "@/data/itinerary.json";
import type { ItineraryData, VisitLink } from "@/types/itinerary";
import DetailButton from "@/components/DetailButton";

import day1Route from "@/data/routes/day1.json";
import type { RouteFeatureCollection } from "@/types/map";
import dynamic from "next/dynamic";

const RouteMap = dynamic(() => import("@/components/RouteMap"), {
  ssr: false,
});
const day1MapData = day1Route as RouteFeatureCollection;
const itinerary = itineraryData as ItineraryData;
function makeDateParts(date: string, dow: string) {
  return {
    mmdd: date.slice(5).replace("-", "/"),
    dow,
  };
}

function getInitialSelectedDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const todayStr = `${yyyy}-${mm}-${dd}`;

  const matched = itinerary.days.find((d) => d.date === todayStr);
  return matched ? matched.date : itinerary.dates[0];
}



export default function HomePage() {
  const [selected, setSelected] = useState(getInitialSelectedDate());
  const [modalTitle, setModalTitle] = useState("");
  const [modalLinks, setModalLinks] = useState<VisitLink[]>([]);
  const [open, setOpen] = useState(false);

  const day = useMemo(
      () => itinerary.days.find((d) => d.date === selected),
      [selected]
  );

  const openLinks = (title: string | undefined, links: VisitLink[] | undefined) => {
    setModalTitle(title ?? "");
    setModalLinks(links ?? []);
    setOpen(true);
  };

  return (
      <LayoutShell>

        <section className="dateTabsBar">
          <div className="dateTabsGrid">
            {itinerary.days.map((d) => {
              const parts = makeDateParts(d.date, d.dow);

              return (
                  <button
                      key={d.date}
                      className={`tab dateTab ${selected === d.date ? "active" : ""}`}
                      onClick={() => setSelected(d.date)}
                  >
                    <span className="dateTabMain">{parts.mmdd}</span>
                    <span className="dateTabSub">{parts.dow}</span>
                  </button>
              );
            })}
          </div>
        </section>
        <div className="grid">
          <section className="card">
            <h2 className="h2">📅 오늘 일정</h2>

            {day && (
                <div className="sectionGap">
                  <div className="small">
                    <b>{day.title}</b> · {day.date}({day.dow})
                  </div>

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
                                    <div className="small">
                                      <b>이동</b> {item.transport}
                                    </div>
                                )}
                                {item.planB && (
                                    <div className="small">
                                      <b>플랜B</b> {item.planB}
                                    </div>
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
                                      <div className="small">
                                        <b>위치</b> {item.visit.location}
                                      </div>
                                  )}
                                  {item.visit.duration && (
                                      <div className="small">
                                        <b>체류</b> {item.visit.duration}
                                      </div>
                                  )}
                                  {item.visit.note && (
                                      <div className="small">
                                        <b>메모</b> {item.visit.note}
                                      </div>
                                  )}
                                  {item.visit.highlight && (
                                      <div className="small">
                                        <b>포인트</b> {item.visit.highlight}
                                      </div>
                                  )}
                                  {item.visit.caution && (
                                      <div className="small">
                                        <b>주의</b> {item.visit.caution}
                                      </div>
                                  )}
                                  {item.visit.orderTip && (
                                      <div className="small">
                                        <b>주문팁</b> {item.visit.orderTip}
                                      </div>
                                  )}
                                </div>

                                {item.visit.recommendedMenu?.length ? (
                                    <div className="pillrow" style={{ marginTop: 8 }}>
                                      {item.visit.recommendedMenu.map((menu, mi) => (
                                          <span className="pill" key={mi}>
                      {menu}
                    </span>
                                      ))}
                                    </div>
                                ) : null}

                                {item.visit.links?.length ? (
                                    <DetailButton onClick={() => openLinks(item.visit!.name, item.visit!.links!)}/>
                                ) : null}
                              </div>
                          )}

                          {item.subStops?.length ? (
                              <div className="subStopsBox">
                                <div className="small">
                                  <b>포함 코스</b>
                                </div>

                                <div className="subStopsList">
                                  {item.subStops.map((stop, si) => {
                                    const hasLinks = !!stop.links?.length;

                                    return hasLinks ? (
                                        <button
                                            key={si}
                                            type="button"
                                            className="subStopChip isButton"
                                            onClick={() => openLinks(stop.name, stop.links!)}
                                            title={stop.note || stop.name}
                                        >
                                          {stop.name}
                                        </button>
                                    ) : (
                                        <span
                                            key={si}
                                            className="subStopChip"
                                            title={stop.note || stop.name}
                                        >
                      {stop.name}
                    </span>
                                    );
                                  })}
                                </div>

                                <div className="small" style={{ marginTop: 6 }}>
                                  눌러지는 코스는 후기/지도/영상을 볼 수 있어요.
                                </div>
                              </div>
                          ) : null}
                        </div>
                      </div>
                  ))}
                </div>
            )}
          </section>

          <section className="card">
            {selected === "2026-04-02" ? (
                <section className="card" style={{ marginTop: 12 }}>
                  <h2 className="h2">🗺️ 1일차 이동 경로</h2>
                  <div className="small">온라인이면 배경지도가 보이고, 오프라인에서도 경로와 포인트는 확인할 수 있어요.</div>

                  <div style={{ marginTop: 10 }}>
                    <RouteMap data={day1MapData} title="도착 + 모닝투어 + 체크인" />
                  </div>
                </section>
            ) : null}
            <div className="actionRow">
              <a className="btn" href="/pdf/itinerary.pdf" target="_blank">
                📄 PDF 백업 열기
              </a>
            </div>
          </section>
        </div>

        <VisitLinksModal
            open={open}
            title={modalTitle}
            links={modalLinks}
            onClose={() => setOpen(false)}
        />
      </LayoutShell>
  );
}