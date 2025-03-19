import {neon} from '@neondatabase/serverless'
import {drizzle} from 'drizzle-orm/neon-http'
import * as schema from "./schema.js";  // ✅ Use "./" for same folder

const sql = neon(
    "postgresql://neondb_owner:npg_7dIX8QjJkKUT@ep-weathered-math-a8trpw8z-pooler.eastus2.azure.neon.tech/db1?sslmode=require",
);  // ✅ Use Vite's env system

export const db = drizzle(sql,{schema});