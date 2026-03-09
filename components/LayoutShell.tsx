"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import itineraryData from "@/data/itinerary.json";
import type { ItineraryData, VisitLink } from "@/types/itinerary";
import VisitLinksModal from "@/components/VisitLinksModal";

const itinerary = itineraryData as ItineraryData;

export default function LayoutShell({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const tabs = [
        { href: "/", label: "오늘" },
        { href: "/schedule", label: "전체 일정" },
        { href: "/checklist", label: "체크리스트" },
        { href: "/rules", label: "운영룰" },
    ];

    const hotelLinks: VisitLink[] = itinerary.hotelInfo?.links ?? [];

    return (
        <div className="container">
            <header className="header">
                <div className="brand">
                    <div className="logo">W</div>
                    <div>
                        <div className="title">{itinerary.tripName}</div>

                        <div className="headerMetaRow">
      <span className="headerMetaText">
        {itinerary.dateRangeLabel}
      </span>

                            <span className="headerMetaDot">·</span>

                            <span className="headerMetaText">
        {itinerary.party}
      </span>

                            <button
                                type="button"
                                className="headerMetaBadge"
                                onClick={() => setOpen(true)}
                                title={itinerary.hotelInfo?.name || itinerary.hotel}
                                aria-label={itinerary.hotelInfo?.name || itinerary.hotel}
                            >
                                리조트 정보 🏨
                            </button>
                        </div>
                    </div>
                </div>

                <div className="headerRight">


                    <nav className="nav">
                        {tabs.map((tab) => (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={`tab ${pathname === tab.href ? "active" : ""}`}
                            >
                                {tab.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </header>

            {children}

            <footer className="footer">
                일정·체크리스트·운영룰을 한 화면에서 빠르게 확인해요 ✈️
            </footer>

            <VisitLinksModal
                open={open}
                title={itinerary.hotelInfo?.name || itinerary.hotel}
                links={hotelLinks}
                onClose={() => setOpen(false)}
            />
        </div>
    );
}