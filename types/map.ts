import {GeoJSON} from "react-leaflet";

export type RouteGeometry =
    | GeoJSON.LineString
    | GeoJSON.MultiLineString
    | GeoJSON.Point
    | GeoJSON.MultiPoint;

export interface RouteFeatureProperties {
    name?: string;
    description?: string;
    type?: "route" | "stop" | "poi";
    day?: string;
    order?: number;
}

export type RouteFeature = GeoJSON.Feature<
    RouteGeometry,
    RouteFeatureProperties
>;

export type RouteFeatureCollection = GeoJSON.FeatureCollection<
    RouteGeometry,
    RouteFeatureProperties
>;