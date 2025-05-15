'use client';

import { useEffect, useState, useMemo } from 'react';
import Select from '@/components/GroupSelect';
import DatePicker from '@/components/DatePicker';
import DeleteIcon from '@mui/icons-material/Delete';
import PaginatedTable from '@/components/PaginatedTable';
import dayjs from 'dayjs';
import exportToExcel from '@/util/exportAsExcel';
import VirtualizedTable from '@/components/VirtualizedTable';

export default function ExportPage() {
  const [OGPDs, setOGPDs] = useState([]);
  const [fields, setFields] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [wells, setWells] = useState([]);
  const [dataToDownload, _] = useState([
    { id: 1, name: 'Kateqoriya', group: 'Quyu fondu' },
    { id: 2, name: 'İstismar fond alt kat', group: 'Quyu fondu' },
    { id: 3, name: 'İstismar üsulu', group: 'Quyu fondu' },
    { id: 4, name: 'Horizont', group: 'Tamamlama' },
    { id: 5, name: 'Tamamlama intervalı', group: 'Tamamlama' },
    { id: 6, name: 'İstismar kəməri', group: 'Tamamlama' },
    { id: 7, name: '1-ci sıra', group: 'Tamamlama' },
    { id: 8, name: '2-ci sıra', group: 'Tamamlama' },
    { id: 9, name: '3-cü sıra', group: 'Tamamlama' },
    { id: 10, name: 'İşləmə saatı', group: 'Hasilat' },
    { id: 11, name: 'Maye (ton)', group: 'Hasilat' },
    { id: 12, name: 'Neft (ton) - ölçü', group: 'Hasilat' },
    { id: 13, name: 'Neft (ton) - paylanılmış', group: 'Hasilat' },
    { id: 14, name: 'Su (ton)', group: 'Hasilat' },
    { id: 15, name: 'Cəm qaz (m3)', group: 'Hasilat' },
    { id: 16, name: 'Qazlift qaz (m3)', group: 'Hasilat' },
    { id: 17, name: 'Çıxarılan qaz (m3)', group: 'Hasilat' },
    { id: 18, name: 'Mexaniki qarışıq', group: 'Hasilat' },
    { id: 19, name: 'Pqa', group: 'Təzyiq' },
    { id: 20, name: 'Phf', group: 'Təzyiq' },
    { id: 21, name: 'Pba', group: 'Təzyiq' },
    { id: 22, name: 'P6x9', group: 'Təzyiq' },
    { id: 23, name: 'P9x13', group: 'Təzyiq' },
    { id: 24, name: 'P13x20', group: 'Təzyiq' },
    { id: 25, name: 'Ştuser', group: 'Təzyiq' },
    { id: 26, name: 'Nasosun buraxılma dərinliyi', group: 'Nasos' },
    { id: 27, name: 'Tezlik', group: 'Nasos' },
    { id: 28, name: 'Nasosa düşən təzyiq', group: 'Nasos' },
    { id: 29, name: 'Nasosun qabariti (MEDN)', group: 'Nasos' },
    { id: 30, name: 'Nasosun pillələrinin sayı (MEDN)', group: 'Nasos' },
    { id: 31, name: 'Nasosun verimi (MEDN)', group: 'Nasos' },
    { id: 32, name: 'Nasosun basqısı (MEDN)', group: 'Nasos' },
    { id: 33, name: 'Quyuiçi qaz separatoru (MEDN)', group: 'Nasos' },
    { id: 34, name: 'Mancanaq dəzgahının növü', group: 'Nasos' },
    { id: 35, name: 'Plunjerin diametri (ŞDN)', group: 'Nasos' },
    { id: 36, name: 'Plunjerin gediş yolu (ŞDN)', group: 'Nasos' },
    { id: 37, name: 'Balansirin yırğalanma sayı (ŞDN)', group: 'Nasos' },
    { id: 38, name: 'Nasosun verim əmsalı (ŞDN)', group: 'Nasos' },
    { id: 39, name: 'Elek.müh.mak.dövr.say (ŞDN)', group: 'Nasos' },
    { id: 40, name: 'Şkifin diametri (ŞDN)', group: 'Nasos' },
    { id: 41, name: 'Nasosun verimi (Vintli)', group: 'Nasos' },
    { id: 42, name: 'Dövrlər sayı (Vintli)', group: 'Nasos' },
    { id: 43, name: 'Vintin diametri', group: 'Nasos' },
    { id: 44, name: 'İtki kateqoriyası', group: 'İtkilər' },
    { id: 45, name: 'İtki təbəqəsi', group: 'İtkilər' },
    { id: 46, name: 'Rəylər', group: 'İtkilər' },
    { id: 47, name: 'Hansı sərfölçənə işləyir' },
  ]);

  const [selectedOGPD, setSelectedOGPD] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedWells, setSelectedWells] = useState([]);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [selectedDataToDownload, setSelectedDataToDownload] = useState([]);

  const [downloadedData, setDownloadedData] = useState([]);
  const [loading, setLoading] = useState(false);

  const filteredFields = fields.filter((i) => {
    return i.ogpd_id === selectedOGPD;
  });

  const filteredPlatforms = platforms.filter((i) => {
    return selectedField === i.field_id;
  });

  const sortedPlatforms = useMemo(() => {
    return filteredPlatforms
      .map((l) => {
        return {
          id: l.id,
          name: l.square ? `${l.name} / ${l.square}` : l.name,
        };
      })
      .sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true })
      );
  }, [filteredPlatforms]);

  const filteredWells = wells.filter((i) => {
    return selectedPlatforms.includes(i.platform_id);
  });

  const sortedWells = useMemo(() => {
    return filteredWells.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { numeric: true })
    );
  }, [filteredWells]);

  const handleViewClick = async () => {
    setLoading(true);
    try {
      const dataResponse = await fetch(
        `/api/download/${selectedWells.join(',')}/${selectedDataToDownload.join(
          ','
        )}/${dayjs(fromDate).format('YYYY-MM-DD')}/${dayjs(toDate).format(
          'YYYY-MM-DD'
        )}`
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
      exportToExcel(dataToExport, 'dpr.xlsx');
    } else {
      alert('No data to download.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [OGPDsRes, fieldsRes, platformsRes, wellsRes] = await Promise.all(
          [
            fetch('/api/ogpd'),
            fetch('/api/fields'),
            fetch('/api/platforms'),
            fetch('/api/wells'),
          ]
        );

        const [OGPDsData, fieldsData, platformsData, wellsData] =
          await Promise.all([
            OGPDsRes.json(),
            fieldsRes.json(),
            platformsRes.json(),
            wellsRes.json(),
          ]);

        setOGPDs(OGPDsData);
        setFields(fieldsData);
        setPlatforms(platformsData);
        setWells(wellsData);
      } catch (error) {
        console.error('Failed to fetch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setSelectedField(null);
    setSelectedPlatforms([]);
    setSelectedWells([]);
    setSelectedDataToDownload([]);
    setFromDate(null);
    setToDate(null);
    setDownloadedData([]);
  }, [selectedOGPD]);

  useEffect(() => {
    setSelectedPlatforms([]);
    setSelectedWells([]);
    setSelectedDataToDownload([]);
    setFromDate(null);
    setToDate(null);
    setDownloadedData([]);
  }, [selectedField]);

  useEffect(() => {
    setSelectedWells((prevSelectedWells) =>
      filteredWells
        .filter((well) => prevSelectedWells.includes(well.id))
        .map((well) => well.id)
    );
    setSelectedDataToDownload([]);
    setFromDate(null);
    setToDate(null);
    setDownloadedData([]);
  }, [selectedPlatforms]);

  useEffect(() => {
    setSelectedDataToDownload([]);
    setFromDate(null);
    setToDate(null);
    setDownloadedData([]);
  }, [selectedWells]);

  return (
    <div className='h-full w-full grid grid-rows-[auto_1fr] overflow-hidden'>
      <div className='h-fit p-7 border-b-2 border-gray-100'>
        <div className='grid place-items-center grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          <Select
            placeholder='NQÇİ'
            data={OGPDs}
            selected={selectedOGPD}
            setSelected={setSelectedOGPD}
            multiple={false}
            disabled={loading}
          />
          <Select
            placeholder='Yataq'
            data={filteredFields}
            selected={selectedField}
            setSelected={setSelectedField}
            disabled={selectedOGPD === null}
            multiple={false}
          />
          <Select
            placeholder='Özül / mədən'
            data={sortedPlatforms}
            selected={selectedPlatforms}
            setSelected={setSelectedPlatforms}
            disabled={selectedField === null}
          />
          <Select
            placeholder='Quyu'
            data={sortedWells}
            selected={selectedWells}
            setSelected={setSelectedWells}
            disabled={selectedPlatforms.length === 0}
          />
          <Select
            placeholder='Məlumat'
            data={dataToDownload}
            selected={selectedDataToDownload}
            setSelected={setSelectedDataToDownload}
            disabled={selectedWells.length === 0}
            group={true}
          />
          <DatePicker
            value={fromDate}
            setValue={setFromDate}
            placeholder={`Tarixdən`}
            data={selectedWells}
          />
          <DatePicker
            value={toDate}
            setValue={setToDate}
            placeholder={`Tarixə`}
            data={selectedWells}
          />

          <div className='flex flex-wrap gap-2 items-center'>
            <button
              onClick={() => {
                setSelectedOGPD(null);
                setSelectedField(null);
                setSelectedPlatforms([]);
                setSelectedWells([]);
                setSelectedDataToDownload([]);
                setFromDate(null);
                setToDate(null);
                setDownloadedData([]);
              }}
              disabled={
                !selectedOGPD &&
                !selectedField &&
                selectedPlatforms.length === 0 &&
                selectedWells.length === 0 &&
                selectedDataToDownload.length === 0 &&
                !fromDate &&
                !toDate
              }
              className={`h-10 flex items-center gap-1 px-1 py-2 rounded transition ${
                !selectedOGPD &&
                !selectedField &&
                selectedPlatforms.length === 0 &&
                selectedWells.length === 0 &&
                selectedDataToDownload.length === 0 &&
                !fromDate &&
                !toDate
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700 cursor-pointer'
              }`}
            >
              <DeleteIcon fontSize='small' />
              {/* <span className='text-sm'>Reset</span> */}
            </button>
            <button
              className={`h-10  text-white px-4 py-2 rounded ${
                !selectedOGPD ||
                !selectedField ||
                selectedPlatforms.length === 0 ||
                selectedWells.length === 0 ||
                selectedDataToDownload.length === 0 ||
                !fromDate ||
                !toDate
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
                !selectedOGPD ||
                !selectedField ||
                selectedPlatforms.length === 0 ||
                selectedWells.length === 0 ||
                selectedDataToDownload.length === 0 ||
                !fromDate ||
                !toDate
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
