import { getClient } from '@/util/db';

export async function GET() {
  let query = `
    SELECT DISTINCT
      o.*
    FROM
      ogpd o
    JOIN
      daily_operatives doo ON o.id = doo.ogpd_id;
  `;

  try {
    const client = await getClient();
    const result = await client.query(query);

    return Response.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ error: 'Database query failed' }), {
      status: 500,
    });
  }
}
