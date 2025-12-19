'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, CameraOff } from 'lucide-react';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (error: string) => void;
  width?: number;
  aspectRatio?: number;
}

/**
 * QR Code Scanner Component
 * 
 * Wrapper around html5-qrcode for scanning QR codes via camera
 * Used by students to scan attendance QR codes
 */
export function QRScanner({
  onScanSuccess,
  onScanError,
  width = 600,
  aspectRatio = 1,
}: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const elementId = 'qr-reader';

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      setError(null);
      
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(elementId);
      }

      await scannerRef.current.start(
        { facingMode: 'environment' }, // Use back camera on mobile
        {
          fps: 10, // Frames per second
          qrbox: { width: 250, height: 250 }, // Scanning area
          aspectRatio,
        },
        (decodedText) => {
          // Success callback
          onScanSuccess(decodedText);
          // Optionally stop scanning after successful scan
          stopScanning();
        },
        (errorMessage) => {
          // Error callback (fires frequently, can be ignored)
          // Only report actual errors, not "No QR code found"
          if (!errorMessage.includes('NotFoundException')) {
            console.error('Scan error:', errorMessage);
          }
        }
      );

      setIsScanning(true);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to start camera';
      setError(errorMsg);
      if (onScanError) {
        onScanError(errorMsg);
      }
    }
  };

  const stopScanning = async () => {
    try {
      if (scannerRef.current?.isScanning) {
        await scannerRef.current.stop();
      }
      setIsScanning(false);
    } catch (err) {
      console.error('Error stopping scanner:', err);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Scanner Display */}
          <div
            id={elementId}
            className="mx-auto overflow-hidden rounded-lg border-2 border-primary"
            style={{ width: '100%', maxWidth: `${width}px` }}
          />

          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Controls */}
          <div className="flex justify-center">
            {!isScanning ? (
              <Button onClick={startScanning} size="lg">
                <Camera className="mr-2 h-5 w-5" />
                Start Scanning
              </Button>
            ) : (
              <Button onClick={stopScanning} variant="destructive" size="lg">
                <CameraOff className="mr-2 h-5 w-5" />
                Stop Scanning
              </Button>
            )}
          </div>

          {/* Instructions */}
          <div className="text-center text-sm text-muted-foreground">
            {isScanning
              ? 'Point your camera at the QR code to scan'
              : 'Click "Start Scanning" to begin'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
