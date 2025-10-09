
'use client';

import { Button } from '@/components/ui/button';
import { Facebook, Mail } from 'lucide-react';

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
        <path d="M16.75 13.96c.25.13.43.2.5.28.08.08.16.18.23.28.07.1.13.2.18.33.05.13.08.26.08.4s-.05.28-.13.4a.93.93 0 01-.3.35c-.12.1-.26.18-.42.23-.16.05-.33.08-.5.08-.18 0-.38-.03-.58-.08-.2-.05-.38-.13-.55-.23-.17-.1-.34-.2-.5-.33-.17-.13-.34-.25-.5-.4s-.3-.28-.44-.43-.27-.3-.4-.44-.24-.28-.35-.42a6.1 6.1 0 01-.5-.84c-.05-.2-.08-.4-.08-.6s.03-.4.08-.6c.05-.2.13-.38.23-.55s.2-.34.33-.5.25-.3.4-.44.28-.27.43-.4.3-.24.44-.35.28-.2.42-.28c.14-.08.28-.13.43-.15.15-.02.3-.03.45-.03s.3.02.44.05c.15.03.28.08.4.15.13.07.24.15.34.25.1.1.18.2.24.3.06.1.1.2.13.3a.9.9 0 01.05.45c0 .1-.02.2-.05.3-.03.1-.08.2-.13.28s-.13.15-.2.22c-.08.07-.16.13-.23.18-.08.05-.15.08-.23.1-.07.02-.14.03-.2.03-.07 0-.14-.02-.2-.05-.07-.03-.13-.07-.18-.13-.05-.06-.1-.13-.15-.2s-.08-.14-.1-.23c-.03-.08-.05-.17-.05-.25s.02-.17.05-.25a.53.53 0 01.18-.23c.03-.02.05-.03.08-.05.03-.01.05-.02.08-.02s.05.01.08.02c.03.01.05.03.08.05.03.02.05.04.08.06.03.02.05.05.08.08.02.03.04.06.06.1.02.03.03.07.04.1.01.04.02.08.02.12s-.01.08-.02.12-.03.08-.04.12-.04.08-.06.12-.05.08-.08.12-.06.08-.1.12c-.04.04-.08.08-.13.12-.05.04-.1.08-.15.1-.05.03-.1.05-.15.06-.05.01-.1.02-.15.02s-.1-.01-.15-.02zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c5.5 0 10-4.5 10-10S17.5 2 12 2zm3.8 13.5c-.2.4-.5.7-.8.9-.3.2-.6.3-1 .3-.3 0-.7-.1-1-.2-.3-.1-.6-.3-.9-.5s-.5-.4-.7-.6c-.2-.2-.4-.5-.6-.7-.2-.3-.3-.6-.3-1s.1-.7.3-1s.4-.6.7-.9.6-.4.9-.6c.3-.2.6-.3.9-.3s.7.1 1 .2c.3.1.6.3.8.5s.5.4.6.7c.2.3.2.6.2.9s-.1.6-.2.9z"/>
    </svg>
  );
}

type SocialShareProps = {
  url: string;
  title: string;
  className?: string;
};

export default function SocialShare({ url, title, className }: SocialShareProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=J'ai pensé que cela pourrait t'intéresser : ${encodedUrl}`,
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
        <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="icon" aria-label="Partager sur WhatsApp">
                <WhatsAppIcon className="h-5 w-5" />
            </Button>
        </a>
        <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="icon" aria-label="Partager sur Facebook">
                <Facebook className="h-5 w-5" />
            </Button>
        </a>
        <a href={shareLinks.email} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="icon" aria-label="Partager par Email">
                <Mail className="h-5 w-5" />
            </Button>
        </a>
    </div>
  );
}
