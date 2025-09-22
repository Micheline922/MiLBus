import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h1 className="text-3xl font-headline font-bold tracking-tight">Paramètres</h1>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profil</CardTitle>
            <CardDescription>Gérez les informations de votre compte.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input id="name" defaultValue="Entrepreneuse" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="contact@milbus.com" />
            </div>
            <Button>Enregistrer</Button>
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
      </div>
    </div>
  );
}
