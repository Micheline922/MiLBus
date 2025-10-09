
'use client';

import { useFormContext, useFieldArray, FormProvider } from 'react-hook-form';
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
import { Product, Wig, Pastry } from '@/lib/data';
import { Separator } from '../ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const productSchema = z.object({
    id: z.string(),
    name: z.string().min(1, 'Le nom est requis'),
    purchasePrice: z.coerce.number().optional().default(0),
    price: z.coerce.number().default(0),
    stock: z.coerce.number().default(0),
    sold: z.coerce.number().default(0),
    remaining: z.coerce.number().default(0),
    profit: z.coerce.number().optional().default(0),
    category: z.string(),
});

const wigSchema = z.object({
    id: z.string(),
    purchasedBundles: z.string().min(1, 'Ce champ est requis'),
    brand: z.string().min(1, 'Ce champ est requis'),
    colors: z.string().min(1, 'Ce champ est requis'),
    wigDetails: z.string().min(1, 'Ce champ est requis'),
    bundlesPrice: z.coerce.number().default(0),
    sellingPrice: z.coerce.number().default(0),
    sold: z.coerce.number().default(0),
    remaining: z.coerce.number().default(0),
});

const pastrySchema = z.object({
    id: z.string(),
    name: z.enum(['Beignets', 'Crêpes', 'Gâteaux', 'Gaufres']),
    quantity: z.coerce.number().default(0),
    unitPrice: z.coerce.number().default(0),
    totalPrice: z.coerce.number().default(0),
    expenses: z.coerce.number().default(0),
    sold: z.coerce.number().default(0),
    remaining: z.coerce.number().default(0),
});


const formSchema = z.object({
  products: z.array(productSchema),
  wigs: z.array(wigSchema),
  pastries: z.array(pastrySchema),
  productTitle: z.string().optional(),
  wigTitle: z.string().optional(),
  pastryTitle: z.string().optional(),
});

type EditInventoryFormValues = z.infer<typeof formSchema>;

type EditInventoryFormProps = {
  initialValues: { products: Product[], wigs: Wig[], pastries: Pastry[] };
  onSubmit: (values: EditInventoryFormValues) => void;
};

export default function EditInventoryForm({ onSubmit }: { onSubmit: (values: EditInventoryFormValues) => void; initialValues: any }) {
  const form = useFormContext();

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

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
              control={form.control}
              name="productTitle"
              render={({ field }) => (
              <FormItem>
                  <FormLabel className="text-lg font-semibold">Titre de la section Produits</FormLabel>
                  <FormControl><Input {...field} defaultValue="Bijoux & Accessoires" /></FormControl>
                  <FormMessage />
              </FormItem>
              )}
          />
          {productFields.map((field, index) => (
            <div key={field.id} className="relative grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border rounded-lg">
              <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeProduct(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
              <FormField control={form.control} name={`products.${index}.name`} render={({ field }) => ( <FormItem className="col-span-2 md:col-span-4"><FormLabel>Nom</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name={`products.${index}.purchasePrice`} render={({ field }) => ( <FormItem><FormLabel>Prix Achat</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name={`products.${index}.price`} render={({ field }) => ( <FormItem><FormLabel>Prix Vente</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name={`products.${index}.stock`} render={({ field }) => ( <FormItem><FormLabel>Stock</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name={`products.${index}.sold`} render={({ field }) => ( <FormItem><FormLabel>Vendu</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => appendProduct({ id: `p${productFields.length + 1}_${Date.now()}`, name: 'Nouveau Produit', category: 'Bijoux & Accessoires', purchasePrice: 0, price: 0, stock: 0, sold: 0, remaining: 0, profit: 0 })}>
            Ajouter un produit
          </Button>
          
          <Separator className="my-6"/>

          <FormField
              control={form.control}
              name="wigTitle"
              render={({ field }) => (
              <FormItem>
                  <FormLabel className="text-lg font-semibold">Titre de la section Perruques</FormLabel>
                  <FormControl><Input {...field} defaultValue="Perruques" /></FormControl>
                  <FormMessage />
              </FormItem>
              )}
          />
          {wigFields.map((field, index) => (
              <div key={field.id} className="relative grid grid-cols-2 gap-4 p-4 border rounded-lg">
                  <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeWig(index)}><Trash2 className="h-4 w-4" /></Button>
                  <FormField control={form.control} name={`wigs.${index}.wigDetails`} render={({ field }) => ( <FormItem className="col-span-2"><FormLabel>Détails Perruque</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField control={form.control} name={`wigs.${index}.purchasedBundles`} render={({ field }) => ( <FormItem><FormLabel>Mèches Achetées</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField control={form.control} name={`wigs.${index}.brand`} render={({ field }) => ( <FormItem><FormLabel>Marque</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField control={form.control} name={`wigs.${index}.colors`} render={({ field }) => ( <FormItem><FormLabel>Couleurs</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField control={form.control} name={`wigs.${index}.bundlesPrice`} render={({ field }) => ( <FormItem><FormLabel>Prix Mèches</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField control={form.control} name={`wigs.${index}.sellingPrice`} render={({ field }) => ( <FormItem><FormLabel>Prix Vente</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField control={form.control} name={`wigs.${index}.sold`} render={({ field }) => ( <FormItem><FormLabel>Vendues</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField control={form.control} name={`wigs.${index}.remaining`} render={({ field }) => ( <FormItem><FormLabel>Restantes</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
              </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => appendWig({ id: `w${wigFields.length + 1}_${Date.now()}`, purchasedBundles: '', brand: '', colors: '', wigDetails: '', bundlesPrice: 0, sellingPrice: 0, sold: 0, remaining: 0 })}>Ajouter une perruque</Button>
          
          <Separator className="my-6"/>

          <FormField
              control={form.control}
              name="pastryTitle"
              render={({ field }) => (
              <FormItem>
                  <FormLabel className="text-lg font-semibold">Titre de la section Pâtisseries</FormLabel>
                  <FormControl><Input {...field} defaultValue="Pâtisseries" /></FormControl>
                  <FormMessage />
              </FormItem>
              )}
          />
          {pastryFields.map((field, index) => (
              <div key={field.id} className="relative grid grid-cols-2 gap-4 p-4 border rounded-lg">
                   <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removePastry(index)}><Trash2 className="h-4 w-4" /></Button>
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
                  <FormField control={form.control} name={`pastries.${index}.quantity`} render={({ field }) => ( <FormItem><FormLabel>Quantité</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name={`pastries.${index}.unitPrice`} render={({ field }) => ( <FormItem><FormLabel>Prix Unitaire</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name={`pastries.${index}.totalPrice`} render={({ field }) => ( <FormItem><FormLabel>Prix Total</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name={`pastries.${index}.expenses`} render={({ field }) => ( <FormItem><FormLabel>Dépenses</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name={`pastries.${index}.sold`} render={({ field }) => ( <FormItem><FormLabel>Vendues</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name={`pastries.${index}.remaining`} render={({ field }) => ( <FormItem><FormLabel>Restantes</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => appendPastry({ id: `pa${pastryFields.length + 1}_${Date.now()}`, name: 'Beignets', quantity: 0, unitPrice: 0, totalPrice: 0, expenses: 0, sold: 0, remaining: 0 })}>Ajouter une pâtisserie</Button>
        </div>
    </form>
  );
}
