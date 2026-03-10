import type { RouteFeatureCollection, RouteFeature } from "@/types/map";

export function getPointFeatures(data: RouteFeatureCollection) {
    return data.features.filter(
        (feature) =>
            feature.geometry.type === "Point" ||
            feature.geometry.type === "MultiPoint"
    );
}

export function getLineFeatures(data: RouteFeatureCollection) {
    return data.features.filter(
        (feature) =>
            feature.geometry.type === "LineString" ||
            feature.geometry.type === "MultiLineString"
    );
}

export function getBoundsFromGeoJson(data: RouteFeatureCollection): [
    [number, number],
    [number, number]
] | null {
    const coords: [number, number][] = [];

    for (const feature of data.features) {
        const geometry = feature.geometry;

        if (geometry.type === "Point") {
            const [lng, lat] = geometry.coordinates;
            coords.push([lat, lng]);
        }

        if (geometry.type === "MultiPoint" || geometry.type === "LineString") {
            for (const [lng, lat] of geometry.coordinates) {
                coords.push([lat, lng]);
            }
        }

        if (geometry.type === "MultiLineString") {
            for (const line of geometry.coordinates) {
                for (const [lng, lat] of line) {
                    coords.push([lat, lng]);
                }
            }
        }
    }

    if (!coords.length) return null;

    const lats = coords.map(([lat]) => lat);
    const lngs = coords.map(([, lng]) => lng);

    return [
        [Math.min(...lats), Math.min(...lngs)],
        [Math.max(...lats), Math.max(...lngs)],
    ];
}