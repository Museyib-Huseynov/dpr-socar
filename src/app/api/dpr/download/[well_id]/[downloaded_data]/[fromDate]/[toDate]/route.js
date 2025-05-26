import { getPool } from '@/util/db';

export async function GET(request, { params }) {
  let { well_id, downloaded_data, fromDate, toDate } = await params;
  downloaded_data = downloaded_data.split(',').map((i) => +i);

  let query = `
    SELECT
      CONVERT(VARCHAR(10), report_date, 120) AS "Tarix",
      field AS "Yataq",
      platform AS "Özül / Mədən",
      well AS "Quyu",
      ${
        downloaded_data.includes(1)
          ? `well_stock_category AS "Quyu fondu",`
          : ``
      }
      ${
        downloaded_data.includes(2)
          ? `production_well_stock_sub_category AS "İstismar fond alt kat",`
          : ``
      }
      ${
        downloaded_data.includes(3)
          ? `production_method AS "İstismar üsulu",`
          : ``
      }
      ${downloaded_data.includes(4) ? `horizon AS "Horizont",` : ``}
      ${
        downloaded_data.includes(5)
          ? `completion_interval AS "Tamamlama intervalı",`
          : ``
      }
      ${downloaded_data.includes(6) ? `casing AS "İstismar kəməri",` : ``}
      ${
        downloaded_data.includes(7)
          ? `tubing1_depth AS "1-ci sıra (diameter)", tubing1_length AS "1-ci sıra (uzunluq)",`
          : ``
      }
      ${
        downloaded_data.includes(8)
          ? `tubing2_depth AS "2-ci sıra (diameter)", tubing2_length AS "2-ci sıra (uzunluq)",`
          : ``
      }
      ${
        downloaded_data.includes(9)
          ? `tubing3_depth AS "3-ci sıra (diameter)", tubing3_length AS "3-ci sıra (uzunluq)",`
          : ``
      }
      ${
        downloaded_data.includes(47)
          ? `flowmeter AS "Hansı sərfölçənə işləyir",`
          : ``
      }
      ${
        downloaded_data.includes(10)
          ? `well_uptime_hours AS "İşləmə saatı",`
          : ``
      }
      ${downloaded_data.includes(11) ? `liquid_ton AS "Maye (ton)",` : ``}
      ${
        downloaded_data.includes(12)
          ? `oil_ton_wellTest AS "Neft (ton) - ölçü",`
          : ``
      }
      ${
        downloaded_data.includes(13)
          ? `oil_ton_allocated AS "Neft (ton) - paylanılmış",`
          : ``
      }
      ${downloaded_data.includes(14) ? `water_ton AS "Su (ton)",` : ``}
      ${downloaded_data.includes(15) ? `total_gas AS "Cəm qaz (m3)",` : ``}
      ${
        downloaded_data.includes(16) ? `gaslift_gas AS "Qazlift qaz (m3)",` : ``
      }
      ${
        downloaded_data.includes(17)
          ? `produced_gas AS "Çıxarılan qaz (m3)",`
          : ``
      }
      ${
        downloaded_data.includes(18)
          ? `mechanical_impurities AS "Mexaniki qarışıq",`
          : ``
      }
      ${downloaded_data.includes(19) ? `Pqa AS "Pqa",` : ``}
      ${downloaded_data.includes(20) ? `Phf AS "Phf",` : ``}
      ${downloaded_data.includes(21) ? `Pba AS "Pba",` : ``}
      ${downloaded_data.includes(22) ? `P6x9 AS "P6x9",` : ``}
      ${downloaded_data.includes(23) ? `P9x13 AS "P9x13",` : ``}
      ${downloaded_data.includes(24) ? `P13x20 AS "P13x20",` : ``}
      ${downloaded_data.includes(25) ? `choke AS "Ştuser",` : ``}
      ${
        downloaded_data.includes(26)
          ? `pump_depth AS "Nasosun buraxılma dərinliyi",`
          : ``
      }
      ${downloaded_data.includes(27) ? `pump_frequency AS "Tezlik",` : ``}
      ${
        downloaded_data.includes(28)
          ? `pump_hydrostatic_pressure AS "Nasosa düşən təzyiq",`
          : ``
      }
      ${
        downloaded_data.includes(29)
          ? `esp_pump_size AS "Nasosun qabariti (MEDN)",`
          : ``
      }
      ${
        downloaded_data.includes(30)
          ? `esp_pump_stages AS "Nasosun pillələrinin sayı (MEDN)",`
          : ``
      }
      ${
        downloaded_data.includes(31)
          ? `esp_pump_rate AS "Nasosun verimi (MEDN)",`
          : ``
      }
      ${
        downloaded_data.includes(32)
          ? `esp_pump_head AS "Nasosun basqısı (MEDN)",`
          : ``
      }
      ${
        downloaded_data.includes(33)
          ? `esp_downhole_gas_separator AS "Quyuiçi qaz separatoru (MEDN)",`
          : ``
      }
      ${
        downloaded_data.includes(34)
          ? `srp_pumpjack_type AS "Mancanaq dəzgahının növü",`
          : ``
      }
      ${
        downloaded_data.includes(35)
          ? `srp_pump_plunger_diameter AS "Plunjerin diametri (ŞDN)",`
          : ``
      }
      ${
        downloaded_data.includes(36)
          ? `srp_plunger_stroke_length AS "Plunjerin gediş yolu (ŞDN)",`
          : ``
      }
      ${
        downloaded_data.includes(37)
          ? `srp_balancer_oscillation_frequency AS "Balansirin yırğalanma sayı (ŞDN)",`
          : ``
      }
      ${
        downloaded_data.includes(38)
          ? `srp_pump_rate_coefficient AS "Nasosun verim əmsalı (ŞDN)",`
          : ``
      }
      ${
        downloaded_data.includes(39)
          ? `srp_max_motor_speed AS "Elek.müh.mak.dövr.say (ŞDN)",`
          : ``
      }
      ${
        downloaded_data.includes(40)
          ? `srp_shaft_diameter AS "Şkifin diametri (ŞDN)",`
          : ``
      }
      ${
        downloaded_data.includes(41)
          ? `pcp_pump_rate AS "Nasosun verimi (Vintli)",`
          : ``
      }
      ${
        downloaded_data.includes(42)
          ? `pcp_rpm AS "Dövrlər sayı (Vintli)",`
          : ``
      }
      ${
        downloaded_data.includes(43)
          ? `pcp_screw_diameter AS "Vintin diametri",`
          : ``
      }
      ${
        downloaded_data.includes(44)
          ? `donwtime_category AS "İtki kateqoriyası",`
          : ``
      }
      ${
        downloaded_data.includes(45)
          ? `production_skin AS "İtki təbəqəsi",`
          : ``
      }
      ${downloaded_data.includes(46) ? `comments AS "Rəylər",` : ``}
    FROM 
      complete_table ct
    JOIN 
      wells w ON w.name = ct.well
    WHERE 
      w.id IN (${well_id})
        AND 
      ct.report_date BETWEEN '${fromDate}' AND '${toDate}'
    ORDER BY 
      report_date DESC;
  `;

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
