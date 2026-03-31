"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
    convertAmount,
    fetchExchangeRates,
    formatCurrency,
    getCachedExchangeRates,
    prettyUpdatedAt,
    type Currency,
    type ExchangeRatesResponse,
} from "@/lib/exchange";

const CURRENCIES: Currency[] = ["KRW", "VND", "USD"];

function CalculatorIcon() {
    return (
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
                d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            />
            <rect
                x="8"
                y="5"
                width="8"
                height="3"
                rx="1"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            />
            <circle cx="9" cy="12" r="1" fill="currentColor" />
            <circle cx="12" cy="12" r="1" fill="currentColor" />
            <circle cx="15" cy="12" r="1" fill="currentColor" />
            <circle cx="9" cy="16" r="1" fill="currentColor" />
            <circle cx="12" cy="16" r="1" fill="currentColor" />
            <circle cx="15" cy="16" r="1" fill="currentColor" />
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
                d="M6 6l12 12M18 6 6 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    );
}

function RefreshIcon({ spinning = false }: { spinning?: boolean }) {
    return (
        <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            aria-hidden="true"
            className={spinning ? "spin" : ""}
        >
            <path
                d="M20 12a8 8 0 1 1-2.34-5.66"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
            <path
                d="M20 4v5h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

interface Props {
    title?: string;
}

export default function ExchangeRateSheet({ title = "환율 계산기" }: Props) {
    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState("100000");
    const [from, setFrom] = useState<Currency>("KRW");
    const [data, setData] = useState<ExchangeRatesResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    const numericAmount = Number(amount || 0);

    const loadRates = async () => {
        setLoading(true);
        setError("");

        try {
            const live = await fetchExchangeRates();
            setData(live);
        } catch {
            const cached = getCachedExchangeRates();
            if (cached) {
                setData(cached);
                setError("실시간 조회에 실패해 저장된 환율을 사용 중이에요.");
            } else {
                setError("환율을 불러오지 못했어요.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!open) return;
        loadRates();
    }, [open]);

    useEffect(() => {
        if (!open) return;

        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = original;
        };
    }, [open]);

    const results = useMemo(() => {
        if (!data) return [];

        return CURRENCIES.map((currency) => ({
            currency,
            value: convertAmount(numericAmount, from, currency, data.rates),
        }));
    }, [data, numericAmount, from]);

    return (
        <>
            <button
                type="button"
                className="headerMetaBadge exchangeHeaderBadge"
                aria-label="환율 계산기 열기"
                onClick={() => setOpen(true)}
                title="환율 계산기"
            >
                <CalculatorIcon />
                <span>환율</span>
            </button>

            {mounted && open && createPortal(
                <div
                    className="bottomSheetRoot"
                    role="dialog"
                    aria-modal="true"
                    aria-label={title}
                >
                    <button
                        type="button"
                        className="bottomSheetDim"
                        aria-label="닫기"
                        onClick={() => setOpen(false)}
                    />

                    <div className="bottomSheetCard">
                        <div className="bottomSheetHandle" />

                        <div className="bottomSheetHead">
                            <div>
                                <div className="bottomSheetTitle">{title}</div>
                                <div className="small">KRW(원) / VND(동) / USD(달러) 실시간 환율 계산</div>
                            </div>

                            <button
                                type="button"
                                className="iconBtn"
                                onClick={() => setOpen(false)}
                                aria-label="닫기"
                            >
                                <CloseIcon />
                            </button>
                        </div>

                        <div className="bottomSheetBody">
                            <div className="exchangePanel">
                                <div className="exchangeField">
                                    <label className="exchangeLabel">기준 통화</label>
                                    <div className="exchangeTabRow">
                                        {CURRENCIES.map((currency) => (
                                            <button
                                                key={currency}
                                                type="button"
                                                className={`exchangeTab ${from === currency ? "active" : ""}`}
                                                onClick={() => setFrom(currency)}
                                            >
                                                {currency}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="exchangeField">
                                    <label className="exchangeLabel">금액</label>
                                    <input
                                        value={amount}
                                        onChange={(e) =>
                                            setAmount(e.target.value.replace(/[^0-9.]/g, ""))
                                        }
                                        inputMode="decimal"
                                        placeholder="금액 입력"
                                        className="exchangeInput"
                                    />
                                </div>



                                <button
                                    type="button"
                                    className="btn exchangeRefreshBtn"
                                    onClick={loadRates}
                                    disabled={loading}
                                >
                                    <RefreshIcon spinning={loading} />
                                    {loading ? "환율 불러오는 중..." : "환율 새로고침"}
                                </button>
                            </div>

                            <div className="exchangeResults">
                                {results.map((item) => (
                                    <div className="exchangeResultCard" key={item.currency}>
                                        <div className="exchangeResultCode">{item.currency}</div>
                                        <div className="exchangeResultValue">
                                            {formatCurrency(item.value, item.currency)}
                                            <span className="exchangeResultUnit"> {item.currency}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="exchangeMetaCard">
                                <div className="small">
                                    <b>업데이트</b> {data?.updatedAt ? prettyUpdatedAt(data.updatedAt) : "-"}
                                </div>
                                <div className="small">
                                    <b>상태</b>{" "}
                                    {data?.source === "live"
                                        ? "실시간 조회"
                                        : data?.source === "cache"
                                            ? "저장된 환율"
                                            : "-"}
                                </div>
                                {error ? <div className="small exchangeError">{error}</div> : null}
                            </div>
                        </div>
                    </div>
                </div>,document.body
            )}
        </>
    );
}
