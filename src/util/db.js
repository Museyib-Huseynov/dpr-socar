import mssql from 'mssql';

let pool = null;

export const getPool = async () => {
  if (pool) return pool;

  const config = {
    user: 'museyib',
    password: '3231292',
    server: 'localhost',
    port: 1433,
    database: 'dpr_11',
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
    requestTimeout: 60000, // 60 seconds for queries
    connectionTimeout: 30000, // 30 seconds to connect
  };

  try {
    pool = await mssql.connect(config);
    return pool;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};
