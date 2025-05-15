import { getPool } from '@/util/db';

export async function GET(request, { params }) {
  const { tableName } = await params;

  let query = `SELECT * FROM ${tableName}`;
  if (tableName === 'wells') {
    query = `
      SELECT 
        w.*, 
        CASE 
          WHEN p.square IS NOT NULL THEN CONCAT(p.name, ' / ', p.square)
          ELSE p.name
        END AS platform_name
      FROM wells w
      JOIN platforms p ON p.id = w.platform_id;`;
  }

  try {
    const pool = await getPool();
    const result = await pool.request().query(query);

    return Response.json(result.recordset);
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ error: 'Database query failed' }), {
      status: 500,
    });
  }
}
