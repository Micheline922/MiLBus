
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles, Star, Heart, Pencil, BookOpen } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { loadData, saveData } from "@/lib/storage";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import EditAboutForm from "@/components/dashboard/edit-about-form";

type Testimonial = {
  name: string;
  avatar: string;
  text: string;
};

type AboutData = {
  companyStory: string;
  testimonials: Testimonial[];
  advertisingPhrases: string[];
};

export default function AboutPage() {
  const { username } = useAuth();
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (username) {
      const data = loadData(username);
      setAboutData({
        companyStory: data.companyStory,
        testimonials: data.testimonials,
        advertisingPhrases: data.advertisingPhrases,
      });
    }
  }, [username]);

  const handleAboutSubmit = (values: AboutData) => {
    if (!username) return;
    setAboutData(values);
    saveData(username, 'companyStory', values.companyStory);
    saveData(username, 'testimonials', values.testimonials);
    saveData(username, 'advertisingPhrases', values.advertisingPhrases);
    setDialogOpen(false);
  };
  
  if (!aboutData) {
    return <div>Chargement...</div>;
  }

  const { companyStory, testimonials, advertisingPhrases } = aboutData;

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-headline font-bold tracking-tight">À propos de Nous</h1>
          <p className="text-muted-foreground">
            L'histoire, les valeurs et la voix de votre marque.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
              <Button>
                <Pencil className="mr-2 h-4 w-4" /> Modifier la page
              </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Modifier la page "À propos de nous"</DialogTitle>
            </DialogHeader>
            <EditAboutForm initialValues={aboutData} onSubmit={handleAboutSubmit} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="text-primary" />
            Notre Histoire
          </CardTitle>
          <CardDescription>
            La mission et la vision qui animent notre marque.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground whitespace-pre-line">{companyStory}</p>
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

    </div>
  );
}
