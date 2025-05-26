'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Header() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  return (
    <header className='border-b-2 border-gray-100 grid grid-cols-[400px_1fr_160px]'>
      <nav className='text-2xl self-center'>
        <Link href='/' className='text-blue-500 hover:underline ml-5'>
          Home
        </Link>

        {segments.map((seg, i) => {
          const href = '/' + segments.slice(0, i + 1).join('/');
          const isLast = i === segments.length - 1;

          return (
            <span key={href}>
              {' / '}
              {isLast ? (
                <span className='font-medium text-gray-800'>
                  {decodeURIComponent(seg)}
                </span>
              ) : (
                <Link href={href} className='text-blue-500 hover:underline'>
                  {decodeURIComponent(seg)}
                </Link>
              )}
            </span>
          );
        })}
      </nav>

      <div></div>

      <div
        className={`w-full self-center h-8 bg-[url("/logo.png")] bg-contain bg-no-repeat bg-center`}
      ></div>
    </header>
  );
}
