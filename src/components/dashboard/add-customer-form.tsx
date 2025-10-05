
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
import { Customer } from '@/lib/data';

const formSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  contact: z.string().min(1, 'Le contact est requis'),
  purchaseHistory: z.coerce.number().default(0),
  lastPurchase: z.string().default(new Date().toISOString().split('T')[0]),
});

type AddCustomerFormValues = Omit<Customer, 'id'>;

type AddCustomerFormProps = {
  onSubmit: (values: AddCustomerFormValues) => void;
};

export default function AddCustomerForm({ onSubmit }: AddCustomerFormProps) {
  const form = useForm<AddCustomerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: '',
        contact: '',
        purchaseHistory: 0,
        lastPurchase: new Date().toISOString().split('T')[0],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du client</FormLabel>
              <FormControl><Input {...field} placeholder="Ex: Marie Claire" /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact (Email ou téléphone)</FormLabel>
              <FormControl><Input {...field} placeholder="Ex: marie@example.com ou +243..." /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-2">
            <Button type="submit">Ajouter le client</Button>
        </div>
      </form>
    </Form>
  );
}
