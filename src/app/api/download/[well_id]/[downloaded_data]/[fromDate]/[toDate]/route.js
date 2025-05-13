import { getPool } from '@/util/db';

export async function GET(request, { params }) {
  const { well_id, downloaded_data, fromDate, toDate } = await params;
  console.log('parms', params);

  let query = `
    SELECT
      rd.report_date AS Tarix,
      f.name AS Yataq,
      COALESCE(p.name, '') +' / ' + COALESCE(p.square, '') AS "Özül / Mədən",
      w.name AS Quyu,
      wsc.name "Quyu fondu",
      pwssc.name AS "İstismar fond alt kat",
      pm.name AS "İstismar üsulu",
      --INCLUDE_COMPLETIONS_DATA--
      --INCLUDE_PRESSURE_DATA--
      --INCLUDE_PRODUCTION_DATA--
      --INCLUDE_PUMP_DATA--
      --INCLUDE_LOSS_DATA--

    FROM daily_well_parameters AS dwp

    LEFT JOIN well_stock AS ws
      ON dwp.well_id = ws.well_id
      AND ws.report_date_id = (
        SELECT MAX(ws_sub.report_date_id)
        FROM well_stock AS ws_sub
        WHERE ws_sub.well_id = dwp.well_id
        AND ws_sub.report_date_id <= dwp.report_date_id
      )

    LEFT JOIN completions AS c
      ON dwp.well_id = c.well_id
      AND c.report_date_id = (
        SELECT MAX(c_sub.report_date_id)
        FROM completions AS c_sub
        WHERE c_sub.well_id = dwp.well_id
        AND c_sub.report_date_id <= dwp.report_date_id
      )

    LEFT JOIN well_downtime_reasons AS wdr
        ON dwp.well_id = wdr.well_id
        AND wdr.report_date_id = (
            SELECT MAX(wdr_sub.report_date_id)
            FROM well_downtime_reasons AS wdr_sub
            WHERE wdr_sub.well_id = dwp.well_id
            AND wdr_sub.report_date_id <= dwp.report_date_id
        )

    LEFT JOIN well_tests AS wt
        ON dwp.well_id = wt.well_id
        AND wt.report_date_id = (
            SELECT MAX(wt_sub.report_date_id)
            FROM well_tests AS wt_sub
            WHERE wt_sub.well_id = dwp.well_id
            AND wt_sub.report_date_id <= dwp.report_date_id
        )

    LEFT JOIN laboratory_results as lr
        ON dwp.well_id = lr.well_id
        AND lr.report_date_id = (
          SELECT MAX(lr_sub.report_date_id)
          FROM laboratory_results AS lr_sub
          WHERE lr_sub.well_id = dwp.well_id
          AND lr_sub.report_date_id <= dwp.report_date_id
        )

    LEFT JOIN gas_well_tests as gwt
        ON dwp.well_id = gwt.well_id
        AND gwt.report_date_id = (
          SELECT MAX(gwt_sub.report_date_id)
          FROM gas_well_tests AS gwt_sub
          WHERE gwt_sub.well_id = dwp.well_id
          AND gwt_sub.report_date_id <= dwp.report_date_id
        )

    LEFT JOIN report_dates AS rd
        ON dwp.report_date_id = rd.id

    LEFT JOIN wells AS w
        ON dwp.well_id = w.id

    LEFT JOIN platforms AS p
        ON w.platform_id = p.id

    LEFT JOIN fields AS f
        ON p.field_id = f.id

    LEFT JOIN well_stock_categories AS wsc
        ON ws.well_stock_category_id = wsc.id

    LEFT JOIN production_well_stock_sub_categories AS pwssc
        ON ws.production_well_stock_sub_category_id = pwssc.id

    LEFT JOIN production_methods AS pm
        ON ws.production_method_id = pm.id

    LEFT JOIN horizons AS h
        ON c.horizon_id = h.id

    LEFT JOIN production_sub_skins_activities AS pssa
        ON wdr.production_sub_skins_activity_id = pssa.id

    WHERE w.id IN (${well_id}) AND rd.report_date >= '${fromDate}' AND rd.report_date <= '${toDate}';
  `;

  if (downloaded_data.includes(1)) {
    query = query.replace(
      '--INCLUDE_PRESSURE_DATA--',
      `
      dwp.pqa AS Pqa,
      dwp.phf AS Phf,
      dwp.pba AS Pba,
      dwp.p6x9 AS P6x9,
      dwp.p9x13 AS P9x13,
      dwp.p13x20 AS P13x20,
      dwp.choke AS ştuser,
    `
    );
  } else {
    query = query.replace('--INCLUDE_PRESSURE_DATA--', '');
  }

  if (downloaded_data.includes(2)) {
    query = query.replace(
      '--INCLUDE_PRODUCTION_DATA--',
      `
      dwp.well_uptime_hours AS "İşləmə saatı",  
      ROUND(wt.liquid_ton, 0) AS "Maye (ton)",
      ROUND(lr.water_cut, 1) AS Sulaşma,
      CASE
          WHEN f.name <> N'Günəşli' THEN ISNULL(wt.oil_ton, 0)
          WHEN h.oil_density = 0 AND lr.water_cut = 0 THEN 0
          ELSE ROUND(wt.liquid_ton * h.oil_density * (1 - (lr.water_cut / 100)) / (h.oil_density * (1 - (lr.water_cut / 100)) + (lr.water_cut / 100)), 0)
      END AS "Neft (ton) - ölçü",
      (SELECT mr.produced_oil / (DAY(rd_sub.report_date))
        FROM monthly_reported mr
        INNER JOIN report_dates rd_sub ON mr.report_date_id = rd_sub.id
        WHERE mr.field_id = f.id
        AND rd_sub.report_date = EOMONTH(rd.report_date)) * 
      CASE
          WHEN f.name <> N'Günəşli' THEN ISNULL(wt.oil_ton, 0)
          WHEN h.oil_density = 0 AND lr.water_cut = 0 THEN 0
          ELSE ROUND(wt.liquid_ton * h.oil_density * (1 - (lr.water_cut / 100)) / (h.oil_density * (1 - (lr.water_cut / 100)) + (lr.water_cut / 100)), 0)
      END
      /
      NULLIF(
        SUM(
          CASE
              WHEN f.name <> N'Günəşli' THEN ISNULL(wt.oil_ton, 0)
              WHEN h.oil_density = 0 AND lr.water_cut = 0 THEN 0
              ELSE ROUND(wt.liquid_ton * h.oil_density * (1 - (lr.water_cut / 100)) / (h.oil_density * (1 - (lr.water_cut / 100)) + (lr.water_cut / 100)), 0)
          END
        ) OVER (PARTITION BY f.id, rd.report_date), 0) AS "Neft (ton) - paylanılmış",
      CASE
          WHEN f.name <> N'Günəşli' THEN ISNULL(wt.water_ton, 0)
          WHEN h.oil_density = 0 AND lr.water_cut = 0 THEN 0
          ELSE ROUND(wt.liquid_ton * (lr.water_cut / 100) / (h.oil_density * (1 - (lr.water_cut / 100)) + (lr.water_cut / 100)), 0)
      END AS "Su (ton)",
      ROUND(gwt.total_gas, 0) AS "Cəm qaz (m3)",
      ROUND(gwt.gaslift_gas, 0) AS "Qazlift qaz (m3)",
      ROUND((gwt.total_gas - gwt.gaslift_gas) * dwp.well_uptime_hours / 24, 0) AS "Hasil olunan qaz (m3)",
      ROUND(lr.mechanical_impurities, 1) AS "Mexaniki qarışıq",
      `
    );
  } else {
    query = query.replace('--INCLUDE_PRODUCTION_DATA--', '');
  }

  if (downloaded_data.includes(3)) {
    query = query.replace(
      '--INCLUDE_COMPLETIONS_DATA--',
      `
      h.name AS horizon,
      c.completion_interval AS "Tamamlama intervalı",
      c.tubing1_depth AS "1-ci sıra",
      c.tubing1_length AS "1-ci sıra",
      c.tubing2_depth AS "2-ci sıra",
      c.tubing2_length AS "2-ci sıra",
      c.tubing3_depth AS "3-cü sıra",
      c.tubing3_length AS "3-cü sıra",
    `
    );
  } else {
    query = query.replace('--INCLUDE_COMPLETIONS_DATA--', '');
  }

  if (downloaded_data.includes(4)) {
    query = query.replace(
      '--INCLUDE_PUMP_DATA--',
      `
      dwp.pump_depth AS "Nasosun buraxılma dərinliyi",
      dwp.pump_frequency AS "Tezlik",
      dwp.pump_hydrostatic_pressure AS "Nasosa düşən təzyiq",
      dwp.esp_pump_size AS "Nasosun qabariti (MEDN)",
      dwp.esp_pump_stages AS "Nasosun pillələrinin sayı (MEDN)",
      dwp.esp_pump_rate AS "Nasosun verimi (MEDN)",
      dwp.esp_pump_head AS "Nasosun basqısı",
      dwp.esp_downhole_gas_separator AS "Quyuiçi qaz separatoru",
      dwp.srp_pumpjack_type AS "Mancanaq dəzgahının növü",
      dwp.srp_pump_plunger_diameter AS "Plunjerin diametri (ŞDN)",
      dwp.srp_plunger_stroke_length AS "Plunjerin gediş yolu (ŞDN)",
      dwp.srp_balancer_oscillation_frequency AS "Balansirin yırğalanma sayı (ŞDN)",
      dwp.srp_pump_rate_coefficient AS "Nasosun verim əmsalı (ŞDN)",
      dwp.srp_max_motor_speed AS "Elek.müh.mak.dövr.say (ŞDN)",
      dwp.srp_shaft_diameter AS "Şkifin diametri (ŞDN)",
      dwp.pcp_pump_rate AS "Nasosun verimi (Vintli)",
      dwp.pcp_rpm AS "Dövrlər sayı (Vintli)",
      dwp.pcp_screw_diameter AS "Vintin diametri",  
    `
    );
  } else {
    query = query.replace('--INCLUDE_PUMP_DATA--', ``);
  }

  if (downloaded_data.includes(5)) {
    query = query.replace(
      '--INCLUDE_LOSS_DATA--',
      `
      wdr.downtime_category AS "İtki kateqoriyası",
      pssa.name AS "İtki təbəqəsi",
      wdr.comments AS "Rəylər",
    `
    );
  } else {
    query = query.replace('--INCLUDE_LOSS_DATA--', ``);
  }

  query = query.replace(/,\s*FROM/i, ' FROM');

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
