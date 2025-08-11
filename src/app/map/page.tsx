import { PixelMap } from "@/packages/map";
import type { MapLocation } from "@/packages/map";
import { listLocations } from "@/packages/map/db/locations";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const rows = await listLocations({ limit: 500, order: "desc" });

  const locations: MapLocation[] = rows.map((r) => ({
    id: r.id,
    timestamp: r.timestamp,
    latitude: r.latitude,
    longitude: r.longitude,
    accuracy: r.accuracy,
  }));

  return (
    <section className="w-full h-[70dvh] max-w-6xl mx-auto p-4 relative">
      <div className="h-full w-full rounded-lg overflow-hidden ring-1 ring-slate-700/40">
        <PixelMap
          locations={locations}
          zoom={2}
          style={{ height: "100%", width: "100%" }}
        />
      </div>
    </section>
  );
}
