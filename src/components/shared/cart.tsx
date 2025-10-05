
'use client';

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useState, useTransition } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function Cart() {
    const { items, removeItem, updateItemQuantity, total, clearCart, submitOrder } = useCart();
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');

    const handleSendOrder = () => {
        if (!customerName.trim() || !customerPhone.trim()) {
            toast({
                variant: 'destructive',
                title: "Informations manquantes",
                description: "Veuillez entrer votre nom et votre numéro de téléphone.",
            });
            return;
        }

        startTransition(async () => {
            const success = await submitOrder({ name: customerName, phone: customerPhone });
            if (success) {
                toast({
                    title: "Commande envoyée !",
                    description: "Merci ! Nous vous contacterons bientôt pour finaliser votre commande.",
                });
                setCustomerName('');
                setCustomerPhone('');
            } else {
                toast({
                    variant: 'destructive',
                    title: "Erreur",
                    description: "Impossible d'envoyer la commande. Veuillez réessayer.",
                });
            }
        });
    };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {items.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle>Panier ({items.length})</SheetTitle>
           <Separator />
        </SheetHeader>
        {items.length > 0 ? (
          <>
            <ScrollArea className="flex-1 pr-6">
              <div className="flex flex-col gap-5">
                {items.map((item) => (
                  <div key={item.id} className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            fill
                            className="absolute object-cover"
                          />
                        </div>
                        <div className="flex flex-col gap-1 self-start">
                           <span className="line-clamp-1 text-sm font-medium">
                            {item.name}
                          </span>
                           <span className="line-clamp-1 text-xs text-muted-foreground">
                            {item.price.toFixed(2)} FC
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => removeItem(item.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                        <div className="flex items-center">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity === 1}
                            >
                                -
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                            >
                                +
                            </Button>
                        </div>
                      </div>
                    </div>
                     <Separator />
                  </div>
                ))}
              </div>
            </ScrollArea>
            <SheetFooter className="flex-col gap-4 pr-6">
                 <div className="flex w-full flex-col gap-2 text-sm">
                    <div className="flex justify-between font-semibold">
                        <span>Total estimé</span>
                        <span>{total.toFixed(2)} FC</span>
                    </div>
                </div>
                 <Separator />
                <div className="space-y-3">
                    <h4 className="text-sm font-medium">Vos informations</h4>
                    <div className="space-y-2">
                        <Label htmlFor="customer-name">Nom complet</Label>
                        <Input id="customer-name" placeholder="Ex: Marie Claire" value={customerName} onChange={(e) => setCustomerName(e.target.value)} disabled={isPending} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="customer-phone">Numéro de téléphone</Label>
                        <Input id="customer-phone" placeholder="Ex: +243 XXX XX XX XX" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} disabled={isPending}/>
                    </div>
                </div>

                <Button className="w-full" onClick={handleSendOrder} disabled={isPending || items.length === 0}>
                    {isPending ? "Envoi en cours..." : "Envoyer la commande et être contacté(e)"}
                </Button>
                <Button variant="outline" className="w-full" onClick={() => clearCart()} disabled={isPending}>
                    Vider le panier
                </Button>
            </SheetFooter>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-2">
             <ShoppingCart
              className="h-12 w-12 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="text-lg font-medium text-muted-foreground">Votre panier est vide</span>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
