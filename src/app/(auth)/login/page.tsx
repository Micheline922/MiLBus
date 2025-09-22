import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlaceHolderImages } from '@/lib/placeholder-images';

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


function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" {...props}>
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.804 12.04C34.553 7.965 29.803 6 24 6C12.955 6 4 14.955 4 26s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      ></path>
      <path
        fill="#FF3D00"
        d="M6.306 14.691c-2.213 4.013-2.213 8.601 0 12.614L12.875 32.9C9.723 29.224 9.723 24.776 12.875 21.1L6.306 14.691z"
      ></path>
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A8.003 8.003 0 0 1 24 36c-4.418 0-8.28-2.849-9.654-6.666l-6.57 5.122A20.007 20.007 0 0 0 24 44z"
      ></path>
      <path
        fill="#1976D2"
        d="M43.611 20.083L43.595 20L42 20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 36.41 44 31.433 44 26c0-1.341-.138-2.65-.389-3.917z"
      ></path>
    </svg>
  );
}

export default function LoginPage() {
  const loginImage = PlaceHolderImages.find((img) => img.id === 'login-art');

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center p-6 sm:p-12">
        <Card className="mx-auto max-w-sm w-full">
          <CardHeader className="flex flex-col items-center text-center">
            <div className="bg-primary text-primary-foreground rounded-full p-2 mb-2">
                <MilbusLogo className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-headline">MiLBus</CardTitle>
            <CardDescription>
              Connectez-vous à votre espace pour gérer votre business.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@exemple.com" required />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Link href="#" className="ml-auto inline-block text-sm underline" prefetch={false}>
                    Oublié?
                  </Link>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" asChild>
                <Link href="/dashboard">Connexion</Link>
              </Button>
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Ou continuer avec</span>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <GoogleIcon className="mr-2 h-5 w-5" />
                Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Pas de compte?{' '}
              <Link href="#" className="underline" prefetch={false}>
                S'inscrire
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
