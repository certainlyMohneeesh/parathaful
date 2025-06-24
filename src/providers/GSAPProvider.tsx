'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface GSAPContextType {
  gsap: typeof gsap;
  ScrollTrigger: typeof ScrollTrigger;
}

const GSAPContext = createContext<GSAPContextType | undefined>(undefined);

export function useGSAP() {
  const context = useContext(GSAPContext);
  if (!context) {
    throw new Error('useGSAP must be used within a GSAPProvider');
  }
  return context;
}

export function GSAPProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Set GSAP defaults for better mobile performance
    gsap.defaults({
      duration: 1,
      ease: "power2.out",
    });

    // Mobile-specific ScrollTrigger configuration
    ScrollTrigger.config({
      limitCallbacks: true,
      ignoreMobileResize: true,
    });

    // Refresh function for mobile devices
    const refreshScrollTrigger = () => {
      setTimeout(() => {
        ScrollTrigger.refresh(true);
      }, 100);
    };

    // Handle mobile-specific events
    const handleResize = () => {
      clearTimeout(window.gsapResizeTimeout);
      window.gsapResizeTimeout = setTimeout(() => {
        refreshScrollTrigger();
      }, 150);
    };

    const handleOrientationChange = () => {
      setTimeout(() => {
        refreshScrollTrigger();
      }, 500);
    };

    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    // Initial refresh for mobile
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      setTimeout(() => {
        refreshScrollTrigger();
      }, 300);
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      
      if (window.gsapResizeTimeout) {
        clearTimeout(window.gsapResizeTimeout);
      }
      
      // Kill all ScrollTriggers
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <GSAPContext.Provider value={{ gsap, ScrollTrigger }}>
      {children}
    </GSAPContext.Provider>
  );
}

// Extend Window interface
declare global {
  interface Window {
    gsapResizeTimeout: NodeJS.Timeout;
  }
}