'use client';

import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';

export default function Dashboards() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch('/maintenance2.json') // No need for full path, since it's in public/
      .then((res) => res.json())
      .then((data) => setAnimationData(data));
  }, []);

  if (!animationData) return <p>Loading animation...</p>;

  return (
    <div className='w-full h-full grid place-items-center'>
      <div style={{ width: 400, height: 400 }}>
        <Lottie animationData={animationData} loop={true} />
      </div>
    </div>
  );
}
