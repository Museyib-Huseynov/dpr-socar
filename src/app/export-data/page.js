'use client';

import { useEffect, useState, useMemo } from 'react';
import Select from '@/components/Select';
import DatePicker from '@/components/DatePicker';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ExportPage() {
  const [OGPDs, setOGPDs] = useState([]);
  const [fields, setFields] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [wells, setWells] = useState([]);
  const [dataToDownload, _] = useState([
    { id: 1, name: 'təzyiq' },
    { id: 2, name: 'hasilat' },
    { id: 3, name: 'tamamlama' },
    { id: 4, name: 'nasos' },
    { id: 5, name: 'itki kateqoriyası' },
  ]);

  const [selectedOGPD, setSelectedOGPD] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedWells, setSelectedWells] = useState([]);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [selectedDataToDownload, setSelectedDataToDownload] = useState([]);

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

  useEffect(() => {
    const fetchData = async () => {
      const OGPDsResponse = await fetch('/api/ogpd');
      const OGPDsData = await OGPDsResponse.json();
      setOGPDs(OGPDsData);

      const fieldsResponse = await fetch('/api/fields');
      const fieldsData = await fieldsResponse.json();
      setFields(fieldsData);

      const platformsResponse = await fetch('/api/platforms');
      const platformsData = await platformsResponse.json();
      setPlatforms(platformsData);

      const wellsResponse = await fetch('/api/wells');
      const wellsData = await wellsResponse.json();
      setWells(wellsData);
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
  }, [selectedOGPD]);

  useEffect(() => {
    setSelectedPlatforms([]);
    setSelectedWells([]);
    setSelectedDataToDownload([]);
    setFromDate(null);
    setToDate(null);
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
  }, [selectedPlatforms]);

  useEffect(() => {
    setSelectedDataToDownload([]);
    setFromDate(null);
    setToDate(null);
  }, [selectedWells]);

  return (
    <div className=' h-fit p-7 border-b-2 border-gray-100'>
      <div className='grid place-items-center grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        <Select
          placeholder='NQÇİ'
          data={OGPDs}
          selected={selectedOGPD}
          setSelected={setSelectedOGPD}
          multiple={false}
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
          >
            Search
          </button>
          <button
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
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
