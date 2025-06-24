'use client';

import { useEffect, useRef } from 'react';
import { useGSAP } from '@/providers/GSAPProvider';

// This component preloads GSAP and runs initial optimizations
export default function GSAPPreloader() {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const { gsap, isMobile, isLowPerformance } = useGSAP();
  
  useEffect(() => {
    // Get device pixel ratio for detecting high-resolution displays
    const pixelRatio = window.devicePixelRatio || 1;
    const isHighResolutionDisplay = pixelRatio > 1.5;
    
    // Apply device-specific optimizations
    if (isMobile || isLowPerformance) {
      // Force better performance on mobile or low-performance devices
      document.documentElement.classList.add('mobile-optimized');
      
      if (isHighResolutionDisplay) {
        document.documentElement.classList.add('high-res-display');
      }
      
      // Apply critical performance optimizations
      if (isLowPerformance) {
        document.documentElement.classList.add('reduced-animations');
      }
    }
    
    // Fade out preloader
    if (preloaderRef.current) {
      gsap.to(preloaderRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => {
          if (preloaderRef.current) {
            preloaderRef.current.style.display = 'none';
          }
        }
      });
    }
  }, [gsap, isMobile, isLowPerformance]);
  
  return (
    <div 
      ref={preloaderRef} 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'transparent',
        zIndex: 1000,
        pointerEvents: 'none',
        opacity: 0,
      }}
    />
  );
}