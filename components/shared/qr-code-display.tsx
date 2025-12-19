'use client';

import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface QRCodeDisplayProps {
  value: string;
  title?: string;
  size?: number;
  showDownload?: boolean;
}

/**
 * QR Code Display Component
 * 
 * Wrapper around qrcode.react for generating and displaying QR codes
 * Used by admin to display session QR codes
 */
export function QRCodeDisplay({
  value,
  title = 'Scan QR Code',
  size = 256,
  showDownload = true,
}: QRCodeDisplayProps) {
  const downloadQRCode = () => {
    // Get the SVG element
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    // Convert SVG to data URL
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    // Create download link
    const link = document.createElement('a');
    link.href = url;
    link.download = `qr-code-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        {/* QR Code */}
        <div className="rounded-lg bg-white p-6">
          <QRCodeSVG
            id="qr-code-svg"
            value={value}
            size={size}
            level="H" // High error correction
            includeMargin={true}
          />
        </div>

        {/* Session ID */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Session ID:</p>
          <p className="font-mono text-sm font-medium">{value}</p>
        </div>

        {/* Download Button */}
        {showDownload && (
          <Button onClick={downloadQRCode} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download QR Code
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
