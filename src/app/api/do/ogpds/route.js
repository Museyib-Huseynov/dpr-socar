import { getPool } from '@/util/db';

export async function GET() {
  let query = `
    SELECT
      o.*
    FROM
      ogpd o
    JOIN
      daily_operatives do ON o.id = do.ogpd_id;
  `;

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
