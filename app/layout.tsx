import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "위드또잉",
    description: "푸꾸옥 가족여행 일정/체크리스트",
    icons: {
        apple: "/icons/icon-192.png",
        icon: "/icons/icon-192.png",
    },
};

export const viewport: Viewport = {
    themeColor: "#0EA5E9",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
        <body>{children}</body>
        </html>
    );
}