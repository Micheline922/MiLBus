
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
import { Wig } from '@/lib/data';

const formSchema = z.object({
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
});

type EditWigsFormValues = z.infer<typeof formSchema>;

type EditWigsFormProps = {
  initialValues: { wigs: Wig[] };
  onSubmit: (values: { wigs: Wig[] }) => void;
};

export default function EditWigsForm({ initialValues, onSubmit }: EditWigsFormProps) {
  const form = useForm<EditWigsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'wigs'
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col h-[70vh]">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {fields.map((field, index) => (
                <div key={field.id} className="relative grid grid-cols-2 gap-4 p-4 border rounded-lg">
                    <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>
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
            <Button type="button" variant="outline" size="sm" onClick={() => append({ id: `w${fields.length + 1}`, purchasedBundles: '', brand: '', colors: '', wigDetails: '', bundlesPrice: 0, sellingPrice: 0, sold: 0, remaining: 0 })}>Ajouter une perruque</Button>
          </div>
        </ScrollArea>
        <div className="flex justify-end pt-4 border-t sticky bottom-0 bg-background pb-4">
          <Button type="submit">Enregistrer les modifications</Button>
        </div>
      </form>
    </Form>
  );
}
