'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    const form = formRef.current;

    if (!footer || !form) return;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    // Animate footer entrance
    gsap.fromTo(footer, 
      { 
        y: isMobile ? 40 : 100,
        opacity: 0 
      },
      {
        y: 0,
        opacity: 1,
        duration: isMobile ? 0.7 : 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: footer,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Animate form elements
    const formElements = form.querySelectorAll('.form-element');
    gsap.fromTo(formElements,
      {
        y: isMobile ? 20 : 50,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: isMobile ? 0.5 : 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: form,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add form submission logic here
    console.log('Form submitted');
};

  return (
    <footer ref={footerRef} id="footer-section" className="footer-section px-2 sm:px-4">
      <div className="footer-container">
        <div className="footer-content">
          <h2 className="footer-title">
           GOT A HUNGRY QUESTION? WE'VE GOT A STUFFED ANSWER.
          </h2>
          
          <form ref={formRef} onSubmit={handleSubmit} className="contact-form" autoComplete="on" aria-label="Contact form">
            <div className="form-row">
              <div className="form-element form-group">
                <select className="form-select min-h-12" required aria-label="Subject">
                  <option value="">Subject of address *</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Support</option>
                  <option value="business">Business</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-element form-group">
                <input
                  type="text"
                  placeholder="City"
                  className="form-input min-h-12"
                  required
                  aria-label="City"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-element form-group">
                <input
                  type="text"
                  placeholder="Your name"
                  className="form-input min-h-12"
                  required
                  aria-label="Your name"
                />
              </div>
              
              <div className="form-element form-group">
                <input
                  type="tel"
                  placeholder="Phone"
                  className="form-input min-h-12"
                  required
                  aria-label="Phone"
                />
              </div>
              
              <div className="form-element form-group">
                <input
                  type="email"
                  placeholder="Email"
                  className="form-input min-h-12"
                  required
                  aria-label="Email"
                />
              </div>
            </div>

            <div className="form-element form-group full-width">
              <textarea
                placeholder="Message"
                className="form-textarea min-h-12"
                rows={4}
                required
                aria-label="Message"
              ></textarea>
            </div>

            <div className="form-element">
              <button type="submit" className="submit-btn min-h-12 min-w-12 touch-manipulation">
                SEND THE PARATHA
              </button>
            </div>
          </form>
        </div>

        <div className="footer-bottom">
          <div className="footer-links">
            <p className="copyright">© 2025 Cythical Labs / All Rights Reserved</p>
            <div className="footer-nav">
              <a href="#" className="footer-link">Public Tandoori Terms</a>
              <a href="#" className="footer-link">Facebook</a>
              <a href="#" className="footer-link">Instagram</a>
              <a href="#" className="footer-link">Desi Dispatches Newsletter</a>
            </div>
            <p className="made-by">
              Made by <a href="https://cythical.cyth.me" className="footer-link">Cythical Labs</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;