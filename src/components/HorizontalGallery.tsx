'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { useMobileOptimizedGSAP } from '@/hooks/useMobileOptimizedGSAP';

gsap.registerPlugin(ScrollTrigger);

const HorizontalGallery = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isMobile, createMobileOptimizedAnimation } = useMobileOptimizedGSAP();

  const images = [
    { src: '/mintchutney.png', alt: 'Charcoal-grilled paratha with mint chutney.' },
    { src: '/oozing-butter.png', alt: 'Aloo paratha oozing with butter.' },
    { src: '/paratha-tandoor.png', alt: 'A roadside tandoor in full action.' },
    { src: '/paratha-stacked.png', alt: 'Handmade parathas stacked high.' },
    { src: '/flaky-bite.png', alt: 'Flaky layers being torn apart mid-bite.' },
  ];

  // Duplicate images for seamless loop
  const duplicatedImages = [...images, ...images];

  useEffect(() => {
    const container = containerRef.current;
    const scrollContainer = scrollRef.current;

    if (!container || !scrollContainer) return;

    // Mobile-specific calculations
    const itemWidth = isMobile ? 280 : 350;
    const gap = isMobile ? 12 : 16;
    const singleSetWidth = images.length * (itemWidth + gap);

    // Force hardware acceleration
    gsap.set(scrollContainer, { 
      x: 0,
      force3D: true,
      transformStyle: "preserve-3d"
    });

    // Simplified animation for mobile
    const tl = gsap.timeline({ repeat: -1 });
    
    tl.to(scrollContainer, {
      x: -singleSetWidth,
      duration: isMobile ? images.length * 1.5 : images.length * 2, // Faster on mobile
      ease: 'none',
      force3D: true,
    });

    // Mobile-optimized scroll trigger
    ScrollTrigger.create({
      trigger: container,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        if (!isMobile) {
          const progress = self.progress;
          tl.timeScale(0.5 + progress * 1.5);
        }
      },
      invalidateOnRefresh: true,
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isMobile]);

  return (
    <div 
      ref={containerRef}
      className="horizontal-gallery-container overflow-hidden bg-white"
      style={{ height: '80vh' }}
    >
      <div 
        ref={scrollRef}
        className="horizontal-gallery-scroll flex items-center gap-4"
        style={{ width: 'max-content' }}
      >
        {duplicatedImages.map((image, index) => (
          <div 
            key={index}
            className="gallery-item flex-shrink-0 relative"
            style={{ 
              width: '350px', 
              height: '500px',
              borderRadius: '20px',
              overflow: 'hidden'
            }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              style={{
                objectFit: 'cover',
                objectPosition: 'center'
              }}
              sizes="350px"
              priority={index < 2}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalGallery;