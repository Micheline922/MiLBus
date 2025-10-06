
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LayoutGrid, ShoppingCart, Users, BarChart3, Settings, GalleryHorizontal, Wand2 } from 'lucide-react';

const WELCOME_TOUR_KEY = 'milbus-welcome-tour-shown';

const features = [
    {
        icon: <LayoutGrid className="h-6 w-6 text-primary" />,
        title: 'Tableau de Bord',
        description: "Votre centre de contrôle. Visualisez vos revenus, ventes et l'état de votre stock en un coup d'œil.",
    },
    {
        icon: <ShoppingCart className="h-6 w-6 text-primary" />,
        title: 'Gestion Complète',
        description: 'Gérez vos commandes, ventes, marchandises, clients et dettes depuis les pages dédiées.',
    },
    {
        icon: <BarChart3 className="h-6 w-6 text-primary" />,
        title: 'Rapports & Analyses IA',
        description: "Obtenez des recommandations et des analyses intelligentes sur vos ventes grâce à l'IA.",
    },
     {
        icon: <GalleryHorizontal className="h-6 w-6 text-primary" />,
        title: 'Vitrine Publique',
        description: 'Créez une belle page publique pour présenter vos produits aux clients.',
    },
    {
        icon: <Wand2 className="h-6 w-6 text-primary" />,
        title: 'Assistant IA',
        description: "Discutez avec votre conseiller IA pour obtenir des conseils sur la gestion et la croissance de votre entreprise.",
    },
    {
        icon: <Settings className="h-6 w-6 text-primary" />,
        title: 'Paramètres',
        description: "Personnalisez les informations de votre entreprise qui apparaîtront sur les factures et la vitrine.",
    },
];

export default function WelcomeTour() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const hasSeenTour = localStorage.getItem(WELCOME_TOUR_KEY);
      if (!hasSeenTour) {
        setIsOpen(true);
      }
    } catch (error) {
      console.warn('localStorage not available, welcome tour will not be shown.');
    }
  }, []);

  const handleClose = () => {
    try {
      localStorage.setItem(WELCOME_TOUR_KEY, 'true');
    } catch (error) {
       console.warn('Could not save welcome tour status to localStorage.');
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline">Bienvenue sur MiLBus !</DialogTitle>
          <DialogDescription>
            Voici un aperçu rapide des fonctionnalités pour vous aider à démarrer.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0">{feature.icon}</div>
                    <div>
                        <h4 className="font-semibold">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                </div>
            ))}
        </div>
        <DialogFooter>
          <Button onClick={handleClose}>Commencer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
