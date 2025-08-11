import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/packages/map/db/drizzle",
  schema: "./src/packages/map/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.MAP_DATABASE_URL!,
  },
});
