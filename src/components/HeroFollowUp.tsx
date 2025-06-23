import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HeroFollowUp() {
  const sectionRef = useRef(null);
  const leftTextRef = useRef(null);
  const rightTextRef = useRef(null);
  const imageRef = useRef(null);
  const decorElementsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const leftText = leftTextRef.current;
    const rightText = rightTextRef.current;
    const image = imageRef.current;
    const decorElements = decorElementsRef.current;

    // Set initial states
    gsap.set([leftText, rightText], {
      opacity: 0,
      y: 100
    });

    gsap.set(image, {
      opacity: 0,
      scale: 0.8
    });

    gsap.set(decorElements, {
      opacity: 0,
      rotation: -45,
      scale: 0
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

    // Animate text elements
    tl.to(leftText, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power3.out"
    })
    .to(rightText, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power3.out"
    }, "-=0.8")
    .to(image, {
      opacity: 1,
      scale: 1,
      duration: 1.5,
      ease: "power3.out"
    }, "-=1")
    .to(decorElements, {
      opacity: 1,
      rotation: 0,
      scale: 1,
      duration: 0.8,
      ease: "back.out(1.7)",
      stagger: 0.1
    }, "-=0.5");

    // Parallax effect for decorative elements
    decorElements.forEach((element, index) => {
      gsap.to(element, {
        y: -50 * (index + 1),
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

const addToDecorRefs = (el: HTMLDivElement | null) => {
    if (el && !decorElementsRef.current.includes(el)) {
        (decorElementsRef.current as HTMLDivElement[]).push(el);
    }
};
  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-r from-orange-100 to-pink-50 overflow-hidden"
    >
      {/* Decorative Elements */}
      <div 
        ref={addToDecorRefs}
        className="absolute top-20 left-10 w-8 h-8 text-red-500"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </div>
      
      <div 
        ref={addToDecorRefs}
        className="absolute top-1/3 right-20 w-6 h-6 text-red-500"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10"/>
        </svg>
      </div>
      
      <div 
        ref={addToDecorRefs}
        className="absolute bottom-1/4 left-1/4 w-4 h-4 text-red-500"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </div>

      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-3 gap-12 items-center min-h-screen">
          {/* Left Text Column */}
          <div ref={leftTextRef} className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-black leading-none">
                <span className="block text-red-100 stroke-text">MAP</span>
                <span className="block text-red-100 stroke-text">OF STUFFINGS</span>
              </h2>
              <div className="space-y-2">
                <p className="text-red-600 font-bold text-xl">CHUNKY JOY</p>
              </div>
            </div>
          </div>

          {/* Center Image Column */}
          <div ref={imageRef} className="flex justify-center">
            <div className="relative">
              <div className="w-100 h-100 rounded-lg overflow-hidden shadow-2xl">
                <img 
                  src="/Butter-Topped Aloo Paratha_simple_compose.png" 
                  alt="Hot paratha with butter melting on top."
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Ice cream stick overlay effect */}
              {/* <div className="absolute inset-0 flex items-center justify-center">
                <div className=""></div>
              </div> */}
            </div>
          </div>

          {/* Right Text Column */}
          <div ref={rightTextRef} className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-black leading-none">
                <span className="block text-red-100 stroke-text">DESI CRUST</span>
              </h2>
              <div className="space-y-2">
                <p className="text-red-600 font-bold text-xl">BUT MAKE IT POP</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Red Section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-red-600"></div>
    </section>
  );
}