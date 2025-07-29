import { getClient } from '@/util/db';

export async function GET(request, { params }) {
  const { arr } = await params;

  try {
    const client = await getClient();
    const result = await client.query(
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

    return Response.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ error: 'Database query failed' }), {
      status: 500,
    });
  }
}
