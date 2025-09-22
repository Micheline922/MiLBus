
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

function MilbusLogo(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M20 80C20 80 30 20 50 20C70 20 80 80 80 80" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M35 80C35 80 40 50 50 50C60 50 65 80 65 80" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M50 50V35" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
            <path d="M42 25L50 35L58 25" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}

export default function SignUpPage() {
  const loginImage = PlaceHolderImages.find((img) => img.id === 'login-art');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: 'Erreur',
        description: 'Les mots de passe ne correspondent pas.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // Since this is a simulation, we auto-login with the default credentials
      await login('Entrepreneuse', 'password');
      toast({
        title: 'Inscription réussie !',
        description: 'Bienvenue ! Vous êtes maintenant connecté(e).',
      });
      router.push('/dashboard');
    } catch (err) {
       toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la connexion automatique.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center p-6 sm:p-12">
        <Card className="mx-auto max-w-sm w-full">
          <CardHeader className="flex flex-col items-center text-center">
             <div className="bg-primary text-primary-foreground rounded-full p-2 mb-2">
                <MilbusLogo className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-headline">Créez votre compte</CardTitle>
            <CardDescription>
              Entrez vos informations pour commencer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input 
                    id="username" 
                    type="text" 
                    placeholder="Votre nom" 
                    required 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input 
                    id="password" 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
              </div>
               <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirmez le mot de passe</Label>
                <Input 
                    id="confirm-password" 
                    type="password" 
                    required 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                S'inscrire
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Déjà un compte?{' '}
              <Link href="/login" className="underline" prefetch={false}>
                Se connecter
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
       <div className="hidden bg-muted lg:block">
        {loginImage && (
          <Image
            src={loginImage.imageUrl}
            alt={loginImage.description}
            data-ai-hint={loginImage.imageHint}
            width="1000"
            height="1200"
            className="h-full w-full object-cover"
          />
        )}
      </div>
    </div>
  );
}
