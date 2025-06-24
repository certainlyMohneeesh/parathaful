'use client';

import { useEffect, useRef, RefObject } from 'react';
import { useGSAP } from '@/providers/GSAPProvider';

interface AnimationOptions {
  // Animation type
  type?: 'fade' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale' | 'custom';
  // Custom animation properties
  customProps?: gsap.TweenVars;
  // Scroll trigger options
  scroll?: {
    trigger?: RefObject<HTMLElement> | null;
    start?: string;
    end?: string;
    scrub?: boolean | number;
    pin?: boolean;
    markers?: boolean;
    toggleActions?: string;
  };
  // Additional options
  delay?: number;
  duration?: number;
  stagger?: number | object;
  threshold?: number;
  reverse?: boolean;
  once?: boolean;
  onStart?: () => void;
  onComplete?: () => void;
}

export function useAdaptiveAnimation<T extends HTMLElement>(options: AnimationOptions = {}) {
  const elementRef = useRef<T>(null);
  const animation = useRef<gsap.core.Tween | null>(null);
  const isAnimated = useRef(false);
  
  const { createAnimation, gsap, ScrollTrigger, isMobile, isLowPerformance } = useGSAP();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Clean up function to ensure proper disposal
    const cleanup = () => {
      if (animation.current) {
        animation.current.kill();
        animation.current = null;
      }
    };

    try {
      // Skip animation on low performance devices if it's not critical
      if (isLowPerformance && options.type !== 'fade' && !options.customProps) {
        return cleanup;
      }

      // Basic animation presets with ENHANCED DESKTOP VALUES
      const getAnimationProps = (): gsap.TweenVars => {
        // Enhanced values for desktop
        const distance = isMobile ? 20 : 80; // More dramatic for desktop
        const scaleFactor = isMobile ? 0.05 : 0.15; // More dramatic for desktop
        const baseDuration = isMobile ? 0.6 : 1.2; // Longer for desktop
        const desktopEase = "power3.out"; // Enhanced ease for desktop
        
        switch (options.type) {
          case 'fade':
            return {
              opacity: 0,
              duration: options.duration || baseDuration,
              ease: isMobile ? "power2.out" : desktopEase
            };
          case 'slideUp':
            return {
              opacity: 0,
              y: distance,
              duration: options.duration || baseDuration,
              ease: isMobile ? "power2.out" : desktopEase
            };
          case 'slideDown':
            return {
              opacity: 0,
              y: -distance,
              duration: options.duration || baseDuration,
              ease: isMobile ? "power2.out" : desktopEase
            };
          case 'slideLeft':
            return {
              opacity: 0,
              x: distance,
              duration: options.duration || baseDuration,
              ease: isMobile ? "power2.out" : desktopEase
            };
          case 'slideRight':
            return {
              opacity: 0,
              x: -distance,
              duration: options.duration || baseDuration,
              ease: isMobile ? "power2.out" : desktopEase
            };
          case 'scale':
            return {
              opacity: 0,
              scale: 1 - scaleFactor,
              duration: options.duration || baseDuration,
              ease: isMobile ? "power2.out" : desktopEase
            };
          case 'custom':
          default:
            return options.customProps || { 
              opacity: 0, 
              duration: baseDuration,
              ease: isMobile ? "power2.out" : desktopEase
            };
        }
      };

      // Set up animation variables
      const animationProps = getAnimationProps();
      
      // Add common properties
      const vars: gsap.TweenVars = {
        ...animationProps,
        delay: options.delay || 0,
        stagger: options.stagger || 0,
        onStart: options.onStart,
        onComplete: () => {
          isAnimated.current = true;
          options.onComplete?.();
        },
        clearProps: isMobile ? "transform,opacity" : undefined, // Only clear props on mobile
      };

      // Set initial state
      gsap.set(element, { 
        opacity: 0, 
        force3D: true, 
        willChange: isMobile ? "transform, opacity" : "auto" // Only set willChange on mobile
      });
      
      // Create animation based on scroll trigger or normal animation
      if (options.scroll) {
        const trigger = options.scroll.trigger ? options.scroll.trigger.current : element;
        
        if (!trigger) return cleanup;
        
        // Enhanced scroll trigger settings with desktop improvements
        const scrollTriggerSettings: ScrollTrigger.Vars = {
          trigger,
          start: options.scroll.start || (isMobile ? 'top 80%' : 'top 85%'), // Start earlier on desktop
          end: options.scroll.end || (isMobile ? 'bottom 20%' : 'center center'), // Better end position for desktop
          toggleActions: options.scroll.toggleActions || 'play none none none',
          once: options.once !== undefined ? options.once : false,
        };
        
        // Add scrub only if explicitly requested
        if (options.scroll.scrub !== undefined) {
          scrollTriggerSettings.scrub = options.scroll.scrub;
        }
        
        // Only add pinning on desktop - avoid on mobile
        if (options.scroll.pin && !isMobile) {
          scrollTriggerSettings.pin = options.scroll.pin;
        }
        
        // Add markers only in development
        if (process.env.NODE_ENV === 'development' && options.scroll.markers) {
          scrollTriggerSettings.markers = options.scroll.markers;
        }
        
        // Create animation with scroll trigger
        animation.current = createAnimation(element, {
          ...vars,
          scrollTrigger: scrollTriggerSettings,
        }, options.reverse ? 'from' : 'to');
      } else {
        // Create animation with IntersectionObserver for viewport detection
        const observer = new IntersectionObserver(
          (entries) => {
            const entry = entries[0];
            if (entry.isIntersecting && !isAnimated.current) {
              animation.current = createAnimation(
                element, 
                vars,
                options.reverse ? 'from' : 'to'
              );
              
              // Disconnect after animation if once is true
              if (options.once) {
                observer.disconnect();
              }
            }
          },
          { threshold: options.threshold || (isMobile ? 0.1 : 0.2) } // Higher threshold for desktop
        );
        
        observer.observe(element);
        
        // Include observer cleanup
        return () => {
          observer.disconnect();
          cleanup();
        };
      }
    } catch (error) {
      console.error('Animation error:', error);
      // Reset element to visible state in case of error
      if (elementRef.current) {
        gsap.set(elementRef.current, { opacity: 1, clearProps: 'all' });
      }
    }

    return cleanup;
  }, [createAnimation, gsap, ScrollTrigger, isMobile, isLowPerformance, options]);

  return elementRef;
}