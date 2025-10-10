
'use client';

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import { Mail, Phone, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { loadData } from "@/lib/storage";


export default function Cart() {
    const { items, removeItem, updateItemQuantity, total, clearCart } = useCart();
    
    const [vendorInfo, setVendorInfo] = useState({ email: '', phone: '' });
    const [currency, setCurrency] = useState('FC');
    
    const params = useParams();
    const username = params.user as string;

    const currencySymbol = useMemo(() => (currency === 'USD' ? '$' : 'FC'), [currency]);

    useEffect(() => {
        const usernameToLoad = username;
        if (!usernameToLoad) return;
        try {
            const data = loadData(usernameToLoad);
            if (data.user) {
                setVendorInfo({
                    email: data.user.businessContact || '',
                    phone: data.user.businessPhone || ''
                });
                setCurrency(data.user.currency || 'FC');
            }
        } catch (e) {
            console.error("Failed to load user data for cart");
        }
    }, [username]);


  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {items.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {items.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle>Panier ({items.reduce((acc, item) => acc + item.quantity, 0)})</SheetTitle>
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
                            {item.price.toFixed(2)} {currencySymbol}
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
                        <span>{total.toFixed(2)} {currencySymbol}</span>
                    </div>
                </div>
                 <Separator />
                <div className="space-y-4 text-center">
                    <h4 className="font-semibold">Pour commander, contactez-nous !</h4>
                    <p className="text-sm text-muted-foreground">
                        Envoyez-nous la liste des articles de votre panier par e-mail ou par téléphone.
                    </p>
                    {vendorInfo.email && (
                        <a href={`mailto:${vendorInfo.email}`} className="block">
                            <Button className="w-full">
                                <Mail className="mr-2 h-4 w-4" /> {vendorInfo.email}
                            </Button>
                        </a>
                    )}
                     {vendorInfo.phone && (
                        <a href={`tel:${vendorInfo.phone}`} className="block">
                            <Button variant="outline" className="w-full">
                                <Phone className="mr-2 h-4 w-4" /> {vendorInfo.phone}
                            </Button>
                        </a>
                    )}
                </div>

                <Button variant="destructive" className="w-full" onClick={() => clearCart()}>
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

    
