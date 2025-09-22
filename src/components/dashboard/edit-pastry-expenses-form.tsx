
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

const formSchema = z.object({
  pastryExpenses: z.array(
    z.object({
      id: z.string(),
      item: z.string().min(1, "Le nom de l'article est requis"),
      cost: z.coerce.number(),
      category: z.enum(['Beignets', 'Crêpes', 'Gâteaux', 'Général']),
      purchaseDate: z.string().min(1, 'La date est requise'),
    })
  ),
});

type EditPastryExpensesFormValues = z.infer<typeof formSchema>;

type EditPastryExpensesFormProps = {
  initialValues: EditPastryExpensesFormValues;
  onSubmit: (values: EditPastryExpensesFormValues) => void;
};

export default function EditPastryExpensesForm({ initialValues, onSubmit }: EditPastryExpensesFormProps) {
  const form = useForm<EditPastryExpensesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'pastryExpenses'
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col h-[70vh]">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Détail des Dépenses - Pâtisseries</h3>
             <div className='space-y-4'>
                {fields.map((field, index) => (
                    <div key={field.id} className="relative grid grid-cols-2 gap-4 p-4 border rounded-lg">
                        <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => remove(index)}>
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
             <Button type="button" variant="outline" size="sm" onClick={() => append({ id: `pe${fields.length + 1}`, item: '', cost: 0, category: 'Général', purchaseDate: new Date().toISOString().split('T')[0] })}>
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
