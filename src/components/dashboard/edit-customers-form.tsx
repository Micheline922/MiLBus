
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
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
import { Trash2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Customer } from '@/lib/data';

const formSchema = z.object({
  customers: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, 'Le nom est requis'),
      contact: z.string().min(1, 'Le contact est requis'),
      purchaseHistory: z.coerce.number(),
      lastPurchase: z.string().min(1, 'La date est requise'),
    })
  ),
});

type EditCustomersFormValues = z.infer<typeof formSchema>;

type EditCustomersFormProps = {
  initialValues: { customers: Customer[] };
  onSubmit: (values: EditCustomersFormValues) => void;
};

export default function EditCustomersForm({ initialValues, onSubmit }: EditCustomersFormProps) {
  const form = useForm<EditCustomersFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'customers'
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col h-[70vh]">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="relative grid grid-cols-2 gap-4 p-4 border rounded-lg">
                <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
                
                <FormField
                  control={form.control}
                  name={`customers.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`customers.${index}.contact`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`customers.${index}.purchaseHistory`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Achats</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`customers.${index}.lastPurchase`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dernier Achat</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => append({ id: `c${fields.length + 1}`, name: '', contact: '', purchaseHistory: 0, lastPurchase: new Date().toISOString().split('T')[0] })}>
              Ajouter un client
            </Button>
          </div>
        </ScrollArea>
        <div className="flex justify-end pt-4 border-t sticky bottom-0 bg-background pb-4">
          <Button type="submit">Enregistrer les modifications</Button>
        </div>
      </form>
    </Form>
  );
}
