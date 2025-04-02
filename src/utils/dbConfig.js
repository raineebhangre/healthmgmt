import {neon} from '@neondatabase/serverless'
import {drizzle} from 'drizzle-orm/neon-http'
import * as schema from "./schema.js";  // ✅ Use "./" for same folder

const sql = neon(
   "postgresql://neondb_owner:npg_4LyzFYwfuTQ6@ep-withered-hat-a5gqryau-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require",
);  // ✅ Use Vite's env system

export const db = drizzle(sql,{schema});