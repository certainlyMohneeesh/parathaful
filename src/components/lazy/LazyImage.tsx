'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
}

export default function LazyImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '', 
  priority = false,
  onLoad
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imageRef.current) {
      observerRef.current.observe(imageRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority]);

  useEffect(() => {
    if (isLoaded && imageRef.current) {
      gsap.fromTo(imageRef.current, 
        { opacity: 0, scale: 1.1 },
        { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" }
      );
    }
  }, [isLoaded]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  return (
    <div ref={imageRef} className={`relative overflow-hidden ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-red-200/20 via-orange-200/30 to-red-200/20 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-orange-900/20" />
        </div>
      )}
      {isInView && (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          fill={!width && !height}
          className={`transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${!width && !height ? 'object-cover' : ''}`}
          onLoad={handleLoad}
          priority={priority}
        />
      )}
    </div>
  );
}