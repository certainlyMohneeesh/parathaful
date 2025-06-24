// components/lazy/LazySection.tsx
'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { gsap } from 'gsap';

interface LazySectionProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
  animationType?: 'fade' | 'slideUp' | 'slideLeft' | 'scale';
}

export default function LazySection({ 
  children, 
  className = '', 
  threshold = 0.1,
  animationType = 'fade'
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  useEffect(() => {
    if (isVisible && sectionRef.current) {
      const animations = {
        fade: { opacity: 0, duration: 0.8 },
        slideUp: { opacity: 0, y: 50, duration: 0.8 },
        slideLeft: { opacity: 0, x: 50, duration: 0.8 },
        scale: { opacity: 0, scale: 0.9, duration: 0.8 }
      };

      const fromProps = animations[animationType];
      gsap.fromTo(sectionRef.current, fromProps, {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        duration: fromProps.duration,
        ease: "power2.out"
      });
    }
  }, [isVisible, animationType]);

  return (
    <div ref={sectionRef} className={className}>
      {isVisible && children}
    </div>
  );
}