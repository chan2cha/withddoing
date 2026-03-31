import ItineraryItemCard from "@/components/ItineraryItemCard";
import type { ItineraryDay, VisitLink } from "@/types/itinerary";

interface Props {
    day: ItineraryDay;
    onOpenLinks: (title?: string, links?: VisitLink[]) => void;
    onOpenVoucher: (label: string,file: string) => void;
}

export default function ItineraryItemsList({ day, onOpenLinks ,onOpenVoucher}: Props) {
    return (
        <>
            {day.items.map((item, index) => (
                <ItineraryItemCard
                    key={`${day.day}-${index}-${item.time}-${item.title}`}
                    item={item}
                    onOpenLinks={onOpenLinks}
                    onOpenVoucher={onOpenVoucher}
                />
            ))}
        </>
    );
}
