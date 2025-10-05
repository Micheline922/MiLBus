
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState, useRef } from "react";
import { User } from "lucide-react";

export default function SettingsPage() {
  const { toast } = useToast();
  const { user, updateUser } = useAuth();
  
  const [businessName, setBusinessName] = useState('');
  const [businessContact, setBusinessContact] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
        setBusinessName(user.businessName);
        setBusinessContact(user.businessContact);
        setBusinessAddress(user.businessAddress);
        setProfilePicture(user.profilePicture);
    }
  }, [user]);

  const handleSave = () => {
    updateUser({
        businessName,
        businessContact,
        businessAddress,
        profilePicture,
    });
    toast({
      title: "Succès !",
      description: "Vos informations ont été mises à jour.",
    });
  };

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return <div>Chargement...</div>
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h1 className="text-3xl font-headline font-bold tracking-tight">Paramètres</h1>
      <div className="grid gap-6">

        <Card>
          <CardHeader>
            <CardTitle>Photo de Profil</CardTitle>
            <CardDescription>Personnalisez votre avatar dans l'application.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profilePicture || undefined} />
                <AvatarFallback>
                  <User className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                Changer la photo
              </Button>
              <Input 
                type="file"
                ref={fileInputRef}
                onChange={handlePictureChange}
                className="hidden"
                accept="image/png, image/jpeg"
              />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profil de l'Entreprise</CardTitle>
            <CardDescription>Ces informations apparaîtront sur vos factures.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Nom de l'entreprise</Label>
              <Input id="businessName" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="businessContact">Email de contact</Label>
              <Input id="businessContact" type="email" value={businessContact} onChange={(e) => setBusinessContact(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessAddress">Adresse de l'entreprise</Label>
              <Textarea id="businessAddress" value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} placeholder="123 Rue de l'Exemple, Ville, Pays"/>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Choisissez comment vous recevez les notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                <span>Notifications par Email</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Recevez des notifications par email pour les nouvelles ventes et les stocks faibles.
                </span>
              </Label>
              <Switch id="email-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
                <span>Notifications Push</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Recevez des notifications push sur vos appareils.
                </span>
              </Label>
              <Switch id="push-notifications" />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-start">
            <Button onClick={handleSave}>Enregistrer les modifications</Button>
        </div>

      </div>
    </div>
  );
}
