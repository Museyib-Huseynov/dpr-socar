'use client';

import { useStaticData } from '@/context/StaticDataContext';

import ImageSVG from '@/components/ImageSVG';

export default function MR() {
  return <ImageSVG type='nodata' width={200} height={200} />;
}
