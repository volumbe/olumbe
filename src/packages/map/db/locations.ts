import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { locations } from "./drizzle/schema";

// Database client
const databaseUrl = process.env.MAP_DATABASE_URL;
if (!databaseUrl) {
  throw new Error("MAP_DATABASE_URL is not set in environment variables");
}

const sqlClient = postgres(databaseUrl, { max: 1 });
const db = drizzle(sqlClient);

export type Location = InferSelectModel<typeof locations>;
export type NewLocation = Omit<
  InferInsertModel<typeof locations>,
  "id" | "createdAt"
>;
export type UpdateLocationInput = Partial<
  Pick<Location, "timestamp" | "latitude" | "longitude" | "accuracy">
>;

export async function createLocation(input: NewLocation): Promise<Location> {
  const [row] = await db.insert(locations).values(input).returning();
  return row;
}

export async function getLocationById(id: string): Promise<Location | null> {
  const rows = await db
    .select()
    .from(locations)
    .where(eq(locations.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function listLocations(options?: {
  limit?: number;
  offset?: number;
  fromTimestamp?: string;
  toTimestamp?: string;
  order?: "asc" | "desc";
}): Promise<Location[]> {
  const limit = options?.limit ?? 100;
  const offset = options?.offset ?? 0;
  const orderExpr =
    options?.order === "asc" ? locations.createdAt : desc(locations.createdAt);

  const conditions = [] as Array<
    ReturnType<typeof gte> | ReturnType<typeof lte>
  >;
  if (options?.fromTimestamp) {
    conditions.push(gte(locations.timestamp, options.fromTimestamp));
  }
  if (options?.toTimestamp) {
    conditions.push(lte(locations.timestamp, options.toTimestamp));
  }

  const base = db.select().from(locations);
  const filtered =
    conditions.length > 0 ? base.where(and(...conditions)) : base;
  const rows = await filtered.orderBy(orderExpr).limit(limit).offset(offset);
  return rows as Location[];
}

export async function updateLocation(
  id: string,
  input: UpdateLocationInput
): Promise<Location | null> {
  if (Object.keys(input).length === 0) return getLocationById(id);
  const [row] = await db
    .update(locations)
    .set(input)
    .where(eq(locations.id, id))
    .returning();
  return row ?? null;
}

export async function deleteLocation(id: string): Promise<boolean> {
  const deleted = await db
    .delete(locations)
    .where(eq(locations.id, id))
    .returning({ id: locations.id });
  return deleted.length > 0;
}

export const locationDb = {
  create: createLocation,
  getById: getLocationById,
  list: listLocations,
  update: updateLocation,
  delete: deleteLocation,
};
