"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import itineraryData from "@/data/itinerary.json";
import type { ItineraryData, VisitLink } from "@/types/itinerary";
import VisitLinksModal from "@/components/VisitLinksModal";
import ExchangeRateSheet from "@/components/ExchangeRateSheet";
import LocalDocumentVaultModal from "@/components/LocalDocumentVaultModal";
const itinerary = itineraryData as ItineraryData;

export default function LayoutShell({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
const [documentOpen, setDocumentOpen] = useState(false);
    const tabs = [
        { href: "/", label: "오늘" },
        { href: "/schedule", label: "전체 일정" },
        { href: "/checklist", label: "체크리스트" }
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
    
                            <button
                                type="button"
                                className="headerMetaBadge"
                                onClick={() => setOpen(true)}
                                title={itinerary.hotelInfo?.name || itinerary.hotel}
                                aria-label={itinerary.hotelInfo?.name || itinerary.hotel}
                            >
                                리조트 정보 🏨
                            </button>
                            <ExchangeRateSheet />
                            
                            <button
    type="button"
    className="headerMetaBadge"
    onClick={() => setDocumentOpen(true)}
    aria-label="문서함 열기"
    title="문서함"
  >
    문서함 📁
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
                일정·체크리스트을 한 화면에서 빠르게 확인해요 ✈️
            </footer>
<LocalDocumentVaultModal
  open={documentOpen}
  onClose={() => setDocumentOpen(false)}
/>
            <VisitLinksModal
                open={open}
                title={itinerary.hotelInfo?.name || itinerary.hotel}
                links={hotelLinks}
                onClose={() => setOpen(false)}
            />
        </div>
    );
}