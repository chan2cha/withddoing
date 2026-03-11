import day1Route from "./day1.json"
import day2Route from "./day2.json"
import day3Route from "./day3.json"
import day4Route from "./day4.json"
import day5Route from "./day5.json"
import {RouteFeatureCollection} from "@/types/map";

export const mapRoute :Record<string,RouteFeatureCollection|undefined>= {
        "1" : day1Route as RouteFeatureCollection,
        "2" : day2Route as RouteFeatureCollection,
        "3" : day3Route as RouteFeatureCollection,
        "4" : day4Route as RouteFeatureCollection,
        "5" : day5Route as RouteFeatureCollection

}


