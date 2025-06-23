'use client';

import { ArrowRight } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const background = backgroundRef.current;
    const content = contentRef.current;

    if (!hero || !background || !content) return;

    // Initial setup - background starts zoomed in
    gsap.set(background, {
      scale: 1.2,
      transformOrigin: "center center"
    });

    // Background zoom out animation on scroll
    const backgroundAnimation = gsap.to(background, {
      scale: 1,
      ease: "none",
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
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen overflow-hidden"
    >
      {/* Animated Background Image */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: "url('/Close-up-Hero-shot.png')", // Replace with actual image path
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
      >
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
          <div className="space-y-8">
            {/* Decorative Elements */}
            <div className="absolute -top-10 -left-10 w-20 h-20 opacity-20">
              <div className="w-8 h-8 bg-red-600 rounded-full"></div>
            </div>

            {/* Main Typography with Stroke Effect */}
            <div className="space-y-2">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-none">
                <span className="block text-red-600 stroke-text">INSIDE</span>
                <span className="block text-transparent stroke-text">INDIA</span>
                <span className="block text-red-600">DESI & </span>
                <span className="block text-red-600">PROUD</span>
              </h1>
            </div>

            {/* CTA Button */}
            <div ref={ctaRef} className="pt-8">
              <button className="group flex items-center space-x-4 text-white hover:text-red-100 transition-colors">
                <div className="flex items-center justify-center w-20 h-20 border-2 border-white rounded-full group-hover:bg-white group-hover:text-red-600 transition-all duration-300">
                  <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform duration-300" />
                </div>
                <span className="text-lg font-semibold uppercase tracking-wider">STUFFED JOY</span>
              </button>
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-8 relative">
            {/* Large Typography Overlay */}
            <div className="absolute top-0 right-0 z-20">
              <h2 className="text-8xl md:text-9xl lg:text-[12rem] font-black text-white leading-none opacity-80">
                FLUFFY
              </h2>
              <h2 className="text-8xl md:text-9xl lg:text-[12rem] font-black text-white leading-none opacity-80 -mt-8">
                FILLED
              </h2>
            </div>

            {/* Story Text */}
            <div className="relative z-10 mt-40 lg:mt-60">
              {/* <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-gray-800 max-w-md"> */}
                {/* <p className="text-sm leading-relaxed">
                  No, girl, I don't like all these ice creams and frozen juices... When I was a kid I liked it, of course, but I don't know what else I liked... let's have the usual, white chocolate-covered... And what's that lilac soap you have? mr.pops? I'll take the bright yellow one, what's that? Mango-maracuya? Oh, it's cold! And what's that crunching on your teeth? Bones... cool! And can I bring this pink one, too!
                </p> */}
                
                {/* CTA Button */}
                {/* <div className="flex items-center gap-3 mt-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full">
                    <ArrowRight size={20} className="text-gray-800" />
                  </div>
                  <span className="text-gray-800 font-semibold text-sm">
                    FLAVOURS
                  </span>
                </div> */}
              {/* </div> */}

              {/* Website URL */}
              {/* <div className="mt-6">
                <p className="text-xs text-gray-600">
                  https://mrpops.ua/en/catalog/
                </p>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-red-600 rounded-full opacity-60"></div>
      <div className="absolute bottom-1/3 left-1/3 w-6 h-6 bg-red-600 rounded-full opacity-40"></div>
    </section>
  );
}