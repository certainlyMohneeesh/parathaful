'use client';

import { useEffect, useRef } from 'react';
import { useGSAP } from '@/providers/GSAPProvider';

export default function AboutUsSection2() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const backgroundImageRef = useRef<HTMLDivElement>(null);
  
  const { gsap, ScrollTrigger, isMobile, isLowPerformance, createAnimation } = useGSAP();

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const backgroundImage = backgroundImageRef.current;
    
    if (!section || !headline || !backgroundImage) return;
    
    try {
      // Set initial states with enhanced desktop values
      gsap.set(headline, {
        opacity: 0,
        y: isMobile ? 50 : 100, // More dramatic for desktop
        force3D: true,
      });
      
      gsap.set(backgroundImage, {
        scale: isMobile ? 1.1 : 1.3, // More dramatic starting scale for desktop
        opacity: 0.2,
        force3D: true,
        transformOrigin: "center center",
      });
      
      // For low performance devices, just fade in without complex animations
      if (isLowPerformance) {
        gsap.to(headline, {
          opacity: 1,
          y: 0,
          duration: 0.5,
        });
        
        gsap.to(backgroundImage, {
          scale: 1,
          opacity: 0.2,
          duration: 0.5,
        });
        return;
      }
      
      // ENHANCED DESKTOP ANIMATIONS
      if (!isMobile) {
        // Create a more dramatic timeline for desktop
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 70%", // Start earlier on desktop
            end: "center center",
            toggleActions: "play none none reverse",
          }
        });
        
        tl.to(backgroundImage, {
          scale: 1,
          opacity: 0.4, // More visible on desktop
          rotation: -5, // Add subtle rotation for desktop
          duration: 2.5, // Longer, smoother animation
          ease: "power2.inOut",
          force3D: true,
        })
        .to(headline, {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power3.out",
          force3D: true,
        }, "-=2");
        
        // Add floating animation to background for desktop
        gsap.to(backgroundImage, {
          y: -30,
          x: 10,
          rotation: -3,
          duration: 6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
        
        // Enhanced parallax effect for desktop
        createAnimation(backgroundImage, {
          y: -80, // More dramatic parallax on desktop
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          }
        });
        
        // Text reveal effect for desktop
        const words = headline.innerText.split(' ');
        headline.innerHTML = '';
        
        words.forEach((word, index) => {
          const span = document.createElement('span');
          span.innerHTML = word + ' ';
          span.style.display = 'inline-block';
          span.style.opacity = '0';
          span.style.transform = 'translateY(20px)';
          headline.appendChild(span);
          
          gsap.to(span, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.1 * index,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
            }
          });
        });
      } else {
        // Mobile optimized animations
        const duration = 1.5;
        
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse",
          }
        });
        
        tl.to(backgroundImage, {
          scale: 1,
          opacity: 0.2,
          duration: duration,
          ease: "power2.out",
          force3D: true,
        })
        .to(headline, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          force3D: true,
        }, "-=1");
      }
    } catch (error) {
      console.error('Error in AboutUsSection2 animations:', error);
      
      // Fallback: Make sure elements are visible even if animations fail
      gsap.set([headline, backgroundImage], { 
        opacity: headline === null ? 0 : 1, 
        scale: backgroundImage === null ? 1 : 1,
        clearProps: "transform,opacity" 
      });
    }

    return () => {
      // Clean up all scroll triggers related to this section
      ScrollTrigger.getAll()
        .filter(trigger => trigger.vars.trigger === section)
        .forEach(trigger => trigger.kill());
    };
  }, [gsap, ScrollTrigger, isMobile, isLowPerformance, createAnimation]);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen bg-red-600 overflow-hidden flex items-center justify-center"
    >
      {/* Background Image */}
      <div 
        ref={backgroundImageRef}
        className="absolute inset-0 flex items-center justify-center hardware-accelerated"
      >
        <div className="w-96 h-96 rounded-full overflow-hidden opacity-20">
          <img 
            src="/people_rolling_parathas.png" 
            alt="People laughing while rolling parathas."
            className="w-full h-full object-cover rounded-full"
            loading="lazy"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="text-center">
          <h2 
            ref={headlineRef}
            className="text-4xl md:text-6xl lg:text-8xl font-black text-white leading-tight max-w-6xl mx-auto hardware-accelerated"
          >
            THIS IS PATAKHA PARATHA. IT'LL MELT HEARTS, FILL STOMACHS, AND SPICE UP MEMORIES.
          </h2>
        </div>
      </div>
    </section>
  );
}