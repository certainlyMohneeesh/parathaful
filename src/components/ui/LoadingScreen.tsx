'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';

interface LoadingScreenProps {
  isLoading: boolean;
  onLoadingComplete?: () => void;
}

export default function LoadingScreen({ isLoading, onLoadingComplete }: LoadingScreenProps) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const parathaRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loaderRef.current || !parathaRef.current || !textRef.current) return;

    const tl = gsap.timeline();

    if (isLoading) {
      // Initial setup
      gsap.set([parathaRef.current, textRef.current], { opacity: 0, scale: 0.5 });
      
      // Entrance animation
      tl.to(parathaRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.7)"
      })
      .to(textRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.4");

      // Continuous rotation
      gsap.to(parathaRef.current, {
        rotation: 360,
        duration: 3,
        ease: "none",
        repeat: -1
      });

      // Pulsing effect for text
      gsap.to(textRef.current, {
        scale: 1.05,
        duration: 1.5,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      });

    } else {
      // Exit animation
      tl.to([parathaRef.current, textRef.current], {
        opacity: 0,
        scale: 0.8,
        duration: 0.5,
        ease: "power2.in"
      })
      .to(overlayRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: onLoadingComplete
      }, "-=0.2");
    }

    return () => {
      tl.kill();
    };
  }, [isLoading, onLoadingComplete]);

  if (!isLoading) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100"
    >
      <div
        ref={loaderRef}
        className="flex flex-col items-center justify-center space-y-8"
      >
        {/* Paratha SVG Container */}
        <div
          ref={parathaRef}
          className="relative w-32 h-32 md:w-40 md:h-40"
        >
          <div className="absolute inset-0 bg-orange-200/30 rounded-full blur-xl animate-pulse" />
          <Image
            src="/paratha-loader.svg"
            alt="Loading..."
            width={160}
            height={160}
            className="relative z-10 w-full h-full object-contain filter drop-shadow-lg"
            priority
          />
        </div>

        {/* Loading Text */}
        <div
          ref={textRef}
          className="text-center space-y-2"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-orange-800">
            Preparing Something Delicious
          </h2>
          <div className="flex items-center justify-center space-x-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
}