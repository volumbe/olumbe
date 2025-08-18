"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Circle, Pane, GeoJSON } from "react-leaflet";
import type { LatLngExpression, PathOptions } from "leaflet";
import styles from "./PixelMap.module.css";
import type { MapLocation } from "./models/location";

// Minimal types to avoid external imports
type SimpleFeature = {
  type: "Feature";
  geometry?: { type: string; coordinates: any } | null;
  properties?: Record<string, unknown> | null;
};

type SimpleFeatureCollection = {
  type: "FeatureCollection";
  features: SimpleFeature[];
};

export type PixelMapProps = {
  locations: MapLocation[];
  center?: LatLngExpression;
  zoom?: number;
  className?: string;
  style?: React.CSSProperties;
  /** Tile URL template. When minimalBorders is true and this is undefined, no raster tiles are shown. */
  tileUrlTemplate?: string;
  /** Tile attribution HTML string. */
  attribution?: string;
  /** If true, hides base tiles and renders only blocky country borders. */
  minimalBorders?: boolean;
  /** Quantization step in degrees for border vertices to make them more pixelated. */
  borderQuantizeStep?: number;
  /** Style for the country border outlines. */
  borderStyle?: PathOptions;
};

async function fetchWorldBorders(): Promise<SimpleFeatureCollection> {
  // Public GeoJSON of countries (Natural Earth based)
  const url =
    "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";
  const res = await fetch(url, { cache: "force-cache" });
  if (!res.ok) throw new Error("Failed to load world borders geojson");
  const geojson = (await res.json()) as SimpleFeatureCollection;
  return geojson;
}

function quantizeCoord(value: number, step: number): number {
  return Math.round(value / step) * step;
}

function quantizeFeatureCollection(
  fc: SimpleFeatureCollection,
  step: number
): SimpleFeatureCollection {
  const quantizePosition = (pos: number[]): number[] => [
    quantizeCoord(pos[0] as number, step),
    quantizeCoord(pos[1] as number, step),
  ];

  const quantizeCoords = (coords: any): any => {
    if (typeof coords[0] === "number") {
      return quantizePosition(coords as number[]);
    }
    return (coords as any[]).map(quantizeCoords);
  };

  return {
    type: "FeatureCollection",
    features: fc.features.map((f: SimpleFeature) => ({
      ...f,
      geometry: f.geometry && {
        ...f.geometry,
        coordinates: quantizeCoords((f.geometry as any).coordinates),
      },
    })),
  } as SimpleFeatureCollection;
}

export function PixelMap({
  locations,
  center,
  zoom = 3,
  className,
  style,
  tileUrlTemplate,
  attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  minimalBorders = true,
  borderQuantizeStep = 0.5,
  borderStyle = { color: "#64748b", weight: 1.5, opacity: 0.9 },
}: PixelMapProps) {
  const defaultCenter = useMemo<LatLngExpression>(() => {
    if (center) return center;
    if (locations && locations.length > 0) {
      return [locations[0].latitude, locations[0].longitude];
    }
    return [20, 0];
  }, [center, locations]);

  const [borders, setBorders] = useState<SimpleFeatureCollection | null>(null);

  useEffect(() => {
    if (!minimalBorders) return;
    let cancelled = false;
    fetchWorldBorders()
      .then((fc) =>
        borderQuantizeStep > 0
          ? quantizeFeatureCollection(fc, borderQuantizeStep)
          : fc
      )
      .then((fc) => {
        if (!cancelled) setBorders(fc);
      })
      .catch(() => {
        if (!cancelled) setBorders(null);
      });
    return () => {
      cancelled = true;
    };
  }, [minimalBorders, borderQuantizeStep]);

  return (
    <div
      className={`${styles.pixelMapContainer} ${className ?? ""}`}
      style={style}
    >
      <MapContainer
        className={styles.mapRoot}
        center={defaultCenter}
        zoom={zoom}
        minZoom={2}
        maxZoom={8}
        worldCopyJump
        zoomSnap={0.5}
        wheelPxPerZoomLevel={180}
      >
        {!minimalBorders && tileUrlTemplate && (
          <TileLayer url={tileUrlTemplate} attribution={attribution} />
        )}

        {minimalBorders && borders && (
          <Pane name="borders" style={{ zIndex: 350 }}>
            <GeoJSON data={borders as any} style={borderStyle} />
          </Pane>
        )}

        <Pane name="accuracy-circles" style={{ zIndex: 450 }}>
          {locations.map((loc, idx) => (
            <Circle
              key={loc.id ?? idx}
              center={[loc.latitude, loc.longitude]}
              radius={Math.max(0, loc.accuracy)}
              pathOptions={{
                color: "#22d3ee",
                fillColor: "#22d3ee",
                fillOpacity: 0.18,
              }}
            />
          ))}
        </Pane>
      </MapContainer>
    </div>
  );
}

export default PixelMap;
