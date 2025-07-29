// import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';

// const exportToExcel = (data, fileName = 'report.xlsx') => {
//   console.log(data.length);
//   const worksheet = XLSX.utils.json_to_sheet(data);

//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

//   const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

//   const dataBlob = new Blob([excelBuffer], {
//     type: 'application/octet-stream',
//   });
//   saveAs(dataBlob, fileName);
// };

// export default exportToExcel;

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const exportToExcel = async (data, fileName = 'report.xlsx') => {
  console.log(data.length);
  try {
    if (!Array.isArray(data) || data.length === 0) {
      alert('No data to export.');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // Define columns using keys from first row
    const keys = Object.keys(data[0]);
    worksheet.columns = keys.map((key) => ({
      header: key,
      key: key,
      width: 20,
    }));

    // Stream rows into the worksheet
    for (let i = 0; i < data.length; i++) {
      worksheet.addRow(data[i]);
      // Optionally flush to prevent memory overflow (not needed in browser)
    }

    // Generate buffer and save as .xlsx file
    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, fileName);
  } catch (error) {
    console.error('Failed to export Excel file:', error);
    alert('An error occurred while exporting the Excel file.');
  }
};

export default exportToExcel;
