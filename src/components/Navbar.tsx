'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { gsap } from 'gsap';

const SECTION_IDS = [
  'hero-section',
  'hero-followup',
  'about-section',
  'about-section2',
  'gallery-section',
  'footer-section',
];

const SECTION_COLOR = {
  'hero-section': 'white',
  'hero-followup': 'red',
  'about-section': 'white',
  'about-section2': 'white',
  'gallery-section': 'red',
  'footer-section': 'white',
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkBackground, setIsDarkBackground] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [sectionColor, setSectionColor] = useState<'white' | 'red'>('white');
  const menuRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<HTMLDivElement[]>([]);
  const backgroundRef = useRef<HTMLDivElement>(null);

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      const heroThreshold = windowHeight * 0.8;
      const galleryStart = windowHeight;
      const galleryEnd = windowHeight + (windowHeight * 0.8);
      
      if (scrollY < heroThreshold) {
        setIsDarkBackground(true);
      } else if (scrollY >= galleryStart && scrollY <= galleryEnd) {
        setIsDarkBackground(false);
      } else if (scrollY > galleryEnd) {
        setIsDarkBackground(true);
      } else {
        setIsDarkBackground(false);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;

    if (isMenuOpen) {
      // Animate menu opening
      gsap.set(menuRef.current, { display: 'flex' });
      
      // Animate background
      gsap.fromTo(backgroundRef.current, 
        { scaleX: 0, transformOrigin: 'right center' },
        { 
          scaleX: 1, 
          duration: 0.6, 
          ease: 'power3.out'
        }
      );

      // Animate menu items
      gsap.fromTo(menuItemsRef.current, 
        { 
          x: 100, 
          opacity: 0 
        },
        { 
          x: 0, 
          opacity: 1, 
          duration: 0.8, 
          stagger: 0.1, 
          delay: 0.3,
          ease: 'power3.out'
        }
      );

      // Disable body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Animate menu closing
      if (menuItemsRef.current.length > 0) {
        gsap.to(menuItemsRef.current, {
          x: 100,
          opacity: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: 'power3.in'
        });
      }

      if (backgroundRef.current) {
        gsap.to(backgroundRef.current, {
          scaleX: 0,
          duration: 0.5,
          delay: 0.2,
          ease: 'power3.in',
          onComplete: () => {
            if (menuRef.current) {
              gsap.set(menuRef.current, { display: 'none' });
            }
          }
        });
      }

      // Re-enable body scroll
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen, isClient]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // IntersectionObserver to track section in view
  const handleSectionChange = useCallback(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        // Find the section most in view
        let maxRatio = 0;
        let currentSection: keyof typeof SECTION_COLOR = 'hero-section';
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            if (SECTION_COLOR.hasOwnProperty(entry.target.id)) {
              currentSection = entry.target.id as keyof typeof SECTION_COLOR;
            }
          }
        });
        setSectionColor(SECTION_COLOR[currentSection] === 'red' ? 'red' : 'white');
      },
      {
        threshold: [0.3, 0.5, 0.7, 1],
      }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return observer;
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const observer = handleSectionChange();
    return () => observer && observer.disconnect();
  }, [isClient, handleSectionChange]);

  // Dynamic classes
  const isRed = sectionColor === 'red';
  const navbarClasses = `
    fixed top-0 left-0 right-0 z-40 p-6 transition-all duration-300 ease-in-out
    ${isRed ? 'bg-white shadow-lg' : 'bg-transparent'}
  `;
  const logoClasses = `
    font-bold text-2xl transition-colors duration-300 shrikhand-regular
    ${isRed ? 'text-red-600' : 'text-white'}
  `;
  const buttonClasses = `
    border px-4 py-2 rounded transition-all duration-300
    ${isRed
      ? 'border-red-600 text-red-600 hover:bg-red-600 hover:text-white'
      : 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white'}
  `;
  const menuButtonClasses = `
    border px-6 py-2 rounded transition-all duration-300 flex items-center space-x-2 cursor-pointer
    ${isRed
      ? 'border-red-600 text-red-600 hover:bg-red-600 hover:text-white'
      : 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white'}
  `;
  const mobileButtonClasses = `
    md:hidden transition-colors duration-300 cursor-pointer
    ${isRed ? 'text-red-600' : 'text-white'}
  `;

  return (
    <>
      <nav className={navbarClasses}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className={`${logoClasses} shrikhand-regular`}>
            ParathaFul
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart */}
            <button className={`${buttonClasses} flex items-center space-x-2`}>
              <ShoppingBag size={20} />
              <span>0</span>
            </button>

            {/* Stuffings Button */}
            <button className={buttonClasses}>
              Stuffings
            </button>

            {/* Menu Button */}
            <button 
              onClick={toggleMenu}
              className={menuButtonClasses}
            >
              <span>Menu</span>
              <Menu size={20} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu}
            className={mobileButtonClasses}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Full Screen Menu Overlay */}
      <div 
        ref={menuRef}
        className="fixed inset-0 z-50"
        style={{ display: 'none' }}
      >
        {/* Background */}
        <div 
          ref={backgroundRef}
          className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-700 to-rose-800"
        />
        
        {/* Close Button */}
        <button 
          onClick={toggleMenu}
          className="absolute top-6 right-6 text-white hover:text-red-200 transition-colors duration-300 z-60"
        >
          <X size={32} />
        </button>

        {/* Menu Content - Perfectly Centered */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center w-full max-w-4xl px-6">
            {/* Menu Items */}
            <div className="space-y-6 md:space-y-8">
              {[
                { label: 'HOME', href: '#' },
                { label: 'ABOUT US', href: '#' },
                { label: 'CATALOG', href: '#' },
                { label: 'SELLING POINTS', href: '#' },
                { label: 'FAQ', href: '#' },
                { label: 'CONTACTS', href: '#' }
              ].map((item, index) => (
                <div
                  key={item.label}
                  ref={(el) => {
                    if (el) menuItemsRef.current[index] = el;
                  }}
                  className="menu-item opacity-0"
                >
                  <a
                    href={item.href}
                    className="block text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-wider hover:text-red-200 transition-colors duration-300 uppercase leading-tight"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                    onClick={toggleMenu}
                  >
                    {item.label}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>
    </>
  );
}