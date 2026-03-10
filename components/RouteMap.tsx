"use client";

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import L from "leaflet";
import type { RouteFeatureCollection, RouteFeature } from "@/types/map";
import { getBoundsFromGeoJson } from "@/lib/map";
import "leaflet/dist/leaflet.css";

function getMaxOrder(data: RouteFeatureCollection) {
    const orders = data.features
        .map((feature) => (feature as RouteFeature).properties?.order)
        .filter((value): value is number => typeof value === "number");

    return orders.length ? Math.max(...orders) : null;
}

function makeRoutePointIcon(order?: number, maxOrder?: number | null) {
    let label = "";
    let extraClass = "";

    if (order === 1) {
        label = "✈️";
        extraClass = "isStart";
    } else if (typeof order === "number" && maxOrder && order === maxOrder) {
        label = "🏨";
        extraClass = "isEnd";
    } else {
        label = typeof order === "number" ? String(order) : "•";
        extraClass = "isMid";
    }

    return L.divIcon({
        className: "routeMarker",
        html: `
      <div class="routeMarkerNumberWrap ${extraClass}">
        <div class="routeMarkerNumberInner">${label}</div>
      </div>
    `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
    });
}

export default function RouteMap({
                                     data,
                                     title,
                                     showTiles = true,
                                 }: {
    data: RouteFeatureCollection;
    title?: string;
    showTiles?: boolean;
}) {
    const bounds = getBoundsFromGeoJson(data);
    const maxOrder = getMaxOrder(data);

    return (
        <div className="routeMapWrap">
            {title ? <div className="routeMapTitle">{title}</div> : null}

            <MapContainer
                className="routeMap"
                bounds={bounds ?? undefined}
                center={bounds ? undefined : [10.289, 103.984]}
                zoom={13}
                scrollWheelZoom={false}
            >
                {showTiles ? (
                    <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                ) : null}

                <GeoJSON
                    data={data as GeoJSON.FeatureCollection}
                    style={(feature) => {
                        const typed = feature as RouteFeature;
                        const kind = typed.properties?.type;

                        if (kind === "route") {
                            return {
                                color: "#0ea5e9",
                                weight: 5,
                                opacity: 0.9,
                            };
                        }

                        return {
                            color: "#34d399",
                            weight: 4,
                            opacity: 0.8,
                        };
                    }}
                    pointToLayer={(feature, latlng) => {
                        const typed = feature as RouteFeature;
                        const order = typed.properties?.order;

                        return L.marker(latlng, {
                            icon: makeRoutePointIcon(order, maxOrder),
                        });
                    }}
                    onEachFeature={(feature, layer) => {
                        const typed = feature as RouteFeature;
                        const name = typed.properties?.name;
                        const description = typed.properties?.description;
                        const order = typed.properties?.order;

                        let badge = "";
                        if (order === 1) badge = "출발";
                        else if (typeof order === "number" && maxOrder && order === maxOrder) badge = "도착";
                        else if (typeof order === "number") badge = `${order}번`;

                        if (name || description) {
                            layer.bindPopup(`
                <div style="font-family: system-ui, sans-serif;">
                  ${
                                badge
                                    ? `<div style="font-size:12px; font-weight:800; color:#0ea5e9; margin-bottom:4px;">${badge}</div>`
                                    : ""
                            }
                  ${
                                name
                                    ? `<div style="font-weight:700; margin-bottom:4px;">${name}</div>`
                                    : ""
                            }
                  ${
                                description
                                    ? `<div style="font-size:12px; color:#475569;">${description}</div>`
                                    : ""
                            }
                </div>
              `);
                        }
                    }}
                />
            </MapContainer>
        </div>
    );
}