import { getPool } from '@/util/db';

export async function GET(request, { params }) {
  const { tableName } = await params;

  try {
    const pool = await getPool();
    const result = await pool.request().query(`SELECT * FROM ${tableName}`);

    return Response.json(result.recordset);
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ error: 'Database query failed' }), {
      status: 500,
    });
  }
}
