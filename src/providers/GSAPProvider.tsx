'use client';

import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { gsapService } from '@/services/gsapService';

interface GSAPContextType {
  gsap: typeof gsapService.gsap;
  ScrollTrigger: typeof gsapService.ScrollTrigger;
  createAnimation: typeof gsapService.createAdaptiveAnimation;
  settings: ReturnType<typeof gsapService.getAdaptiveAnimationSettings>;
  refresh: () => void;
  isMobile: boolean;
  isLowPerformance: boolean;
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
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const [settings, setSettings] = useState(() => gsapService.getAdaptiveAnimationSettings());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasErroredRef = useRef(false);

  const safeRefresh = () => {
    try {
      // Only refresh if the component is still mounted
      if (isMounted) {
        gsapService.ScrollTrigger.refresh(true);
      }
    } catch (error) {
      // Don't keep trying if we've errored before
      if (!hasErroredRef.current) {
        console.error('Error refreshing ScrollTrigger:', error);
        hasErroredRef.current = true;
      }
    }
  };

  const debouncedRefresh = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      safeRefresh();
    }, 150);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    setIsMounted(true);
    
    try {
      // Configure GSAP
      const adaptiveSettings = gsapService.configureGSAP();
      setSettings(adaptiveSettings || settings);
      
      // Set initial device detection states
      setIsMobile(window.innerWidth < 768);
      setIsLowPerformance(detectLowPerformance());
      
      // Mobile refresh handler with debouncing
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
        debouncedRefresh();
      };
      
      // Handle orientation changes more aggressively 
      const handleOrientationChange = () => {
        // Wait a bit longer for orientation to complete
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
          safeRefresh();
        }, 500); // Longer timeout for orientation
      };
      
      // Add visibility change handler for background/foreground transitions
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          debouncedRefresh();
        }
      };
      
      // Add event listeners
      window.addEventListener('resize', handleResize, { passive: true });
      window.addEventListener('orientationchange', handleOrientationChange, { passive: true });
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      // Initial refresh with delay to ensure content is loaded
      timeoutRef.current = setTimeout(safeRefresh, 300);
      
      // Check for low performance
      function detectLowPerformance() {
        if (typeof window === 'undefined') return false;
        
        // Device memory check (part of Navigator API in Chrome)
        const lowMemory = (navigator as any).deviceMemory ? (navigator as any).deviceMemory < 4 : false;
        
        // Hardware concurrency check (CPU cores)
        const lowCPU = navigator.hardwareConcurrency ? navigator.hardwareConcurrency < 4 : false;
        
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Check for low-end device characteristics
        const isOldDevice = !('IntersectionObserver' in window) || !('requestAnimationFrame' in window);
        
        return lowMemory || lowCPU || prefersReducedMotion || isOldDevice;
      }
      
      return () => {
        setIsMounted(false);
        
        // Clean up event listeners
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('orientationchange', handleOrientationChange);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        
        // Clear any pending timeouts
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        // Clean up GSAP
        gsapService.cleanupGSAP();
      };
    } catch (error) {
      console.error('Error in GSAPProvider setup:', error);
      hasErroredRef.current = true;
      // Continue rendering children even if GSAP fails to initialize
      // This ensures the app doesn't crash even if animations don't work
    }
  }, []);

  return (
    <GSAPContext.Provider value={{
      gsap: gsapService.gsap,
      ScrollTrigger: gsapService.ScrollTrigger,
      createAnimation: gsapService.createAdaptiveAnimation,
      settings,
      refresh: safeRefresh,
      isMobile,
      isLowPerformance
    }}>
      {children}
    </GSAPContext.Provider>
  );
}