
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
  onSubmit: (values: EditProductsFormValues) => void;
};

export default function EditProductsForm({ initialValues, onSubmit }: EditProductsFormProps) {
  const form = useForm<EditProductsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  const { fields: productFields, append: appendProduct, remove: removeProduct } = useFieldArray({
    control: form.control,
    name: 'products'
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col h-[70vh]">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Avoirs en Stock - Bijoux & Accessoires</h3>
             <div className='space-y-4'>
                {productFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-2 md:grid-cols-3 items-end gap-2 p-4 border rounded-lg relative">
                      <div className='col-span-2 md:col-span-3 flex justify-end'>
                        <Button type="button" variant="destructive" size="icon" className="h-7 w-7" onClick={() => removeProduct(index)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    <FormField
                        control={form.control}
                        name={`products.${index}.name`}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Produit</FormLabel>
                            <FormControl>
                            <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={`products.${index}.purchasePrice`}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Prix d'Achat</FormLabel>
                            <FormControl>
                            <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name={`products.${index}.stock`}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Quantité en Stock</FormLabel>
                            <FormControl>
                            <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name={`products.${index}.sold`}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Quantités Vendues</FormLabel>
                            <FormControl>
                            <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name={`products.${index}.remaining`}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Quantités Restantes</FormLabel>
                            <FormControl>
                            <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    </div>
                ))}
            </div>
             <Button type="button" variant="outline" size="sm" onClick={() => appendProduct({ id: `p${productFields.length + 1}`, name: 'Nouveau Produit', category: 'Bijoux & Accessoires', purchasePrice: 0, price: 0, stock: 0, sold: 0, remaining: 0, profit: 0 })}>
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
