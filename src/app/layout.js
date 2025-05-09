import './globals.css';
import Header from '@/components/Header';

export const metadata = {
  title: 'DPR-SOCAR',
  description: 'View for DPR-SOCAR',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className='min-w-200 h-screen grid grid-rows-[60px_1fr] select-none'>
        <Header />
        {children}
      </body>
    </html>
  );
}
