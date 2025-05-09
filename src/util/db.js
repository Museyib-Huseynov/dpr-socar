import mssql from 'mssql';

let pool = null;

export const getPool = async () => {
  if (pool) return pool;
  try {
    pool = await mssql.connect(
      'Server=localhost,1433;Database=dpr;User Id=museyib;Password=3231292;Encrypt=false'
    );
    return pool;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};
