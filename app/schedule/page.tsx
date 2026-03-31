"use client";

import { useState } from "react";
import LayoutShell from "@/components/LayoutShell";
import ItineraryItemsList from "@/components/ItineraryItemsList";
import VisitLinksModal from "@/components/VisitLinksModal";
import itineraryData from "@/data/itinerary.json";
import type { ItineraryData, VisitLink } from "@/types/itinerary";
import VoucherModal from "@/components/VoucherModal";
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
const [voucherOpen, setVoucherOpen] = useState(false);
    const [voucherTitle, setVoucherTitle] = useState("");
    const [voucherFile, setVoucherFile] = useState("");
    const openVoucher = (title: string, file: string) => {
      setVoucherTitle(title);
      setVoucherFile(file);
      setVoucherOpen(true);
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
                                <ItineraryItemsList day={day} onOpenLinks={openLinks} onOpenVoucher={openVoucher} />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
<VoucherModal
  open={voucherOpen}
  title={voucherTitle}
  file={voucherFile}
  onClose={() => setVoucherOpen(false)}
/>
            <VisitLinksModal
                open={open}
                title={modalTitle}
                links={modalLinks}
                onClose={() => setOpen(false)}
            />
        </LayoutShell>
    );
}
