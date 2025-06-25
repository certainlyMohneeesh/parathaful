import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export default function AboutUsSection() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const contentRef = useRef(null);
  const imageRef = useRef(null);
  const ctaRef = useRef(null);
  const cloudRef = useRef(null);
  const leftImageRef = useRef(null);
  const orangeBoxRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const content = contentRef.current;
    const image = imageRef.current;
    const cta = ctaRef.current;
    const cloud = cloudRef.current;
    const leftImage = leftImageRef.current;
    const orangeBox = orangeBoxRef.current;

    // Detect mobile
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    // Set initial states
    gsap.set([headline, content, image, cta, leftImage, orangeBox], {
      opacity: 0,
      y: isMobile ? 40 : 100
    });

    gsap.set(cloud, {
      opacity: 0,
      x: isMobile ? 40 : 100
    });

    // Create timeline for entrance animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 70%",
        end: "bottom 30%",
        toggleActions: "play none none reverse"
      }
    });

    // Animate elements in sequence
    tl.to(leftImage, {
      opacity: 1,
      y: 0,
      duration: isMobile ? 0.7 : 1,
      ease: 'power2.out'
    })
    .to(orangeBox, {
      opacity: 1,
      y: 0,
      duration: isMobile ? 0.7 : 1,
      ease: 'power2.out'
    }, '-=0.5')
    .to(headline, {
      opacity: 1,
      y: 0,
      duration: isMobile ? 0.8 : 1.2,
      ease: 'power2.out'
    }, '-=0.8')
    .to(content, {
      opacity: 1,
      y: 0,
      duration: isMobile ? 0.7 : 1,
      ease: 'power2.out'
    }, '-=0.6')
    .to(image, {
      opacity: 1,
      y: 0,
      duration: isMobile ? 1 : 2,
      ease: 'power2.out'
    }, '-=0.8')
    .to(cloud, {
      opacity: 1,
      x: 0,
      duration: isMobile ? 0.7 : 1,
      ease: 'power2.out'
    }, '-=0.5')
    .to(cta, {
      opacity: 1,
      y: 0,
      duration: isMobile ? 0.5 : 0.8,
      ease: 'power2.out'
    }, '-=0.3');

    // Only float cloud on desktop
    if (!isMobile) {
      gsap.to(cloud, {
        y: -20,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
      });
    }

    // Parallax effect for images only on desktop
    if (!isMobile) {
      gsap.to([leftImage, image], {
        y: -50,
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="about-section"
      className="relative min-h-screen bg-red-600 overflow-hidden"
    >
      {/* Left Image Section */}
      <div className="absolute top-0 left-0 w-40 sm:w-60 md:w-80 h-48 sm:h-72 md:h-96">
        <div ref={leftImageRef} className="relative w-full h-full">
          <Image 
            src="/man-eating.png" 
            alt="People enjoying aloo parathas."
            fill
            sizes="(max-width: 640px) 160px, (max-width: 768px) 240px, 320px"
            className="object-cover rounded-br-lg"
            loading="lazy"
            draggable={false}
            priority={false}
          />
        </div>
      </div>

      {/* Orange Box */}
      <div 
        ref={orangeBoxRef}
        className="absolute top-24 sm:top-32 left-40 sm:left-64 md:left-96 w-40 sm:w-52 md:w-64 h-16 sm:h-24 md:h-32 bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg shadow-lg"
      ></div>

      {/* Cloud Decoration
      <div 
        ref={cloudRef}
        className="absolute top-20 right-20 text-white opacity-30"
      >
        <svg width="120" height="80" viewBox="0 0 120 80" fill="currentColor">
          <path d="M90 40c0-11.046-8.954-20-20-20s-20 8.954-20 20c-5.523 0-10 4.477-10 10s4.477 10 10 10h40c5.523 0 10-4.477 10-10s-4.477-10-10-10z"/>
        </svg>
      </div> */}

      <div className="container mx-auto px-2 sm:px-6 py-10 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-12 items-center min-h-screen">
          {/* Left Content */}
          <div className="space-y-8 lg:pl-20">
            <div ref={headlineRef} className="space-y-6">
              <h2 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight">
                IF YOU’VE HAD IT, YOU ALREADY KNOW. IF YOU HAVEN’T, PREPARE FOR THE DESI DOSE OF EMOTIONAL CRISPNESS.
              </h2>
            </div>

            <div ref={contentRef} className="space-y-6 text-white">
              <p className="text-base sm:text-lg leading-relaxed">
                We’re not selling just food. We’re serving edible nostalgia. Every patakha paratha is handcrafted with love, loaded with stories, and toasted to tell tales of bustling streets and sunday morning breakfasts.
              </p>
              
              <p className="text-base sm:text-lg leading-relaxed">
                How? We don’t take shortcuts. The potatoes are hand-mashed, the masalas are ground fresh by Dadi, and the dough? Let’s just say it’s soft enough to bring peace to a chaotic Monday.
              </p>
            </div>

            {/* CTA Button */}
            <div ref={ctaRef} className="pt-6 sm:pt-8">
              <button className="group flex items-center space-x-4 text-white hover:text-red-100 transition-colors min-h-12 min-w-12 touch-manipulation">
                <div className="flex items-center justify-center w-12 h-12 sm:w-20 sm:h-20 border-2 border-white rounded-full group-hover:bg-white group-hover:text-red-600 transition-all duration-300">
                  <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform duration-300" />
                </div>
                <span className="text-base sm:text-lg font-semibold uppercase tracking-wider">MEET THE MASALA</span>
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div ref={imageRef} className="flex justify-end">
            <div className="relative">
              <div className="w-40 sm:w-60 md:w-80 h-48 sm:h-72 md:h-96 rounded-lg overflow-hidden shadow-2xl">
                <Image 
                  src="/woman-eating.png" 
                  alt="Hot aloo paratha with butter melting on top."
                  fill
                  sizes="(max-width: 640px) 160px, (max-width: 768px) 240px, 320px"
                  className="object-cover"
                  loading="lazy"
                  draggable={false}
                  priority={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
