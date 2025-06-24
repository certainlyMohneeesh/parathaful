import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

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

    // Set initial states
    gsap.set([headline, content, image, cta, leftImage, orangeBox], {
      opacity: 0,
      y: 100
    });

    gsap.set(cloud, {
      opacity: 0,
      x: 100
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
      duration: 1,
      ease: "power3.out"
    })
    .to(orangeBox, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out"
    }, "-=0.5")
    .to(headline, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power3.out"
    }, "-=0.8")
    .to(content, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out"
    }, "-=0.6")
    .to(image, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power3.out"
    }, "-=0.8")
    .to(cloud, {
      opacity: 1,
      x: 0,
      duration: 1,
      ease: "back.out(1.7)"
    }, "-=0.5")
    .to(cta, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.3");

    // Floating animation for cloud
    gsap.to(cloud, {
      y: -20,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    });

    // Parallax effect for images
    gsap.to([leftImage, image], {
      y: -50,
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 1
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen bg-red-600 overflow-hidden"
    >
      {/* Left Image Section */}
      <div className="absolute top-0 left-0 w-80 h-96">
        <div ref={leftImageRef} className="relative w-full h-full">
          <img 
            src="/man-eating.png" 
            alt="People enjoying aloo parathas."
            className="w-full h-full object-cover rounded-br-lg"
          />
        </div>
      </div>

      {/* Orange Box */}
      <div 
        ref={orangeBoxRef}
        className="absolute top-32 left-96 w-64 h-32 bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg shadow-lg"
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

      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Left Content */}
          <div className="space-y-8 lg:pl-20">
            <div ref={headlineRef} className="space-y-6">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight">
                IF YOU’VE HAD IT, YOU ALREADY KNOW. IF YOU HAVEN’T, PREPARE FOR THE DESI DOSE OF EMOTIONAL CRISPNESS.
              </h2>
            </div>

            <div ref={contentRef} className="space-y-6 text-white">
              <p className="text-lg leading-relaxed">
                We’re not selling just food. We’re serving edible nostalgia. Every patakha paratha is handcrafted with love, loaded with stories, and toasted to tell tales of bustling streets and sunday morning breakfasts.
              </p>
              
              <p className="text-lg leading-relaxed">
                How? We don’t take shortcuts. The potatoes are hand-mashed, the masalas are ground fresh by Dadi, and the dough? Let’s just say it’s soft enough to bring peace to a chaotic Monday.
              </p>
            </div>

            {/* CTA Button */}
            <div ref={ctaRef} className="pt-8">
              <button className="group flex items-center space-x-4 text-white hover:text-red-100 transition-colors">
                <div className="flex items-center justify-center w-20 h-20 border-2 border-white rounded-full group-hover:bg-white group-hover:text-red-600 transition-all duration-300">
                  <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform duration-300" />
                </div>
                <span className="text-lg font-semibold uppercase tracking-wider">MEET THE MASALA</span>
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div ref={imageRef} className="flex justify-end">
            <div className="relative">
              <div className="w-80 h-96 rounded-lg overflow-hidden shadow-2xl">
                <img 
                  src="/woman-eating.png" 
                  alt="Hot aloo paratha with butter melting on top."
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
