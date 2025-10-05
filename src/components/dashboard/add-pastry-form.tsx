
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Pastry } from '@/lib/data';

const formSchema = z.object({
  name: z.enum(['Beignets', 'Crêpes', 'Gâteaux', 'Gaufres']),
  quantity: z.coerce.number().positive("La quantité doit être positive"),
  unitPrice: z.coerce.number().positive("Le prix doit être positif"),
  totalPrice: z.coerce.number(),
  expenses: z.coerce.number().min(0, "Les dépenses ne peuvent être négatives"),
  sold: z.coerce.number().min(0, "Ne peut être négatif").default(0),
  remaining: z.coerce.number().min(0, "Ne peut être négatif"),
});

type AddPastryFormValues = Omit<Pastry, 'id'>;

type AddPastryFormProps = {
  onSubmit: (values: AddPastryFormValues) => void;
};

export default function AddPastryForm({ onSubmit }: AddPastryFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: 'Beignets',
        quantity: 10,
        unitPrice: 1,
        totalPrice: 10,
        expenses: 0,
        sold: 0,
        remaining: 10,
    },
  });
  
  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    // Recalculate derived values before submitting
    const totalPrice = values.quantity * values.unitPrice;
    const remaining = values.quantity - values.sold;
    onSubmit({ ...values, totalPrice, remaining });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Produit</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un produit" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <SelectItem value="Beignets">Beignets</SelectItem>
                    <SelectItem value="Crêpes">Crêpes</SelectItem>
                    <SelectItem value="Gâteaux">Gâteaux</SelectItem>
                    <SelectItem value="Gaufres">Gaufres</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
            )}
        />
         <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Quantité Initiale</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="unitPrice"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Prix Unitaire</FormLabel>
                <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="expenses"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Dépenses</FormLabel>
                <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        <div className="flex justify-end pt-2">
          <Button type="submit">Ajouter la pâtisserie</Button>
        </div>
      </form>
    </Form>
  );
}
