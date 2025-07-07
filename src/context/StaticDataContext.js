'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import ImageSVG from '@/components/ImageSVG';

const StaticDataContext = createContext(null);

export default function StaticDataProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [dprOGPDs, setDprOGPDs] = useState([]);
  const [mrOGPDs, setMrOGPDs] = useState([]);
  const [doOGPDs, setDoOGPDs] = useState([]);
  const [fields, setFields] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [wells, setWells] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          dprOGPDsRes,
          mrOGPDsRes,
          doOGPDsRes,
          fieldsRes,
          platformsRes,
          wellsRes,
        ] = await Promise.all([
          fetch('/api/dpr/ogpds'),
          fetch('/api/mr/ogpds'),
          fetch('/api/do/ogpds'),
          fetch('/api/fields'),
          fetch('/api/platforms'),
          fetch('/api/wells'),
        ]);

        const [
          dprOGPDsData,
          mrOGPDsData,
          doOGPDsData,
          fieldsData,
          platformsData,
          wellsData,
        ] = await Promise.all([
          dprOGPDsRes.json(),
          mrOGPDsRes.json(),
          doOGPDsRes.json(),
          fieldsRes.json(),
          platformsRes.json(),
          wellsRes.json(),
        ]);

        setDprOGPDs(dprOGPDsData);
        setMrOGPDs(mrOGPDsData);
        setDoOGPDs(doOGPDsData);
        setFields(fieldsData);
        setPlatforms(platformsData);
        setWells(wellsData);
      } catch (error) {
        console.error('Failed to fetch:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <ImageSVG type='error' width={400} height={400} />;
  }

  return (
    <StaticDataContext.Provider
      value={{ dprOGPDs, mrOGPDs, doOGPDs, fields, platforms, wells }}
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
