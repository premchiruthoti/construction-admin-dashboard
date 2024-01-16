import { createPool } from "mysql2/promise";

// export async function connectToDB() {
export const client = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
});

//return client;
//}
