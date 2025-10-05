
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Product } from '@/lib/data';

const formSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  purchasePrice: z.coerce.number().optional(),
  price: z.coerce.number().positive("Le prix doit être un nombre positif"),
  stock: z.coerce.number().int("Le stock doit être un nombre entier"),
  sold: z.coerce.number().int().default(0),
  remaining: z.coerce.number().int(),
  profit: z.coerce.number().optional(),
});

type AddProductFormValues = Omit<Product, 'id' | 'category'>;

type AddProductFormProps = {
  onSubmit: (values: AddProductFormValues) => void;
};

export default function AddProductForm({ onSubmit }: AddProductFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: '',
        purchasePrice: 0,
        price: 0,
        stock: 0,
        sold: 0,
        remaining: 0,
        profit: 0,
    },
  });

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    // Recalculate derived values before submitting
    const remaining = values.stock - values.sold;
    const profit = values.purchasePrice ? values.price - values.purchasePrice : undefined;
    onSubmit({ ...values, remaining, profit });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du produit</FormLabel>
              <FormControl><Input {...field} placeholder="Ex: Chaînette en or" /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="purchasePrice"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Prix d'Achat</FormLabel>
                <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Prix de Vente</FormLabel>
                <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantité en Stock</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-2">
            <Button type="submit">Ajouter le produit</Button>
        </div>
      </form>
    </Form>
  );
}
