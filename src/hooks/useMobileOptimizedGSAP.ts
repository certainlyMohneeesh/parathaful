'use client';

import { useEffect, useState } from 'react';
import { gsap } from 'gsap';

export function useMobileOptimizedGSAP() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    // Mobile-specific GSAP settings
    if (isMobile || isTouch) {
      gsap.config({
        force3D: true,
        nullTargetWarn: false,
      });
    }

    return () => window.removeEventListener('resize', checkDevice);
  }, [isMobile, isTouch]);

  const createMobileOptimizedAnimation = (target: any, vars: any) => {
    if (isMobile || isTouch) {
      // Simplify animations for mobile
      return gsap.to(target, {
        ...vars,
        duration: Math.min(vars.duration || 1, 0.8), // Faster animations
        ease: vars.ease || "power2.out",
        force3D: true,
      });
    }
    return gsap.to(target, vars);
  };

  return { isMobile, isTouch, createMobileOptimizedAnimation };
}