import pg from 'pg';
const { Pool } = pg;

let client = null;

export const getClient = async () => {
  if (client) return client;

  let pool = new Pool({
    host: process.env.NEXT_DB_HOST,
    port: Number(process.env.NEXT_DB_PORT),
    database: process.env.NEXT_DB_NAME,
    user: process.env.NEXT_DB_USER,
    password: process.env.NEXT_DB_PASSWORD,
    ssl: false,
  });

  try {
    client = await pool.connect();
    return client;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};
