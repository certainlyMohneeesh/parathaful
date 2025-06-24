import './globals.css';
import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import { LoadingProvider } from '@/providers/LoadingProvider';
import { GSAPProvider } from '@/providers/GSAPProvider';

export const metadata = {
  title: 'ParathaFul',
  description: 'India\'s Stuffed Icon Gets a Modern Fry-Up!',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 relative overflow-x-hidden">
        <GSAPProvider>
          <LoadingProvider>
            <Navbar />
            <main className="relative">{children}</main>
          </LoadingProvider>
        </GSAPProvider>
      </body>
    </html>
  );
}