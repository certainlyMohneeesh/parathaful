'use client';

import { useEffect } from 'react';
import { useGSAP } from '@/providers/GSAPProvider';

// This component applies desktop-only enhancements
export default function DesktopEnhancer() {
  const { isMobile, isLowPerformance, gsap } = useGSAP();

  useEffect(() => {
    // Only apply these enhancements on desktop
    if (isMobile || isLowPerformance) return;
    
    // Add desktop enhancement class
    document.documentElement.classList.add('desktop-enhanced');
    
    // Add subtle mouse parallax effects to decorative elements
    const parallaxElements = document.querySelectorAll('.parallax-element');
    
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position as percentage of screen
      const mouseX = e.clientX / window.innerWidth - 0.5;
      const mouseY = e.clientY / window.innerHeight - 0.5;
      
      // Apply subtle movement to parallax elements
      parallaxElements.forEach((element, index) => {
        const factor = 20 * (index % 3 + 1); // Different factors for variety
        gsap.to(element, {
          x: mouseX * factor,
          y: mouseY * factor,
          duration: 1,
          ease: "power1.out",
          overwrite: "auto"
        });
      });
    };
    
    // Add mouse move listener for desktop parallax
    window.addEventListener('mousemove', handleMouseMove);
    
    // Apply subtle animations to desktop elements
    const headings = document.querySelectorAll('h1, h2, h3, h4');
    headings.forEach(heading => {
      heading.classList.add('desktop-typography');
    });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.classList.remove('desktop-enhanced');
    };
  }, [isMobile, isLowPerformance, gsap]);

  // This component doesn't render anything visible
  return null;
}