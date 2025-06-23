'use client';
import HeroSection from '@/components/HeroSection';
import HeroFollowUp from '@/components/HeroFollowUp';
import AboutUsSection from '@/components/AboutUsSection';
import AboutUsSection2 from '@/components/AboutUsSection2';
import HorizontalGallery from '@/components/GallerySection';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HeroFollowUp />
      <AboutUsSection />
      <AboutUsSection2 />
      <HorizontalGallery />
      <Footer />
    </>
  );
}