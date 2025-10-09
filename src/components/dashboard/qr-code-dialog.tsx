
'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '../ui/skeleton';
import { Download } from 'lucide-react';
import Image from 'next/image';

type QRCodeDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  url: string;
};

export default function QRCodeDialog({ isOpen, setIsOpen, url }: QRCodeDialogProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && url) {
      QRCode.toDataURL(url, { width: 300, margin: 2 }, (err, dataUrl) => {
        if (err) {
          console.error('Failed to generate QR code', err);
          return;
        }
        setQrCodeDataUrl(dataUrl);
      });
    }
  }, [isOpen, url]);

  const handleDownload = () => {
    if (!qrCodeDataUrl) return;
    const link = document.createElement('a');
    link.href = qrCodeDataUrl;
    link.download = 'vitrine-qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code de votre Vitrine</DialogTitle>
          <DialogDescription>
            Vos clients peuvent scanner ce code pour accéder directement à votre page publique.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center p-4">
          {qrCodeDataUrl ? (
            <Image src={qrCodeDataUrl} alt="QR Code" width={250} height={250} />
          ) : (
            <Skeleton className="h-[250px] w-[250px]" />
          )}
        </div>
        <DialogFooter className='sm:justify-center'>
          <Button onClick={handleDownload} disabled={!qrCodeDataUrl}>
            <Download className="mr-2 h-4 w-4" />
            Télécharger le QR Code
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    