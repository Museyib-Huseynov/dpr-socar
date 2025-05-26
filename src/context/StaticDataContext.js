'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const StaticDataContext = createContext(null);

export default function StaticDataProvider({ children }) {
  const [loading, setLoading] = useState(true);

  const [dprOGPDs, setDprOGPDs] = useState([]);
  const [doOGPDs, setDoOGPDs] = useState([]);
  const [fields, setFields] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [wells, setWells] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [dprOGPDsRes, doOGPDsRes, fieldsRes, platformsRes, wellsRes] =
          await Promise.all([
            fetch('/api/dpr/ogpds'),
            fetch('/api/do/ogpds'),
            fetch('/api/fields'),
            fetch('/api/platforms'),
            fetch('/api/wells'),
          ]);

        const [
          dprOGPDsData,
          doOGPDsData,
          fieldsData,
          platformsData,
          wellsData,
        ] = await Promise.all([
          dprOGPDsRes.json(),
          doOGPDsRes.json(),
          fieldsRes.json(),
          platformsRes.json(),
          wellsRes.json(),
        ]);

        setDprOGPDs(dprOGPDsData);
        setDoOGPDs(doOGPDsData);
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

  return (
    <StaticDataContext.Provider
      value={{ dprOGPDs, doOGPDs, fields, platforms, wells }}
    >
      {loading ? (
        <div className='h-full w-full flex items-center justify-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent'></div>
        </div>
      ) : (
        children
      )}
    </StaticDataContext.Provider>
  );
}

export function useStaticData() {
  return useContext(StaticDataContext);
}
