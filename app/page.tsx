"use client";

import { useMemo, useState } from "react";
import LayoutShell from "@/components/LayoutShell";
import VisitLinksModal from "@/components/VisitLinksModal";
import itineraryData from "@/data/itinerary.json";
import type {ItineraryData, ItineraryDay, VisitLink} from "@/types/itinerary";
import ItineraryItemsList from "@/components/ItineraryItemsList";
import {mapRoute} from "@/data/routes/map"
import dynamic from "next/dynamic";

const RouteMap = dynamic(() => import("@/components/RouteMap"), {
  ssr: false,
});

const itinerary = itineraryData as ItineraryData;
function makeDateParts(date: string, dow: string) {
  return {
    mmdd: date.slice(5).replace("-", "/"),
    dow,
  };
}




export default function HomePage() {
  const [selected, setSelected] = useState<ItineraryDay>();

const selectedRoute = mapRoute[selected?.day ?? "1"];
  const [modalTitle, setModalTitle] = useState("");
  const [modalLinks, setModalLinks] = useState<VisitLink[]>([]);
  const [open, setOpen] = useState(false);

  const day = useMemo(
      () => itinerary.days.find((d) => d.day === (selected?.day ?? "1")),
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
                      key={d.day}
                      className={`tab dateTab ${(selected?.day ?? "1") === d.day ? "active" : ""}`}
                      onClick={() => {
                        setSelected(d)

                      }}
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

                  <ItineraryItemsList day={day} onOpenLinks={openLinks} />
                </div>
            )}
          </section>
          {selectedRoute && (
          <section className="card">
                <section className="card" style={{ marginTop: 12 }}>
                  <h2 className="h2">🗺️ {selected?.day ?? "1"}일차 이동 경로</h2>
                  <div className="small">온라인이면 배경지도가 보이고, 오프라인에서도 경로와 포인트는 확인할 수 있어요.</div>

                  <div style={{ marginTop: 10 }}>
                    <RouteMap key={selected?.day} data={selectedRoute} title={selected?.title} />
                  </div>
                </section>
          </section>
          )}
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
