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
import { Separator } from '../ui/separator';
import { Trash2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

const formSchema = z.object({
  totalRevenue: z.object({
    value: z.string(),
    change: z.string(),
  }),
  sales: z.object({
    value: z.string(),
    change: z.string(),
  }),
  dailySales: z.object({
    value: z.string(),
    change: z.string(),
  }),
  stock: z.object({
    value: z.string(),
    change: z.string(),
  }),
  chartData: z.array(
    z.object({
      name: z.string(),
      total: z.coerce.number(),
    })
  ),
  products: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      purchasePrice: z.coerce.number().optional(),
      stock: z.coerce.number(),
    })
  )
});

type EditDashboardFormValues = z.infer<typeof formSchema>;

type EditDashboardFormProps = {
  initialValues: EditDashboardFormValues;
  onSubmit: (values: EditDashboardFormValues) => void;
};

export default function EditDashboardForm({ initialValues, onSubmit }: EditDashboardFormProps) {
  const form = useForm<EditDashboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  const { fields: chartFields, append: appendChart, remove: removeChart } = useFieldArray({
    control: form.control,
    name: 'chartData',
  });

  const { fields: productFields, append: appendProduct, remove: removeProduct } = useFieldArray({
    control: form.control,
    name: 'products'
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ScrollArea className="h-96 pr-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Statistiques principales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="totalRevenue.value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Revenus totaux (Valeur)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="totalRevenue.change"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Revenus totaux (Changement)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="sales.value"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Ventes (Valeur)</FormLabel>
                        <FormControl>
                        <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="sales.change"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Ventes (Changement)</FormLabel>
                        <FormControl>
                        <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="dailySales.value"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Ventes du jour (Valeur)</FormLabel>
                        <FormControl>
                        <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="dailySales.change"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Ventes du jour (Changement)</FormLabel>
                        <FormControl>
                        <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="stock.value"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Articles en stock (Valeur)</FormLabel>
                        <FormControl>
                        <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="stock.change"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Articles en stock (Changement)</FormLabel>
                        <FormControl>
                        <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>

            <Separator className="my-6" />

            <h3 className="text-lg font-medium">Données du Graphique</h3>
            <div className='space-y-4'>
                {chartFields.map((field, index) => (
                    <div key={field.id} className="flex items-end gap-2">
                    <FormField
                        control={form.control}
                        name={`chartData.${index}.name`}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mois</FormLabel>
                            <FormControl>
                            <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={`chartData.${index}.total`}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Total</FormLabel>
                            <FormControl>
                            <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeChart(index)}>
                        <Trash2 />
                    </Button>
                    </div>
                ))}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => appendChart({ name: 'Nouveau', total: 0 })}>
              Ajouter un mois
            </Button>
            
            <Separator className="my-6" />

            <h3 className="text-lg font-medium">Avoirs en Stock</h3>
             <div className='space-y-4'>
                {productFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-3 md:grid-cols-4 items-end gap-2">
                    <FormField
                        control={form.control}
                        name={`products.${index}.name`}
                        render={({ field }) => (
                        <FormItem className="col-span-2 md:col-span-1">
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
