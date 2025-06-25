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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Shrikhand&display=swap" rel="stylesheet" />
        <link rel="preload" as="image" href="/Close-up-Hero-shot.png" imageSrcSet="/Close-up-Hero-shot.png 1x" imageSizes="100vw" />
      </head>
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