import Link from 'next/link';

export default function Home() {
  return (
    <div className='grid grid-cols-3 place-items-center'>
      <Link href='/export-data' className='box bg-blue-400 hover:bg-blue-500'>
        EXPORT DATA
      </Link>
      <Link href='/dashboards' className='box bg-red-400 hover:bg-red-500'>
        DASHBOARDS
      </Link>
      <Link
        href='/create-visuals'
        className='box bg-green-400 hover:bg-green-500'
      >
        CREATE VISUALS
      </Link>
    </div>
  );
}
