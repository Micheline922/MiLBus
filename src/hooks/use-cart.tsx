
'use client';

import { createOrderFromCart } from '@/app/actions';
import { ShowcaseItem } from '@/lib/data';
import { useSearchParams } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from './use-toast';

export type CartItem = ShowcaseItem & {
  quantity: number;
};

type CustomerInfo = {
    name: string;
    phone: string;
    email: string;
};

interface CartContextType {
  items: CartItem[];
  addItem: (item: ShowcaseItem) => void;
  removeItem: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  submitOrder: (customerInfo: CustomerInfo) => Promise<boolean>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'milbus-cart';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const username = searchParams.get('user');

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        setItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.warn('Could not load cart from localStorage.');
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.warn('Could not save cart to localStorage.');
    }
  }, [items]);

  const addItem = (item: ShowcaseItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
    toast({
        title: "Produit ajouté !",
        description: `${item.name} a été ajouté à votre panier.`,
    });
  };

  const removeItem = (itemId: string) => {
    setItems((prevItems) => prevItems.filter((i) => i.id !== itemId));
    toast({
        title: "Produit retiré",
        description: "L'article a été retiré de votre panier.",
    });
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((i) =>
        i.id === itemId ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
     toast({
        title: "Panier vidé",
        description: "Tous les articles ont été retirés.",
    });
  };

  const submitOrder = async (customerInfo: CustomerInfo) => {
    if (!username) {
        toast({ variant: 'destructive', title: 'Erreur', description: 'Identifiant de boutique non trouvé.'})
        return false;
    }
    if (items.length === 0) {
        toast({ variant: 'destructive', title: 'Erreur', description: 'Votre panier est vide.'})
        return false;
    }

    const result = await createOrderFromCart(username, items, customerInfo);

    if (result.success) {
        clearCart();
        return true;
    } else {
        toast({ variant: 'destructive', title: 'Erreur', description: result.error || "Impossible de créer la commande." });
        return false;
    }
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = {
    items,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
    total,
    submitOrder,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
