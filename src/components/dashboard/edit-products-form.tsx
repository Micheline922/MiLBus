
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
  products: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, 'Le nom est requis'),
      purchasePrice: z.coerce.number().optional(),
      stock: z.coerce.number(),
    })
  ),
});

type EditProductsFormValues = z.infer<typeof formSchema>;

type EditProductsFormProps = {
  initialValues: EditProductsFormValues;
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
                    <div key={field.id} className="grid grid-cols-3 md:grid-cols-4 items-end gap-2 p-4 border rounded-lg">
                    <FormField
                        control={form.control}
                        name={`products.${index}.name`}
                        render={({ field }) => (
                        <FormItem className="col-span-3 md:col-span-1">
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
                            <FormLabel>Quantité</FormLabel>
                            <FormControl>
                            <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeProduct(index)}>
                        <Trash2 />
                    </Button>
                    </div>
                ))}
            </div>
             <Button type="button" variant="outline" size="sm" onClick={() => appendProduct({ id: `p${productFields.length + 1}`, name: 'Nouveau Produit', purchasePrice: 0, stock: 0 })}>
              Ajouter un produit
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
