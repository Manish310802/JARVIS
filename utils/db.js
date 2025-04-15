import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema'; // Change this path to the location of your schema file
const sql = neon(process.env.NEXT_PUBLIC_DRIZZLE_DB_URL);
export const db = drizzle(sql,{schema} );
