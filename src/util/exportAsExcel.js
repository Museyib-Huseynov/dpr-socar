import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const exportToExcel = (data, fileName = 'report.xlsx') => {
  // Convert JSON to worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Create a workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // Generate buffer
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  // Create Blob and save
  const dataBlob = new Blob([excelBuffer], {
    type: 'application/octet-stream',
  });
  saveAs(dataBlob, fileName);
};

export default exportToExcel;
