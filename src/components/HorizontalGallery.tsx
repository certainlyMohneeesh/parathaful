'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@/providers/GSAPProvider';

const HorizontalGallery = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  
  const { gsap, ScrollTrigger, isMobile, isLowPerformance, settings } = useGSAP();

  const images = [
    { src: '/mintchutney.png', alt: 'Charcoal-grilled paratha with mint chutney.' },
    { src: '/oozing-butter.png', alt: 'Aloo paratha oozing with butter.' },
    { src: '/paratha-tandoor.png', alt: 'A roadside tandoor in full action.' },
    { src: '/paratha-stacked.png', alt: 'Handmade parathas stacked high.' },
    { src: '/flaky-bite.png', alt: 'Flaky layers being torn apart mid-bite.' },
  ];

  // Only duplicate images if we have good performance
  const duplicatedImages = isLowPerformance ? images : [...images, ...images];

  useEffect(() => {
    const container = containerRef.current;
    const scrollContainer = scrollRef.current;

    if (!container || !scrollContainer) return;

    // Kill previous instances
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill();
    }
    
    try {
      // Mobile-specific calculations
      const itemWidth = isMobile ? 280 : 350;
      const gap = isMobile ? 12 : 16;
      const singleSetWidth = images.length * (itemWidth + gap);
      
      // For low performance devices, use a simpler approach
      if (isLowPerformance) {
        // Just set the scroll container to scroll horizontally
        gsap.set(scrollContainer, { 
          x: 0,
          force3D: true,
        });
        
        // No animation for low-performance devices
        return;
      }

      // Force hardware acceleration
      gsap.set(scrollContainer, { 
        x: 0,
        force3D: true,
        willChange: "transform",
        backfaceVisibility: "hidden",
        perspective: 1000,
      });

      // Create a timeline that can be controlled by scroll
      const tl = gsap.timeline({
        repeat: -1,
        paused: isMobile, // Start paused on mobile and we'll play it manually
      });
      
      // Animation duration based on device capability - ENHANCED FOR DESKTOP
      const duration = isMobile ? images.length * 1.2 : images.length * 3;
      
      // Enhanced desktop animations for gallery
      if (!isMobile) {
        // Add hover effect setup for desktop
        const galleryItems = container.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
          gsap.set(item, { transformOrigin: "center center" });
          
          // Add individual item hover effects for desktop
          item.addEventListener('mouseenter', () => {
            gsap.to(item, {
              scale: 1.05,
              boxShadow: "0 20px 30px rgba(0,0,0,0.15)",
              duration: 0.4,
              ease: "power2.out",
              overwrite: "auto"
            });
          });
          
          item.addEventListener('mouseleave', () => {
            gsap.to(item, {
              scale: 1,
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              duration: 0.3,
              ease: "power2.inOut",
              overwrite: "auto"
            });
          });
        });
        
        // Create more dramatic animation for desktop
        tl.to(scrollContainer, {
          x: -singleSetWidth,
          duration: duration,
          ease: "none",
          force3D: true,
        });
        
        // Enhanced subtle floating animation for desktop
        const floatTl = gsap.timeline({ repeat: -1, yoyo: true });
        floatTl.to(galleryItems, {
          y: "-=10",
          duration: 2,
          stagger: 0.2,
          ease: "sine.inOut"
        });
      } else {
        // Simpler animation for mobile
        tl.to(scrollContainer, {
          x: -singleSetWidth,
          duration: duration,
          ease: 'none',
          force3D: true,
        });
      }
      
      // Save timeline for cleanup
      timelineRef.current = tl;
      
      // On mobile devices with good performance, play the animation continuously
      if (isMobile && !isLowPerformance) {
        tl.play();
        return () => {
          if (timelineRef.current) {
            timelineRef.current.kill();
          }
        };
      }
      
      // On desktop, use ScrollTrigger to control animation speed - ENHANCED
      const st = ScrollTrigger.create({
        trigger: container,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          // Enhanced control timeline speed based on scroll position
          const progress = self.progress;
          if (tl && !isMobile) {
            // More dramatic speed variation on desktop
            tl.timeScale(0.3 + progress * 2.5);
          }
        },
        // Other ScrollTrigger options
        invalidateOnRefresh: true,
      });
      
      // Save ScrollTrigger instance for cleanup
      scrollTriggerRef.current = st;
      
      // Play the timeline for desktop
      if (!isMobile) {
        tl.play();
      }
    } catch (error) {
      console.error('Error setting up horizontal gallery:', error);
      // Recover gracefully - ensure images are visible
      if (scrollRef.current) {
        gsap.set(scrollRef.current, { clearProps: "all" });
      }
    }

    return () => {
      // Clean up
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
      
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
    };
  }, [gsap, ScrollTrigger, isMobile, isLowPerformance, settings, images.length]);

  return (
    <div 
      ref={containerRef}
      className="horizontal-gallery-container overflow-hidden bg-white"
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
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes={isMobile ? "280px" : "350px"}
              priority={index < 2}
              loading={index < 2 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalGallery;