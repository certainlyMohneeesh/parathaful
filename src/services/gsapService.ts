'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

// Performance detection
const detectLowPerformanceDevice = () => {
  if (typeof window === 'undefined') return false;
  
  // Check for low-end devices based on memory and processors
  const memory = (navigator as any).deviceMemory || 4; 
  const processors = navigator.hardwareConcurrency || 4;
  const isLowMemoryDevice = memory < 4;
  const isLowCPUDevice = processors < 4;
  
  // Check for old iOS devices
  const isOldiOS = /iPhone|iPad|iPod/.test(navigator.userAgent) && 
                  (/OS 11|OS 12|OS 13/.test(navigator.userAgent) || 
                   !('requestIdleCallback' in window));
  
  // Mobile detection
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768;
  
  // Battery API check for low battery
  let isLowBattery = false;
  if ('getBattery' in navigator) {
    (navigator as any).getBattery().then((battery: any) => {
      isLowBattery = battery.level < 0.15 && !battery.charging;
    });
  }
  
  // Data saver mode check
  const isDataSaverOn = 'connection' in navigator && 
                        (navigator as any).connection.saveData === true;
  
  // Reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Only return true if multiple factors indicate a low-performance device
  // This ensures desktop users don't get unnecessarily downgraded animations
  return (isLowMemoryDevice && isLowCPUDevice) || 
         (isMobile && (isLowMemoryDevice || isLowCPUDevice || isLowBattery)) || 
         isOldiOS || isDataSaverOn || prefersReducedMotion;
};

// Adaptive animation settings based on device capabilities
const getAdaptiveAnimationSettings = () => {
  const isLowPerformance = detectLowPerformanceDevice();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const isIOS = typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isDesktop = !isMobile && typeof window !== 'undefined' && window.innerWidth >= 1024;
  
  return {
    // Base duration - give desktop longer, more elegant animations
    duration: isLowPerformance ? 0.5 : isMobile ? 0.8 : 1.2,
    
    // Ease - more pronounced on desktop
    ease: isLowPerformance ? 'power1.out' : isMobile ? 'power2.out' : 'power3.out',
    
    // Stagger - more dramatic on desktop
    staggerMultiplier: isLowPerformance ? 0.3 : isMobile ? 0.6 : 1.2,
    
    // Parallax amount - full experience on desktop
    parallaxIntensity: isLowPerformance ? 0 : isMobile ? 0.3 : 1,
    
    // Disable parallax only on low performance devices
    disableParallax: isLowPerformance,
    
    // Simplify scroll trigger only on mobile or low performance
    simplifyScrollTrigger: isLowPerformance || isMobile,
    
    // Only use simple animations on low performance
    useSimpleAnimations: isLowPerformance,
    
    // Enable rich desktop animations
    useEnhancedDesktopAnimations: isDesktop && !isLowPerformance,
    
    // iOS specific optimizations
    useIosOptimizations: isIOS,
    
    // Hardware acceleration for all mobile devices
    force3D: isMobile || isLowPerformance,
    
    // Scrub value - smoother on desktop
    scrubValue: isLowPerformance ? 0.2 : isMobile ? 0.5 : 1,
    
    // Scale effects - more dramatic on desktop
    scaleEffects: isLowPerformance ? 0.05 : isMobile ? 0.1 : 0.15,
    
    // Reduced animation complexity only for very low performance
    skipSecondaryAnimations: isLowPerformance,
    
    // Desktop can handle more complex animations
    allowComplexAnimations: !isMobile && !isLowPerformance,
    
    // Enable dramatic parallax on powerful desktops
    enableDramaticParallax: isDesktop && !isLowPerformance,
  };
};

// Configure GSAP defaults
const configureGSAP = () => {
  if (typeof window === 'undefined') return;
  
  const settings = getAdaptiveAnimationSettings();
  
  // Set GSAP defaults based on device capability
  gsap.defaults({
    duration: settings.duration,
    ease: settings.ease,
    force3D: settings.force3D,
    overwrite: 'auto',
  });
  
  // ScrollTrigger mobile optimizations
  ScrollTrigger.config({
    ignoreMobileResize: settings.simplifyScrollTrigger,
    autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load,resize',
    // Reduce the number of events triggered on mobile only
    limitCallbacks: settings.simplifyScrollTrigger,
    // iOS optimization
    syncInterval: settings.useIosOptimizations ? 100 : 33.3,
  });
  
  // Fix for iOS momentum scrolling issues
  if (settings.useIosOptimizations) {
    ScrollTrigger.normalizeScroll(false);
    ScrollTrigger.clearScrollMemory();
  }
  
  return settings;
};

