import Link from 'next/link';

export default function Home() {
  return (
    <div className='grid grid-cols-3 place-items-center gap-4 p-4'>
      <Link href='/export-data/dpr'>
        <div className='box bg-blue-400 hover:bg-blue-500 cursor-pointer p-4 rounded text-white text-center'>
          <h2 className='text-5xl'>DPR</h2>
          <p className='text-[16px]'>Daily Production Report</p>
        </div>
      </Link>

      <Link href='/export-data/mr'>
        <div className='box bg-blue-400 hover:bg-blue-500 cursor-pointer p-4 rounded text-white text-center'>
          <h2 className='text-5xl'>MR</h2>
          <p className='text-[16px]'>Monthly Reported</p>
        </div>
      </Link>

      <Link href='/export-data/do'>
        <div className='box bg-blue-400 hover:bg-blue-500 cursor-pointer p-4 rounded text-white text-center'>
          <h2 className='text-5xl'>DO</h2>
          <p className='text-[16px]'>Daily Operatives</p>
        </div>
      </Link>
    </div>
  );
}
