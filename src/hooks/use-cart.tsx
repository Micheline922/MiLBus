
'use client';

import { ShowcaseItem } from '@/lib/data';
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { useToast } from './use-toast';
import { useParams } from 'next/navigation';

export type CartItem = ShowcaseItem & {
  quantity: number;
};

interface CartContextType {
  items: CartItem[];
  addItem: (item: ShowcaseItem) => void;
  removeItem: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  currency: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'milbus-cart';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const [currency, setCurrency] = useState('FC');
  
  const params = useParams();
  const username = params.user;

  useEffect(() => {
    if (username) {
        const userCredentials = localStorage.getItem(`${username}-user-credentials`) || localStorage.getItem('milbus-user-credentials');
        if (userCredentials) {
            const parsedUser = JSON.parse(userCredentials);
            setCurrency(parsedUser.currency || 'FC');
        }
    }
  }, [username]);

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

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = {
    items,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
    total,
    currency,
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
