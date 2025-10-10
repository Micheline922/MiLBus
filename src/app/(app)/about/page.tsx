
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles, Star, Heart } from "lucide-react";

const testimonials = [
  {
    name: "Marie-Claire",
    avatar: "MC",
    text: "J'ai acheté une perruque et la qualité est tout simplement incroyable. Le service client était exceptionnel, je recommande vivement MiLBus !",
  },
  {
    name: "Amina Diallo",
    avatar: "AD",
    text: "Les accessoires sont magnifiques et uniques. J'ai reçu tellement de compliments sur mes nouvelles boucles d'oreilles. Merci MiLBus !",
  },
  {
    name: "Sophie Dubois",
    avatar: "SD",
    text: "Une expérience d'achat parfaite du début à la fin. Les pâtisseries étaient délicieuses et les produits de beauté sont de première qualité.",
  },
];

const advertisingPhrases = [
    "MiLBus : Révélez votre beauté, affirmez votre style.",
    "L'élégance à portée de main, la qualité à chaque instant.",
    "Plus qu'une boutique, une promesse de confiance et d'authenticité.",
    "Votre destination pour la beauté, le style et la gourmandise.",
    "Chaque article est une pièce de luxe, chaque achat est une expérience."
];


export default function AboutPage() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-headline font-bold tracking-tight">À propos de Nous</h1>
          <p className="text-muted-foreground">
            L'histoire, les valeurs et la voix de votre marque.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="text-primary" />
            Témoignages de nos Clients
          </CardTitle>
          <CardDescription>
            Ce que nos clients disent de nous. Une source de fierté et d'inspiration.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-muted/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar>
                    <AvatarImage src={`https://picsum.photos/seed/${testimonial.name}/40/40`} />
                    <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                  </Avatar>
                  <p className="font-semibold">{testimonial.name}</p>
                </div>
                <div className="flex gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400"/>)}
                </div>
                <p className="text-sm text-muted-foreground italic">"{testimonial.text}"</p>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="text-primary" />
            Slogans & Phrases Publicitaires
          </CardTitle>
          <CardDescription>
            Utilisez ces phrases pour vos campagnes marketing, vos réseaux sociaux ou votre communication.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <ul className="space-y-3 list-disc list-inside">
                {advertisingPhrases.map((phrase, index) => (
                    <li key={index} className="text-muted-foreground">
                        <span className="font-medium text-foreground">{phrase}</span>
                    </li>
                ))}
            </ul>
        </CardContent>
      </Card>

    </div>
  );
}
