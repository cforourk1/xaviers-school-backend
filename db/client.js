/*
pg is nodes postgres driver - new pg.client (and url section) creates a new database client using the string in the .env file. export it so any query file can import and run sql

*/

import pg from "pg";
const db = new pg.Client(process.env.DATABASE_URL);
export default db;
