"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, Circle, Pane } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import styles from "./PixelMap.module.css";
import type { MapLocation } from "./models/location";

export type PixelMapProps = {
  locations: MapLocation[];
  center?: LatLngExpression;
  zoom?: number;
  className?: string;
  style?: React.CSSProperties;
  /**
   * Tile URL template. Defaults to OSM raster tiles.
   * Note: Be respectful of usage policies for any provider used here.
   */
  tileUrlTemplate?: string;
  /**
   * Tile attribution HTML string.
   */
  attribution?: string;
};

export function PixelMap({
  locations,
  center,
  zoom = 3,
  className,
  style,
  tileUrlTemplate = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}: PixelMapProps) {
  const defaultCenter = useMemo<LatLngExpression>(() => {
    if (center) return center;
    if (locations && locations.length > 0) {
      return [locations[0].latitude, locations[0].longitude];
    }
    return [20, 0];
  }, [center, locations]);

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
        maxZoom={18}
        worldCopyJump
      >
        <TileLayer url={tileUrlTemplate} attribution={attribution} />

        {/* Render accuracy circles above tiles for clarity */}
        <Pane name="accuracy-circles" style={{ zIndex: 450 }}>
          {locations.map((loc, idx) => (
            <Circle
              key={loc.id ?? idx}
              center={[loc.latitude, loc.longitude]}
              radius={Math.max(0, loc.accuracy)}
              pathOptions={{
                color: "#22d3ee",
                fillColor: "#22d3ee",
                fillOpacity: 0.2,
              }}
            />
          ))}
        </Pane>
      </MapContainer>
    </div>
  );
}

export default PixelMap;
