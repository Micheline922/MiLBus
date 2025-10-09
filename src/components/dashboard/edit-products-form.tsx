
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
import { Product } from '@/lib/data';

const formSchema = z.object({
  products: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, 'Le nom est requis'),
      category: z.literal('Bijoux & Accessoires'),
      purchasePrice: z.coerce.number().optional(),
      price: z.coerce.number(),
      stock: z.coerce.number(),
      sold: z.coerce.number(),
      remaining: z.coerce.number(),
      profit: z.coerce.number().optional(),
    })
  ),
});

type EditProductsFormValues = z.infer<typeof formSchema>;

type EditProductsFormProps = {
  initialValues: { products: Product[] };
  onSubmit: (values: { products: Product[] }) => void;
};

export default function EditProductsForm({ initialValues, onSubmit }: EditProductsFormProps) {
  const form = useForm<EditProductsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        products: initialValues.products.map(p => ({ ...p, purchasePrice: p.purchasePrice ?? 0, profit: p.profit ?? 0 }))
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'products'
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col h-[70vh]">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="relative grid grid-cols-2 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
                <FormField control={form.control} name={`products.${index}.name`} render={({ field }) => ( <FormItem className="col-span-full"><FormLabel>Nom</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name={`products.${index}.purchasePrice`} render={({ field }) => ( <FormItem><FormLabel>Prix Achat</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name={`products.${index}.price`} render={({ field }) => ( <FormItem><FormLabel>Prix Vente</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name={`products.${index}.stock`} render={({ field }) => ( <FormItem><FormLabel>Stock</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name={`products.${index}.sold`} render={({ field }) => ( <FormItem><FormLabel>Vendus</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name={`products.${index}.remaining`} render={({ field }) => ( <FormItem><FormLabel>Restants</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name={`products.${index}.profit`} render={({ field }) => ( <FormItem><FormLabel>Bénéfice</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => append({ id: `p${fields.length + 1}`, name: 'Nouveau Produit', category: 'Bijoux & Accessoires', price: 0, stock: 0, sold: 0, remaining: 0, purchasePrice: 0, profit: 0 })}>
              Ajouter un produit
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
