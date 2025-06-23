import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AboutUsSection2() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const backgroundImageRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const backgroundImage = backgroundImageRef.current;

    // Set initial states
    gsap.set(headline, {
      opacity: 0,
      y: 100
    });

    gsap.set(backgroundImage, {
      scale: 1.2,
      opacity: 1
    });

    // Create timeline for entrance animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    });

    tl.to(backgroundImage, {
      scale: 1,
      opacity: 2,
      duration: 2,
      ease: "power2.out"
    })
    .to(headline, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out"
    }, "-=1");

    // Parallax effect
    gsap.to(backgroundImage, {
      y: -100,
      opacity: 1,
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
      className="relative min-h-screen bg-red-600 overflow-hidden flex items-center justify-center"
    >
      {/* Background Image */}
      <div 
        ref={backgroundImageRef}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="w-96 h-96 rounded-full overflow-hidden opacity-20">
          <img 
            src="/people_rolling_parathas.png" 
            alt="People laughing while rolling parathas."
            className="w-full h-full object-cover rounded-full transform transition-transform duration-500 ease-in-out"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6">
        <div ref={headlineRef} className="text-center">
          <h2 className="text-4xl md:text-6xl lg:text-8xl font-black text-white leading-tight max-w-6xl mx-auto">
            THIS IS PATAKHA PARATHA. IT'LL MELT HEARTS, FILL STOMACHS, AND SPICE UP MEMORIES.
          </h2>
        </div>
      </div>
    </section>
  );
}