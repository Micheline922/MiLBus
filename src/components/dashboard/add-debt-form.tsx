
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

const formSchema = z.object({
  debtorName: z.string().min(1, 'Le nom du débiteur est requis'),
  amount: z.coerce.number().positive("Le montant doit être positif"),
  debtDate: z.string().min(1, 'La date est requise'),
  paymentDate: z.string().min(1, 'La date est requise'),
  status: z.enum(['En cours', 'Remboursée']).default('En cours'),
});

export type AddDebtFormValues = z.infer<typeof formSchema>;

type AddDebtFormProps = {
  onSubmit: (values: AddDebtFormValues) => void;
};

export default function AddDebtForm({ onSubmit }: AddDebtFormProps) {
  const form = useForm<AddDebtFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      debtorName: '',
      amount: 0,
      debtDate: new Date().toISOString().split('T')[0],
      paymentDate: new Date().toISOString().split('T')[0],
      status: 'En cours',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="debtorName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du débiteur</FormLabel>
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
              <FormLabel>Montant de la dette</FormLabel>
              <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="debtDate"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Date de la dette</FormLabel>
                <FormControl><Input type="date" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="paymentDate"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Date de paiement prévue</FormLabel>
                <FormControl><Input type="date" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
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
                        <SelectItem value="En cours">En cours</SelectItem>
                        <SelectItem value="Remboursée">Remboursée</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-2">
            <Button type="submit">Ajouter la dette</Button>
        </div>
      </form>
    </Form>
  );
}
