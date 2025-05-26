'use client';

import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';

export default function LottieAnimation({ type }) {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch(`/${type}.json`)
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
