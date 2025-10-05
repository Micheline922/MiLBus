
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
import { Wig } from '@/lib/data';

const formSchema = z.object({
  purchasedBundles: z.string().min(1, 'Ce champ est requis'),
  brand: z.string().min(1, 'Ce champ est requis'),
  colors: z.string().min(1, 'Ce champ est requis'),
  wigDetails: z.string().min(1, 'Ce champ est requis'),
  bundlesPrice: z.coerce.number().positive("Le prix doit être positif"),
  sellingPrice: z.coerce.number().positive("Le prix doit être positif"),
  sold: z.coerce.number().min(0).default(0),
  remaining: z.coerce.number().min(0),
});

type AddWigFormValues = Omit<Wig, 'id'>;

type AddWigFormProps = {
  onSubmit: (values: AddWigFormValues) => void;
};

export default function AddWigForm({ onSubmit }: AddWigFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        purchasedBundles: '',
        brand: '',
        colors: '',
        wigDetails: '',
        bundlesPrice: 0,
        sellingPrice: 0,
        sold: 0,
        remaining: 1, // Assume we are adding one wig at a time
    },
  });

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    // Simple logic for remaining, can be refined
    const remaining = 1 - values.sold;
    onSubmit({ ...values, remaining });
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="wigDetails"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Détails Perruque</FormLabel>
                    <FormControl><Input {...field} placeholder="Ex: Perruque Lace Frontal 18 pouces" /></FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="purchasedBundles"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Mèches Achetées</FormLabel>
                    <FormControl><Input {...field} placeholder="Ex: 3 paquets de mèches lisses" /></FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Marque</FormLabel>
                    <FormControl><Input {...field} placeholder="Ex: Brazilian Hair" /></FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="colors"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Couleurs</FormLabel>
                    <FormControl><Input {...field} placeholder="Ex: Noir naturel (1B)" /></FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="bundlesPrice"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Prix des Mèches</FormLabel>
                    <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="sellingPrice"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Prix de Vente</FormLabel>
                    <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>
        <div className="flex justify-end pt-2">
          <Button type="submit">Ajouter la perruque</Button>
        </div>
      </form>
    </Form>
  );
}
