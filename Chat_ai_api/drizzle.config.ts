import {config } from "dotenv" ;
import { defineConfig } from "drizzle-kit";

config({path: ".env.local"});
export default defineConfig({
    schema: "./src/db/schema.ts",
    dialect: "postgresql",
    out: "./drizzle",
    dbCredentials: {
        url: process.env.DATABASE_URL || "",
        ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
    },
    verbose: true,
    breakpoints: true,
})
