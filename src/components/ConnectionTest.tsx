'use client';

import { useEffect, useState } from 'react';

// This component helps diagnose network-related animation issues
// on mobile devices where performance can be impacted by poor connectivity
export default function ConnectionTest() {
  const [connectionInfo, setConnectionInfo] = useState<string>('Testing connection...');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') {
      setIsVisible(false);
      return;
    }

    // Test connection speed
    const testConnection = async () => {
      try {
        // Check if the Network Information API is available
        if ('connection' in navigator) {
          const connection = (navigator as any).connection;
          
          const info = [
            `Type: ${connection.effectiveType || 'unknown'}`,
            `Downlink: ${connection.downlink ? connection.downlink + ' Mbps' : 'unknown'}`,
            `RTT: ${connection.rtt ? connection.rtt + ' ms' : 'unknown'}`,
            `Save Data: ${connection.saveData ? 'ON' : 'OFF'}`,
          ];
          
          setConnectionInfo(info.join(' | '));
          
          // Add listener for connection changes
          connection.addEventListener('change', () => {
            const updatedInfo = [
              `Type: ${connection.effectiveType || 'unknown'}`,
              `Downlink: ${connection.downlink ? connection.downlink + ' Mbps' : 'unknown'}`,
              `RTT: ${connection.rtt ? connection.rtt + ' ms' : 'unknown'}`,
              `Save Data: ${connection.saveData ? 'ON' : 'OFF'}`,
            ];
            
            setConnectionInfo(updatedInfo.join(' | '));
          });
        } else {
          // Fallback connection test
          const startTime = Date.now();
          const response = await fetch('/api/ping', {
            method: 'GET',
            cache: 'no-store',
          });
          const endTime = Date.now();
          const latency = endTime - startTime;
          
          if (response.ok) {
            setConnectionInfo(`Latency: ${latency}ms | API Connection: OK`);
          } else {
            setConnectionInfo(`Latency: ${latency}ms | API Connection: Failed`);
          }
        }
      } catch (error) {
        setConnectionInfo('Connection test failed');
      }
    };

    testConnection();

    // Auto-hide after 10 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 10000);

    return () => {
      clearTimeout(timer);
      
      // Remove event listener if it was added
      if ('connection' in navigator) {
        (navigator as any).connection.removeEventListener('change', () => {});
      }
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-2 z-50">
      <div className="flex justify-between items-center">
        <div>Connection: {connectionInfo}</div>
        <button 
          onClick={() => setIsVisible(false)}
          className="px-2 py-1 bg-red-600 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}