import React, { useEffect, useRef } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";

import "ol/ol.css";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";

useGeographic();

const osmLayer = new TileLayer({ source: new OSM() });
const skoleLayer = new VectorLayer({
  source: new VectorSource({
    url: "/KWS-Lecture4-5/api/skoler",
    format: new GeoJSON(),
  }),
});

const map = new Map({
  view: new View({ center: [10.8, 59.9], zoom: 10 }),
  layers: [osmLayer, skoleLayer],
});

export function Application() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    map.setTarget(mapRef.current!);
  }, []);

  return <div ref={mapRef}></div>;
}
