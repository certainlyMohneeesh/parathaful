'use client';

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';

type OptimizedImageProps = ImageProps & {
  lowQualitySrc?: string;
  highPriority?: boolean;
};

export default function OptimizedImage({
  src,
  alt,
  lowQualitySrc,
  highPriority = false,
  ...props
}: OptimizedImageProps) {
  const [isLowBandwidth, setIsLowBandwidth] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Check for low bandwidth conditions
    const checkConnection = () => {
      // Network Information API
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        // Consider 3G or lower as low bandwidth
        if (
          connection.effectiveType === 'slow-2g' ||
          connection.effectiveType === '2g' ||
          connection.effectiveType === '3g' ||
          connection.saveData === true ||
          connection.downlink < 1.5 // less than 1.5 Mbps
        ) {
          setIsLowBandwidth(true);
        } else {
          setIsLowBandwidth(false);
        }
      }
    };
    
    checkConnection();
    
    // Listen for connection changes
    if ('connection' in navigator) {
      (navigator as any).connection.addEventListener('change', checkConnection);
    }
    
    return () => {
      if ('connection' in navigator) {
        (navigator as any).connection.removeEventListener('change', checkConnection);
      }
    };
  }, []);
  
  // Use low quality source in low bandwidth conditions if provided
  const imageSrc = (isLowBandwidth && lowQualitySrc) ? lowQualitySrc : src;
  
  // Determine loading strategy based on priority and connection
  const loadingStrategy = highPriority ? 'eager' : (isLowBandwidth ? 'lazy' : 'lazy');
  
  return (
    <div className={`relative ${!isLoaded ? 'bg-gray-200 animate-pulse' : ''}`}>
      <Image
        src={imageSrc}
        alt={alt}
        loading={loadingStrategy as any}
        onLoad={() => setIsLoaded(true)}
        {...props}
        className={`${props.className || ''} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      />
    </div>
  );
}