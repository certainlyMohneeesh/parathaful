'use client';

import { useEffect, useRef } from 'react';
import { useGSAP } from '@/providers/GSAPProvider';
import Image from 'next/image';

export default function AboutUsSection2() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const backgroundImageRef = useRef<HTMLDivElement>(null);
  
  const { gsap, ScrollTrigger, isMobile, isLowPerformance, createAnimation } = useGSAP();

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const backgroundImage = backgroundImageRef.current;
    
    if (!section || !headline || !backgroundImage) return;
    
    try {
      // Set initial states
      gsap.set(headline, {
        opacity: 0,
        y: 50,
        force3D: true,
      });
      
      gsap.set(backgroundImage, {
        scale: isMobile ? 1.1 : 1.2,
        opacity: 0.2,
        force3D: true,
      });
      
      // For low performance devices, just fade in without complex animations
      if (isLowPerformance) {
        gsap.to(headline, {
          opacity: 1,
          y: 0,
          duration: 0.5,
        });
        
        gsap.to(backgroundImage, {
          scale: 1,
          opacity: 0.2,
          duration: 0.5,
        });
        return;
      }
      
      // Create timeline for entrance animations - optimized for mobile
      const duration = isMobile ? 1.5 : 2;
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none reverse",
        }
      });
      
      tl.to(backgroundImage, {
        scale: 1,
        opacity: 5,
        duration: duration,
        ease: "power2.out",
        force3D: true,
      })
      .to(headline, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        force3D: true,
      }, "-=1");
      
      // Only add parallax effect on non-mobile devices
      if (!isMobile) {
        createAnimation(backgroundImage, {
          y: -50, // Reduced parallax amount
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          }
        });
      }
    } catch (error) {
      console.error('Error in AboutUsSection2 animations:', error);
      
      // Fallback: Make sure elements are visible even if animations fail
      gsap.set([headline, backgroundImage], { 
        opacity: headline === null ? 0 : 1, 
        scale: backgroundImage === null ? 1 : 1,
        clearProps: "transform,opacity" 
      });
    }

    return () => {
      // Clean up all scroll triggers related to this section
      ScrollTrigger.getAll()
        .filter(trigger => trigger.vars.trigger === section)
        .forEach(trigger => trigger.kill());
    };
  }, [gsap, ScrollTrigger, isMobile, isLowPerformance, createAnimation]);

  return (
    <section 
      ref={sectionRef}
      id="about-section2"
      className="relative min-h-screen bg-red-600 overflow-hidden flex items-center justify-center px-2 sm:px-4 md:px-8 touch-manipulation"
    >
      {/* Background Image */}
      <div 
        ref={backgroundImageRef}
        className="absolute inset-0 flex items-center justify-center hardware-accelerated pointer-events-none select-none"
      >
        <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full overflow-hidden opacity-20">
          <Image 
            src="/people_rolling_parathas.png" 
            alt="People laughing while rolling parathas."
            fill
            sizes="(max-width: 640px) 256px, (max-width: 768px) 320px, 384px"
            priority={false}
            className="object-cover rounded-full"
            loading="lazy"
            draggable={false}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-2 sm:px-4 md:px-8">
        <div className="text-center">
          <h2 
            ref={headlineRef}
            className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-black text-white leading-tight max-w-full mx-auto hardware-accelerated"
            style={{ wordBreak: 'break-word' }}
          >
            THIS IS PATAKHA PARATHA. IT'LL MELT HEARTS, FILL STOMACHS, AND SPICE UP MEMORIES.
          </h2>
        </div>
      </div>
    </section>
  );
}