export type VisitLinkKind = "blog" | "youtube" | "map" | "review"|"image"
| "pdf";

export type VisitType =
    | "airport"
    | "hotel"
    | "restaurant"
    | "shopping"
    | "spa"
    | "sightseeing"
    | "show"
    | "transport";

export interface VisitLink {
    label: string;
    url: string;
    kind?: VisitLinkKind;
}

export interface VisitInfo {
    name: string;
    type: VisitType;
    location?: string;
    duration?: string;
    note?: string;

    // 관광지/시설 쪽
    highlight?: string;
    caution?: string;

    // 식당 쪽
    recommendedMenu?: string[];
    orderTip?: string;

    // 외부 후기 링크
    links?: VisitLink[];
}
export interface SubStop {
    name: string;
    type?: VisitType;
    note?: string;
    links?: VisitLink[];
}

export interface ItineraryItem {
    time: string;
    icon: string;
    title: string;
    detail: string;
    transport?: string;
    planB?: string;
    visit?: VisitInfo;
    subStops?: SubStop[];
}

export interface ItineraryDay {
    date: string;
    dow: string;
    title: string;
    items: ItineraryItem[];
    day:string;
}

export interface HighlightItem {
    time: string;
    label: string;
    note: string;
}

export interface HotelInfo {
    name: string;
    links?: VisitLink[];
}

export interface ItineraryData {
    tripName: string;
    hotel: string;
    party?: string;
    dateRangeLabel?: string;
    hotelInfo?: HotelInfo;
    dates: string[];
    highlights: HighlightItem[];
    days: ItineraryDay[];

}