import DetailButton from "@/components/DetailButton";
import type { ItineraryItem, VisitLink } from "@/types/itinerary";

interface Props {
    item: ItineraryItem;
    onOpenLinks: (title?: string, links?: VisitLink[]) => void;
}

export default function ItineraryItemCard({ item, onOpenLinks }: Props) {
    return (
        <div className="item">
            <div>
                <div className="time">{item.time}</div>
                <div className="icon">{item.icon}</div>
                {item.amount ? <div className="time">{item.amount}</div> : null}
            </div>

            <div>
                <div className="ititle">{item.title}</div>
                <div className="detail">{item.detail}</div>

                {(item.transport || item.planB) && (
                    <div className="metaBlock">
                        {item.transport ? (
                            <div className="small">
                                <b>이동</b> {item.transport}
                            </div>
                        ) : null}
                        {item.planB ? (
                            <div className="small">
                                <b>플랜B</b> {item.planB}
                            </div>
                        ) : null}
                    </div>
                )}

                {item.visit ? (
                    <div className="visitCard">
                        <div className="visitHead">
                            <span className="visitName">{item.visit.name}</span>
                            <span className="visitType">{item.visit.type}</span>
                        </div>

                        <div className="visitList">
                            {item.visit.location ? (
                                <div className="small">
                                    <b>위치</b> {item.visit.location}
                                </div>
                            ) : null}
                            {item.visit.duration ? (
                                <div className="small">
                                    <b>체류</b> {item.visit.duration}
                                </div>
                            ) : null}
                            {item.visit.note ? (
                                <div className="small">
                                    <b>메모</b> {item.visit.note}
                                </div>
                            ) : null}
                            {item.visit.highlight ? (
                                <div className="small">
                                    <b>포인트</b> {item.visit.highlight}
                                </div>
                            ) : null}
                            {item.visit.caution ? (
                                <div className="small">
                                    <b>주의</b> {item.visit.caution}
                                </div>
                            ) : null}
                            {item.visit.orderTip ? (
                                <div className="small">
                                    <b>주문팁</b> {item.visit.orderTip}
                                </div>
                            ) : null}
                        </div>

                        {item.visit.recommendedMenu?.length ? (
                            <div className="pillrow" style={{ marginTop: 8 }}>
                                {item.visit.recommendedMenu.map((menu, index) => (
                                    <span className="pill" key={index}>
                                        {menu}
                                    </span>
                                ))}
                            </div>
                        ) : null}

                        {item.visit.links?.length ? (
                            <DetailButton
                                onClick={() => onOpenLinks(item.visit?.name, item.visit?.links)}
                            />
                        ) : null}
                    </div>
                ) : null}
                {item.voucher ? (
                    <div className="actionRow">
                        <a
                            href={item.voucher.file}
                            className="btn"
                            aria-label={`${item.voucher.label || item.title} PDF 열기`}
                        >
                            바우처 보기 📄
                        </a>
                    </div>
                ) : null}
                {item.subStops?.length ? (
                    <div className="subStopsBox">
                        <div className="small">
                            <b>포함 코스</b>
                        </div>

                        <div className="subStopsList">
                            {item.subStops.map((stop, index) => {
                                const hasLinks = !!stop.links?.length;

                                return hasLinks ? (
                                    <button
                                        key={index}
                                        type="button"
                                        className="subStopChip isButton"
                                        onClick={() => onOpenLinks(stop.name, stop.links)}
                                        title={stop.note || stop.name}
                                    >
                                        {stop.name}
                                    </button>
                                ) : (
                                    <span
                                        key={index}
                                        className="subStopChip"
                                        title={stop.note || stop.name}
                                    >
                                        {stop.name}
                                    </span>
                                );
                            })}
                        </div>

                        <div className="small" style={{ marginTop: 6 }}>
                            눌러지는 코스는 후기/지도/영상을 볼 수 있어요.
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
