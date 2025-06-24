'use client';
import HeroSection from '@/components/HeroSection';
import HeroFollowUp from '@/components/HeroFollowUp';
import AboutUsSection from '@/components/AboutUsSection';
import AboutUsSection2 from '@/components/AboutUsSection2';
import HorizontalGallery from '@/components/GallerySection';
import Footer from '@/components/Footer';
import GSAPPreloader from '@/components/GSAPPreloader';
import ConnectionTest from '@/components/ConnectionTest';
import DesktopEnhancer from '@/components/DesktopEnhancer';

export default function Home() {
  return (
    <>
      {/* Development-only connection tester */}
      {process.env.NODE_ENV === 'development' && <ConnectionTest />}
      
      {/* Preload and optimize GSAP */}
      <GSAPPreloader />
      
      {/* Apply desktop enhancements */}
      <DesktopEnhancer />
      
      {/* Main content */}
      <HeroSection />
      <HeroFollowUp />
      <AboutUsSection />
      <AboutUsSection2 />
      <HorizontalGallery />
      <Footer />
    </>
  );
}