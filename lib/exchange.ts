export type Currency = "KRW" | "VND" | "USD";

export type RatesMap = Record<Currency, number>;

export interface ExchangeRatesResponse {
    rates: RatesMap;
    updatedAt: string;
    source: "live" | "cache";
}

interface FrankfurterRateRow {
    quote: Currency;
    rate: string;
    date?: string;
}

const STORAGE_KEY = "exchange_rates_v1";

export async function fetchExchangeRates(): Promise<ExchangeRatesResponse> {
    const res = await fetch(
        "https://api.frankfurter.dev/v2/rates?base=USD&quotes=KRW,VND",
        { cache: "no-store" }
    );

    if (!res.ok) {
        throw new Error("환율 조회 실패");
    }

    const rows = (await res.json()) as FrankfurterRateRow[];

    const usdToKrw = rows.find((row) => row.quote === "KRW")?.rate;
    const usdToVnd = rows.find((row) => row.quote === "VND")?.rate;
    const updatedAt = rows[0]?.date ?? new Date().toISOString();

    if (!usdToKrw || !usdToVnd) {
        throw new Error("필수 환율 데이터 누락");
    }

    const payload: ExchangeRatesResponse = {
        rates: {
            USD: 1,
            KRW: Number(usdToKrw),
            VND: Number(usdToVnd),
        },
        updatedAt,
        source: "live",
    };

    if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    }

    return payload;
}

export function getCachedExchangeRates(): ExchangeRatesResponse | null {
    if (typeof window === "undefined") return null;

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw) as ExchangeRatesResponse;
        return {
            ...parsed,
            source: "cache",
        };
    } catch {
        return null;
    }
}

export function convertAmount(
    amount: number,
    from: Currency,
    to: Currency,
    rates: RatesMap
): number {
    if (!Number.isFinite(amount)) return 0;
    if (from === to) return amount;

    const amountInUsd = amount / rates[from];
    return amountInUsd * rates[to];
}

export function formatCurrency(value: number, currency: Currency): string {
    if (!Number.isFinite(value)) return "-";

    return new Intl.NumberFormat("ko-KR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: currency === "USD" ? 2 : 0,
    }).format(value);
}

export function prettyUpdatedAt(value: string): string {
    if (!value) return "-";
    return value.length >= 10 ? value.slice(0, 10) : value;
}
