import './globals.css';
import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import { LoadingProvider } from '@/providers/LoadingProvider';

export const metadata = {
  title: 'ParathaFul',
  description: 'India\'s Stuffed Icon Gets a Modern Fry-Up!',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 relative overflow-x-hidden">
        <LoadingProvider>
        <Navbar />
        <main className="relative">{children}</main>
        </LoadingProvider>
      </body>
    </html>
  );
}