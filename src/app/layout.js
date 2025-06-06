import './globals.css';
import Header from '@/components/Header';
import StaticDataProvider from '@/context/StaticDataContext';

export const metadata = {
  title: 'DPR-SOCAR',
  description: 'View for DPR-SOCAR',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className='min-w-200 h-screen w-screen grid grid-rows-[60px_1fr]'>
        <Header />
        <StaticDataProvider>{children}</StaticDataProvider>
      </body>
    </html>
  );
}
