'use client';

import { useEffect, useState } from 'react';
import { useStaticData } from '@/context/StaticDataContext';
import Select from '@/components/GroupSelect';
import DatePicker from '@/components/DatePicker';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';
import VirtualizedTable from '@/components/VirtualizedTable';
import exportToExcel from '@/util/exportAsExcel';

export default function DO() {
  const { doOGPDs } = useStaticData();
  const [selectedOGPDs, setSelectedOGPDs] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadedData, setDownloadedData] = useState([]);

  const handleViewClick = async () => {
    setLoading(true);
    try {
      const dataResponse = await fetch(
        `/api/do/download/${selectedOGPDs.join(',')}/${dayjs(fromDate).format(
          'YYYY-MM-DD'
        )}/${dayjs(toDate).format('YYYY-MM-DD')}`
      );
      const data = await dataResponse.json();
      setDownloadedData(data);
      return data;
    } catch (error) {
      console.error('Failed to fetch table data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadClick = async () => {
    let dataToExport = downloadedData;

    if (downloadedData.length === 0) {
      dataToExport = await handleViewClick();
    }

    if (dataToExport.length > 0) {
      exportToExcel(dataToExport, 'do.xlsx');
    } else {
      alert('No data to download.');
    }
  };

  return (
    <div className='h-full w-full grid grid-rows-[auto_1fr] overflow-hidden'>
      <div className='h-fit p-7 border-b-2 border-gray-100'>
        <div className='grid place-items-center grid-cols-2 lg:grid-cols-4 gap-4'>
          <Select
            placeholder='NQÇİ'
            data={doOGPDs}
            selected={selectedOGPDs}
            setSelected={setSelectedOGPDs}
          />
          <DatePicker
            value={fromDate}
            setValue={setFromDate}
            placeholder={`Tarixdən`}
            data_type='do'
            data={selectedOGPDs}
            disabled={loading}
          />
          <DatePicker
            value={toDate}
            setValue={setToDate}
            placeholder={`Tarixə`}
            data_type='do'
            data={selectedOGPDs}
            disabled={loading}
          />

          <div className='flex flex-wrap gap-2 items-center'>
            <button
              onClick={() => {
                setSelectedOGPDs([]);
                setFromDate(null);
                setToDate(null);
                setDownloadedData([]);
              }}
              disabled={
                (selectedOGPDs.length === 0 && !fromDate && !toDate) || loading
              }
              className={`h-10 flex items-center gap-1 px-1 py-2 rounded transition ${
                (selectedOGPDs.length === 0 && !fromDate && !toDate) || loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700 cursor-pointer'
              }`}
            >
              <DeleteIcon fontSize='small' />
              {/* <span className='text-sm'>Reset</span> */}
            </button>
            <button
              className={`h-10  text-white px-4 py-2 rounded ${
                selectedOGPDs.length === 0 || !fromDate || !toDate || loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
              }`}
              onClick={handleViewClick}
              disabled={loading}
            >
              View
            </button>
            <button
              disabled={loading}
              className={`h-10 text-white px-4 py-2 rounded ${
                selectedOGPDs.length === 0 || !fromDate || !toDate || loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
              }`}
              onClick={handleDownloadClick}
            >
              Download
            </button>
          </div>
        </div>
      </div>

      <div className='overflow-auto'>
        {loading ? (
          <div className='h-full w-full flex items-center justify-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent'></div>
          </div>
        ) : (
          <div className='h-full w-max min-w-full'>
            {/* <PaginatedTable data={downloadedData} /> */}
            <VirtualizedTable data={downloadedData} />
          </div>
        )}
      </div>
    </div>
  );
}
