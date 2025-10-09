
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

const formSchema = z.object({
  customerName: z.string().min(1, 'Le nom du client est requis'),
  productName: z.string().min(1, 'Le nom du produit est requis'),
  quantity: z.coerce.number().int().positive("La quantité doit être positive"),
  amount: z.coerce.number().positive("Le montant doit être positif"),
});

export type AddSaleFormValues = z.infer<typeof formSchema>;

type AddSaleFormProps = {
  onSubmit: (values: AddSaleFormValues) => void;
};

export default function AddSaleForm({ onSubmit }: AddSaleFormProps) {
  const form = useForm<AddSaleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: '',
      productName: '',
      quantity: 1,
      amount: 0,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="customerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du client</FormLabel>
              <FormControl><Input {...field} placeholder="Ex: Jean Dupont" /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="productName"
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
            name="quantity"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Quantité</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Montant total</FormLabel>
                <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <div className="flex justify-end pt-2">
            <Button type="submit">Enregistrer la vente</Button>
        </div>
      </form>
    </Form>
  );
}
