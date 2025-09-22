
'use client';

import { useTheme } from 'next-themes';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useEffect, useState } from 'react';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const isDarkMode = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  return (
    <div className="flex items-center justify-between">
        <Label htmlFor="theme-switch" className="flex flex-col space-y-1">
            <span>Mode Sombre</span>
            <span className="font-normal leading-snug text-muted-foreground">
                Activez pour une interface plus sombre et plus confortable pour les yeux.
            </span>
        </Label>
        <Switch 
            id="theme-switch" 
            checked={isDarkMode}
            onCheckedChange={toggleTheme}
        />
    </div>
  );
}
