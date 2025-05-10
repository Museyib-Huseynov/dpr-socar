'use client';

import { useEffect, useState } from 'react';
import Select from '@/components/Select';

export default function ExportPage() {
  const [OGPDs, setOGPDs] = useState([]);
  const [fields, setFields] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [wells, setWells] = useState([]);

  const [selectedOGPD, setSelectedOGPD] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedWells, setSelectedWells] = useState([]);

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
    setSelectedField('');
    setSelectedPlatforms([]);
    setSelectedWells([]);
  }, [selectedOGPD]);

  useEffect(() => {
    setSelectedPlatforms([]);
    setSelectedWells([]);
  }, [selectedField]);

  useEffect(() => {
    let newSelectedWells = filteredWells
      .filter((i) => selectedWells.includes(i.name))
      .map((j) => j.name);
    setSelectedWells(newSelectedWells);
  }, [selectedPlatforms]);

  const filteredFields = fields.filter((i) => {
    let selectedOGPDId = OGPDs.find((j) => selectedOGPD === j.name)?.id;
    return selectedOGPDId === i.ogpd_id;
  });

  const filteredPlatforms = platforms.filter((i) => {
    let selectedFieldId = fields.find((j) => selectedField === j.name)?.id;
    return selectedFieldId === i.field_id;
  });

  const filteredWells = wells.filter((i) => {
    let selectedPlatformIds = platforms
      .filter((j) =>
        selectedPlatforms.includes(
          j.square ? j.name + ' / ' + j.square : j.name
        )
      )
      .map((k) => k.id);
    return selectedPlatformIds.includes(i.platform_id);
  });

  return (
    <div className='h-[100px]'>
      <Select
        placeholder='NQÇİ'
        data={OGPDs.map((i) => i.name)}
        selected={selectedOGPD}
        setSelected={setSelectedOGPD}
        multiple={false}
      />
      <Select
        placeholder='Yataq'
        data={filteredFields.map((f) => f.name)}
        selected={selectedField}
        setSelected={setSelectedField}
        disabled={selectedOGPD === ''}
        multiple={false}
      />
      <Select
        placeholder='Özül / mədən'
        data={filteredPlatforms
          .map((l) => {
            if (l.square) {
              return l.name + ' / ' + l.square;
            } else {
              return l.name;
            }
          })
          .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))}
        selected={selectedPlatforms}
        setSelected={setSelectedPlatforms}
        disabled={selectedField === ''}
      />
      <Select
        placeholder='Quyu'
        data={filteredWells
          .map((i) => i.name)
          .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))}
        selected={selectedWells}
        setSelected={setSelectedWells}
        disabled={selectedPlatforms.length === 0}
      />
    </div>
  );
}
