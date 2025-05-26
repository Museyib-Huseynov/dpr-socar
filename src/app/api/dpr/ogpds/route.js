import { getPool } from '@/util/db';

export async function GET() {
  let query = `
    SELECT DISTINCT
      o.*
    FROM
      ogpd o
    LEFT JOIN 
      fields f ON o.id = f.ogpd_id
    LEFT JOIN
      complete_table ct ON f.name = ct.field;
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
