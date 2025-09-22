
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

const formSchema = z.object({
  sales: z.array(
    z.object({
      id: z.string(),
      productName: z.string().min(1, 'Le nom du produit est requis'),
      customerName: z.string().min(1, 'Le nom du client est requis'),
      date: z.string().min(1, 'La date est requise'),
      amount: z.coerce.number(),
      quantity: z.coerce.number(),
    })
  ),
});

type EditSalesFormValues = z.infer<typeof formSchema>;

type EditSalesFormProps = {
  initialValues: EditSalesFormValues;
  onSubmit: (values: EditSalesFormValues) => void;
};

export default function EditSalesForm({ initialValues, onSubmit }: EditSalesFormProps) {
  const form = useForm<EditSalesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'sales'
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col h-[70vh]">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Ventes Récentes</h3>
             <div className='space-y-4'>
                {fields.map((field, index) => (
                    <div key={field.id} className="relative grid grid-cols-2 gap-4 p-4 border rounded-lg">
                        <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        <FormField
                            control={form.control}
                            name={`sales.${index}.customerName`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nom du Client</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`sales.${index}.productName`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Produit</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`sales.${index}.quantity`}
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
                            name={`sales.${index}.amount`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Montant</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`sales.${index}.date`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date</FormLabel>
                                <FormControl><Input type="date" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                ))}
            </div>
             <Button type="button" variant="outline" size="sm" onClick={() => append({ id: `s${fields.length + 1}`, productName: '', customerName: '', date: new Date().toISOString().split('T')[0], amount: 0, quantity: 1 })}>
              Ajouter une vente
            </Button>
          </div>
        </ScrollArea>
        <div className="flex justify-end pt-4 border-t">
            <Button type="submit">Enregistrer les modifications</Button>
        </div>
      </form>
    </Form>
  );
}
