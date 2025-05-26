import Image from 'next/image';

export default function ImageSVG({ type, width, height }) {
  return (
    <div className='w-full h-full grid place-items-center'>
      <Image
        src={`/${type}.svg`}
        alt='Maintenance Illustration'
        width={width}
        height={height}
        priority
      />
    </div>
  );
}
