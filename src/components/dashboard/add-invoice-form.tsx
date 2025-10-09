
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
import { Invoice } from '@/lib/data';

const formSchema = z.object({
  customerName: z.string().min(1, 'Le nom du client est requis'),
  amount: z.coerce.number().positive("Le montant doit être positif"),
  status: z.enum(['En attente', 'Payée']).default('En attente'),
});

export type AddInvoiceFormValues = z.infer<typeof formSchema>;

type AddInvoiceFormProps = {
  onSubmit: (values: AddInvoiceFormValues) => void;
};

export default function AddInvoiceForm({ onSubmit }: AddInvoiceFormProps) {
  const form = useForm<AddInvoiceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: '',
      amount: 0,
      status: 'En attente',
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
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Montant de la facture</FormLabel>
              <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
                <FormLabel>Statut</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un statut" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="En attente">En attente</SelectItem>
                        <SelectItem value="Payée">Payée</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-2">
            <Button type="submit">Créer la facture</Button>
        </div>
      </form>
    </Form>
  );
}
