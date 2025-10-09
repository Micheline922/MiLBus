
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Pastry } from '@/lib/data';

const formSchema = z.object({
  pastries: z.array(
    z.object({
      id: z.string(),
      name: z.enum(['Beignets', 'Crêpes', 'Gâteaux', 'Gaufres']),
      quantity: z.coerce.number(),
      unitPrice: z.coerce.number(),
      totalPrice: z.coerce.number(),
      expenses: z.coerce.number(),
      sold: z.coerce.number(),
      remaining: z.coerce.number(),
    })
  ),
});

type EditPastriesFormValues = z.infer<typeof formSchema>;

type EditPastriesFormProps = {
  initialValues: { pastries: Pastry[] };
  onSubmit: (values: EditPastriesFormValues) => void;
};

export default function EditPastriesForm({ initialValues, onSubmit }: EditPastriesFormProps) {
  const form = useForm<EditPastriesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'pastries'
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
                  name={`pastries.${index}.name`}
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
                  name={`pastries.${index}.quantity`}
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
                  name={`pastries.${index}.unitPrice`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prix Unitaire</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name={`pastries.${index}.totalPrice`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prix Total</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name={`pastries.${index}.expenses`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dépenses</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`pastries.${index}.sold`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantités Vendues</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name={`pastries.${index}.remaining`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantités Restantes</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => append({ id: `pa${fields.length + 1}`, name: 'Beignets', quantity: 0, unitPrice: 0, totalPrice: 0, expenses: 0, sold: 0, remaining: 0 })}>
              Ajouter une pâtisserie
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
