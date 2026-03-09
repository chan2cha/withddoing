"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LayoutShell({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const tabs = [
        { href: "/", label: "오늘" },
        { href: "/schedule", label: "전체 일정" },
        { href: "/checklist", label: "체크리스트" },
        { href: "/rules", label: "운영룰" },
    ];

    return (
        <div className="container">
            <header className="header">
                <div className="brand">
                    <div className="logo">W</div>
                    <div>
                        <div className="title">위드또잉</div>
                        <div className="subtitle">가족용 일정/체크리스트</div>
                    </div>
                </div>

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
            </header>

            {children}

            <footer className="footer">
                처음 한 번 열어두면 이후 비행기모드에서도 확인 가능 ✈️
            </footer>
        </div>
    );
}