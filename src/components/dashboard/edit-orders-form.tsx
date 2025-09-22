
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
import { Order } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const formSchema = z.object({
  orders: z.array(
    z.object({
      id: z.string(),
      customerName: z.string().min(1, 'Le nom est requis'),
      customerAddress: z.string().min(1, 'L\'adresse est requise'),
      products: z.string().transform((val) => val.split(',').map(s => s.trim()).filter(Boolean)), // Handle comma-separated strings
      totalAmount: z.coerce.number(),
      paidAmount: z.coerce.number(),
      remainingAmount: z.coerce.number(),
      status: z.enum(['En attente', 'Payée', 'Annulée']),
      date: z.string()
    })
  ),
});

// We need to transform the initialValues to match the form schema (products as a string)
const transformInitialValues = (initialValues: { orders: Order[] }) => ({
  orders: initialValues.orders.map(order => ({
    ...order,
    products: order.products.join(', '),
  })),
});

// And transform back on submit
const transformOnSubmit = (values: z.infer<typeof formSchema>, onSubmit: (val: { orders: Order[] }) => void) => {
    const transformedValues = {
        orders: values.orders.map(order => ({
            ...order,
            // This is where we would transform the string back to an array,
            // but since the schema does that, we can just use the value.
            products: order.products as string[]
        }))
    };
    onSubmit(transformedValues);
};


type EditOrdersFormValues = z.infer<typeof formSchema>;

type EditOrdersFormProps = {
  initialValues: { orders: Order[] };
  onSubmit: (values: { orders: Order[] }) => void;
};

export default function EditOrdersForm({ initialValues, onSubmit }: EditOrdersFormProps) {
  const form = useForm<EditOrdersFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: transformInitialValues(initialValues),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'orders'
  });
  
  const handleFormSubmit = (values: EditOrdersFormValues) => {
    transformOnSubmit(values, onSubmit);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 flex flex-col h-[70vh]">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="relative grid grid-cols-2 gap-4 p-4 border rounded-lg">
                <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
                
                <FormField
                  control={form.control}
                  name={`orders.${index}.customerName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`orders.${index}.customerAddress`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`orders.${index}.products`}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Produits (séparés par une virgule)</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`orders.${index}.totalAmount`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Montant Total</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`orders.${index}.paidAmount`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Montant Payé</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`orders.${index}.remainingAmount`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reste à Payer</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name={`orders.${index}.status`}
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
                              <SelectItem value="Annulée">Annulée</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => append({ id: `o${fields.length + 1}`, customerName: '', customerAddress: '', products: '', totalAmount: 0, paidAmount: 0, remainingAmount: 0, status: 'En attente', date: new Date().toISOString().split('T')[0] })}>
              Ajouter une commande
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
