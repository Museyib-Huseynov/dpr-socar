import { getPool } from '@/util/db';

export async function GET(request, { params }) {
  const { arr } = await params;

  try {
    const pool = await getPool();
    const result = await pool.request().query(
      `
        SELECT 
          rd.report_date 
        FROM 
          daily_well_parameters dwp 
        JOIN 
          report_dates rd ON dwp.report_date_id = rd.id 
        WHERE 
          well_id IN (${arr})
      `
    );

    return Response.json(result.recordset);
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ error: 'Database query failed' }), {
      status: 500,
    });
  }
}
