import { getPool } from '@/util/db';

export async function GET(request, { params }) {
  let { ogpd_id, fromDate, toDate } = await params;

  let query = `
    SELECT 
      * 
    FROM 
      daily_operatives do
    JOIN 
      report_dates rd ON do.report_date_id = rd.id
    JOIN 
      ogpds o ON do.ogpd_id = o.id
    WHERE 
      do.ogpd_id IN (${ogpd_id})
        AND
      rd.report_date BETWEEN '${fromDate}' AND '${toDate}'
    ORDER BY
      rd.report_date DESC;
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
