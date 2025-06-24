'use client';

import { ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LazyImage from '@/components/lazy/LazyImage';
import LazySection from '@/components/lazy/LazySection';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    if (!isImageLoaded) return;

    const hero = heroRef.current;
    const background = backgroundRef.current;
    const content = contentRef.current;

    if (!hero || !background || !content) return;

    // Initial setup - background starts zoomed in
    gsap.set(background, {
      scale: 1,
      transformOrigin: "center center",
      ease: "power1.inOut"
    });

    // Background zoom out animation on scroll
    const backgroundAnimation = gsap.to(background, {
      scale: 2,
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        pin: false,
      }
    });

    // Content fade out animation on scroll
    const contentAnimation = gsap.to(content, {
      opacity: 0.3,
      y: -50,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      }
    });

    // Cleanup function
    return () => {
      backgroundAnimation.kill();
      contentAnimation.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isImageLoaded]);

  // Animate CTA button on load
  useEffect(() => {
    if (isImageLoaded && ctaRef.current) {
      gsap.fromTo(ctaRef.current, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.8, ease: "power2.out" }
      );
    }
  }, [isImageLoaded]);

  return (
    <LazySection 
      animationType="fade" 
      threshold={0}
      className="relative min-h-screen overflow-hidden"
    >
      <section 
        ref={heroRef}
        className="relative min-h-screen overflow-hidden"
      >
        {/* Lazy Loaded Background Image */}
        <div 
          ref={backgroundRef}
          className="absolute inset-0 w-full h-full"
        >
          {/* Loading placeholder */}
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-red-800 to-orange-900 animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40"></div>
            </div>
          )}
          
          {/* Lazy loaded background image */}
          <LazyImage
            src="/Close-up-Hero-shot.png"
            alt="Delicious Aloo Paratha Hero Shot"
            width={1920}
            height={1080}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            priority={true}
            onLoad={() => setIsImageLoaded(true)}
          />
          
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20"></div>
        </div>

        {/* Content Container */}
        <div 
          ref={contentRef}
          className="relative z-10 container mx-auto px-6 py-20"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
            {/* Left Content */}
            <LazySection animationType="slideLeft" threshold={0.2}>
              <div className="space-y-8">
                {/* Decorative Elements */}
                <div className="absolute -top-10 -left-10 w-20 h-20 opacity-20">
                  <div className="w-8 h-8 bg-red-600 rounded-full animate-pulse"></div>
                </div>

                {/* Main Typography with Stroke Effect */}
                <div className="space-y-2">
                  <LazySection animationType="slideUp" threshold={0.1}>
                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-none">
                      <span className="block text-red-600 stroke-text">INSIDE</span>
                      <span className="block text-transparent stroke-text">INDIA</span>
                      <span className="block text-red-600">DESI & </span>
                      <span className="block text-red-600">PROUD</span>
                    </h1>
                  </LazySection>
                </div>

                {/* CTA Button */}
                <div ref={ctaRef} className="pt-8 opacity-0">
                  <button className="group flex items-center space-x-4 text-white hover:text-red-100 transition-colors">
                    <div className="flex items-center justify-center w-20 h-20 border-2 border-white rounded-full group-hover:bg-white group-hover:text-red-600 transition-all duration-300 group-hover:scale-110">
                      <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                    <span className="text-lg font-semibold uppercase tracking-wider">STUFFED JOY</span>
                  </button>
                </div>
              </div>
            </LazySection>

            {/* Right Content */}
            <LazySection animationType="slideLeft" threshold={0.3}>
              <div className="space-y-8 relative">
                {/* Large Typography Overlay */}
                <LazySection animationType="scale" threshold={0.4}>
                  <div className="absolute top-0 right-0 z-20">
                    <h2 className="text-8xl md:text-9xl lg:text-[12rem] font-black text-white leading-none opacity-80 bg-gradient-to-r from-white to-red-100 bg-clip-text text-transparent">
                      FLUFFY
                    </h2>
                    <h2 className="text-8xl md:text-9xl lg:text-[12rem] font-black text-white leading-none opacity-80 -mt-8 bg-gradient-to-r from-red-100 to-white bg-clip-text text-transparent">
                      FILLED
                    </h2>
                  </div>
                </LazySection>

                {/* Story Text Section - Kept commented as in original */}
                <div className="relative z-10 mt-40 lg:mt-60">
                  {/* Content intentionally left empty as per original design */}
                </div>
              </div>
            </LazySection>
          </div>
        </div>

        {/* Decorative Elements with Lazy Animation */}
        <LazySection animationType="fade" threshold={0.5}>
          <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-red-600 rounded-full opacity-60 animate-ping"></div>
        </LazySection>
        
        <LazySection animationType="fade" threshold={0.6}>
          <div className="absolute bottom-1/3 left-1/3 w-6 h-6 bg-red-600 rounded-full opacity-40 animate-pulse"></div>
        </LazySection>
      </section>
    </LazySection>
  );
}