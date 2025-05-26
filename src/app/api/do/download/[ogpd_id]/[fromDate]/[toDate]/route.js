import { getPool } from '@/util/db';

export async function GET(request, { params }) {
  let { ogpd_id, fromDate, toDate } = await params;

  let query = `
    SELECT 
      CONVERT(VARCHAR(10), rd.report_date, 120) AS "Tarix",
      o.name AS "Yataq",
      do.produced_oil_planned AS "Neft Hasilatı Plan (ton)",
      do.produced_oil_fact AS "Neft Hasilatı Fakt (ton)",
      do.produced_condensate_planned AS "Kondensat Hasilatı Plan (ton)",
      do.produced_condensate_fact AS "Kondensat Hasilatı Fakt (ton)",
      do.produced_gas_planned AS "Qaz Hasilatı Plan (min m3)",
      do.produced_gas_fact AS "Qaz Hasilatı Fakt (min m3)",
      do.produced_water AS "Su Hasilatı Fakt (ton)",
      do.injected_water AS "Vurulan su Fakt (ton)",
      do.collected_oil_planned AS "Neft yığımı Plan (ton)",
      do.collected_oil_fact AS "Neft yığımı Fakt (ton)",
      do.collected_condensate_planned AS "Kondensat yığımı Plan (ton)",
      do.collected_condensate_fact AS "Kondensat yığımı Fakt (ton)",
      do.delivered_oil_planned AS "Neft təhvili Plan (ton)",
      do.delivered_oil_fact AS "Neft təhvili Fakt (ton)",
      do.delivered_condensate_planned AS "Kondensat təhvili Plan (ton)",
      do.delivered_condensate_fact AS "Kondensat təhvili Fakt (ton)",
      do.delivered_gas_planned AS "Qaz təhvili Plan (min m3)",
      do.delivered_gas_fact AS "Qaz təhvili Fakt (min m3)"
    FROM 
      daily_operatives do
    JOIN 
      report_dates rd ON do.report_date_id = rd.id
    JOIN 
      ogpd o ON do.ogpd_id = o.id
    WHERE 
      do.ogpd_id IN (${ogpd_id})
        AND
      rd.report_date BETWEEN '${fromDate}' AND '${toDate}'
    ORDER BY
      rd.report_date DESC;
  `;

  console.log(query);

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
