
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
import { Product, Wig, Pastry, PastryExpense } from '@/lib/data';

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
  wigs: z.array(
    z.object({
      id: z.string(),
      purchasedBundles: z.string().min(1, 'Ce champ est requis'),
      brand: z.string().min(1, 'Ce champ est requis'),
      colors: z.string().min(1, 'Ce champ est requis'),
      wigDetails: z.string().min(1, 'Ce champ est requis'),
      bundlesPrice: z.coerce.number(),
      sellingPrice: z.coerce.number(),
      sold: z.coerce.number(),
      remaining: z.coerce.number(),
    })
  ),
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
  pastryExpenses: z.array(
    z.object({
      id: z.string(),
      item: z.string().min(1, "Le nom de l'article est requis"),
      cost: z.coerce.number(),
      category: z.enum(['Beignets', 'Crêpes', 'Gâteaux', 'Gaufres', 'Général']),
      purchaseDate: z.string().min(1, 'La date est requise'),
    })
  ),
});

type EditDashboardFormValues = z.infer<typeof formSchema>;

type EditDashboardFormProps = {
  initialValues: { products: Product[]; wigs: Wig[]; pastries: Pastry[], pastryExpenses: PastryExpense[] };
  onSubmit: (values: EditDashboardFormValues) => void;
};

export default function EditDashboardForm({ initialValues, onSubmit }: EditDashboardFormProps) {
  const form = useForm<EditDashboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  const { fields: productFields, append: appendProduct, remove: removeProduct } = useFieldArray({
    control: form.control,
    name: 'products'
  });

  const { fields: wigFields, append: appendWig, remove: removeWig } = useFieldArray({
    control: form.control,
    name: 'wigs'
  });
  
  const { fields: pastryFields, append: appendPastry, remove: removePastry } = useFieldArray({
    control: form.control,
    name: 'pastries'
  });
  
  const { fields: pastryExpenseFields, append: appendPastryExpense, remove: removePastryExpense } = useFieldArray({
    control: form.control,
    name: 'pastryExpenses'
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col h-full">
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

          <div className="space-y-4 mt-6">
            <h3 className="text-lg font-medium">Avoirs en Stock - Perruques</h3>
             <div className='space-y-4'>
                {wigFields.map((field, index) => (
                    <div key={field.id} className="relative grid grid-cols-2 gap-4 p-4 border rounded-lg">
                        <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeWig(index)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        <FormField
                            control={form.control}
                            name={`wigs.${index}.purchasedBundles`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mèches Achetées</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`wigs.${index}.brand`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Marque</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`wigs.${index}.colors`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Couleurs</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`wigs.${index}.wigDetails`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Détails Perruque</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`wigs.${index}.bundlesPrice`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Prix des Mèches</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`wigs.${index}.sellingPrice`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Prix de Vente</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`wigs.${index}.sold`}
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
                            name={`wigs.${index}.remaining`}
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
            </div>
             <Button type="button" variant="outline" size="sm" onClick={() => appendWig({ id: `w${wigFields.length + 1}`, purchasedBundles: '', brand: '', colors: '', wigDetails: '', bundlesPrice: 0, sellingPrice: 0, sold: 0, remaining: 0 })}>
              Ajouter une perruque
            </Button>
          </div>

          <div className="space-y-4 mt-6">
            <h3 className="text-lg font-medium">Gestion des Pâtisseries</h3>
             <div className='space-y-4'>
                {pastryFields.map((field, index) => (
                    <div key={field.id} className="relative grid grid-cols-2 gap-4 p-4 border rounded-lg">
                        <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removePastry(index)}>
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
            </div>
             <Button type="button" variant="outline" size="sm" onClick={() => appendPastry({ id: `pa${pastryFields.length + 1}`, name: 'Beignets', quantity: 0, unitPrice: 0, totalPrice: 0, expenses: 0, sold: 0, remaining: 0 })}>
              Ajouter une pâtisserie
            </Button>
          </div>

           <div className="space-y-4 mt-6">
            <h3 className="text-lg font-medium">Détail des Dépenses - Pâtisseries</h3>
             <div className='space-y-4'>
                {pastryExpenseFields.map((field, index) => (
                    <div key={field.id} className="relative grid grid-cols-2 gap-4 p-4 border rounded-lg">
                        <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removePastryExpense(index)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        <FormField
                            control={form.control}
                            name={`pastryExpenses.${index}.item`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Article de Dépense</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`pastryExpenses.${index}.cost`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Coût</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`pastryExpenses.${index}.category`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Catégorie</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionnez une catégorie" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Général">Général</SelectItem>
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
                            name={`pastryExpenses.${index}.purchaseDate`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date d'achat</FormLabel>
                                <FormControl><Input type="date" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                ))}
            </div>
             <Button type="button" variant="outline" size="sm" onClick={() => appendPastryExpense({ id: `pe${pastryExpenseFields.length + 1}`, item: '', cost: 0, category: 'Général', purchaseDate: new Date().toISOString().split('T')[0] })}>
              Ajouter une dépense
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