// Clean up all GSAP instances
const cleanupGSAP = () => {
  if (typeof window === 'undefined') return;
  
  // Kill all ScrollTrigger instances
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  
  // Kill all GSAP animations
  gsap.killTweensOf('*');
  
  // Clear scroll memory
  ScrollTrigger.clearScrollMemory();
  
  // Force refresh
  ScrollTrigger.refresh(true);
};

// Create adaptive animation based on device capabilities
const createAdaptiveAnimation = (
  target: gsap.TweenTarget, 
  vars: gsap.TweenVars, 
  type: 'to' | 'from' | 'fromTo' = 'to'
) => {
  const settings = getAdaptiveAnimationSettings();
  
  // Create desktop-enhanced animations with more dramatic effects
  if (settings.useEnhancedDesktopAnimations) {
    // Enhanced vars for desktop
    const enhancedVars: gsap.TweenVars = {
      ...vars,
      // Ensure desktop animations are smooth and rich
      ease: vars.ease || "power3.out",
      duration: vars.duration ? (vars.duration as number) * 1.2 : settings.duration,
      force3D: true,
    };
    
    // Enhanced scroll triggers for desktop
    if (enhancedVars.scrollTrigger) {
      const st = enhancedVars.scrollTrigger as ScrollTrigger.Vars;
      enhancedVars.scrollTrigger = {
        ...st,
        // Better scrub for smooth desktop experience
        scrub: st.scrub === true ? settings.scrubValue : st.scrub,
        // Better markers for development
        markers: process.env.NODE_ENV === 'development' ? st.markers : false,
        // Handle anticipation/overshoot effects for desktop
        preventOverlaps: false,
      };
    }
    
    // Apply animation with appropriate type
    if (type === 'to') return gsap.to(target, enhancedVars);
    if (type === 'from') return gsap.from(target, enhancedVars);
    if (type === 'fromTo' && 'fromVars' in vars) {
      return gsap.fromTo(target, vars.fromVars as gsap.TweenVars, enhancedVars);
    }
    return gsap.to(target, enhancedVars);
  }
  
  // Create a simplified version of animation for low-performance devices
  if (settings.useSimpleAnimations) {
    // Simplified vars
    const simplifiedVars: gsap.TweenVars = {
      ...vars,
      duration: vars.duration ? (vars.duration as number) * 0.6 : settings.duration,
      ease: 'power1.out',
      force3D: true,
      clearProps: vars.clearProps || 'transform',
    };
    
    // Remove complex transforms for better performance
    if (simplifiedVars.stagger) {
      simplifiedVars.stagger = 
        typeof simplifiedVars.stagger === 'number' 
          ? simplifiedVars.stagger * settings.staggerMultiplier 
          : simplifiedVars.stagger;
    }
    
    // Simplify scroll triggers
    if (simplifiedVars.scrollTrigger) {
      const st = simplifiedVars.scrollTrigger as ScrollTrigger.Vars;
      simplifiedVars.scrollTrigger = {
        ...st,
        scrub: settings.scrubValue,
        preventOverlaps: true,
        fastScrollEnd: true,
        pin: false, // Disable pinning on low-performance devices
      };
    }
    
    // Apply hardware acceleration
    if (target instanceof Element || typeof target === 'string') {
      gsap.set(target, { force3D: true, z: 0.01 });
    }
    
    if (type === 'to') return gsap.to(target, simplifiedVars);
    if (type === 'from') return gsap.from(target, simplifiedVars);
    if (type === 'fromTo' && 'fromVars' in vars) {
      return gsap.fromTo(target, vars.fromVars as gsap.TweenVars, simplifiedVars);
    }
    return gsap.to(target, simplifiedVars);
  }
  
  // Regular animation with basic optimizations for mobile
  const optimizedVars = { 
    ...vars,
    force3D: settings.force3D,
  };
  
  // Optimize scroll trigger if present
  if (optimizedVars.scrollTrigger) {
    const st = optimizedVars.scrollTrigger as ScrollTrigger.Vars;
    optimizedVars.scrollTrigger = {
      ...st,
      scrub: st.scrub === true ? settings.scrubValue : st.scrub,
      preventOverlaps: settings.simplifyScrollTrigger,
    };
  }
  
  if (type === 'to') return gsap.to(target, optimizedVars);
  if (type === 'from') return gsap.from(target, optimizedVars);
  if (type === 'fromTo' && 'fromVars' in vars) {
    return gsap.fromTo(target, vars.fromVars as gsap.TweenVars, optimizedVars);
  }
  return gsap.to(target, optimizedVars);
};

export const gsapService = {
  gsap,
  ScrollTrigger,
  configureGSAP,
  cleanupGSAP,
  createAdaptiveAnimation,
  getAdaptiveAnimationSettings,
};