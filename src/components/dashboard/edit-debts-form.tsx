
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
import { Debt } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const formSchema = z.object({
  debts: z.array(
    z.object({
      id: z.string(),
      debtorName: z.string().min(1, 'Le nom est requis'),
      amount: z.coerce.number(),
      debtDate: z.string().min(1, 'La date est requise'),
      paymentDate: z.string().min(1, 'La date est requise'),
      status: z.enum(['En cours', 'Remboursée']),
    })
  ),
});

type EditDebtsFormValues = z.infer<typeof formSchema>;

type EditDebtsFormProps = {
  initialValues: { debts: Debt[] };
  onSubmit: (values: { debts: Debt[] }) => void;
};

export default function EditDebtsForm({ initialValues, onSubmit }: EditDebtsFormProps) {
  const form = useForm<EditDebtsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'debts'
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
                  name={`debts.${index}.debtorName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom du débiteur</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`debts.${index}.amount`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Montant</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`debts.${index}.debtDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de la dette</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`debts.${index}.paymentDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de paiement</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name={`debts.${index}.status`}
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
                              <SelectItem value="En cours">En cours</SelectItem>
                              <SelectItem value="Remboursée">Remboursée</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => append({ id: `d${fields.length + 1}`, debtorName: '', amount: 0, debtDate: new Date().toISOString().split('T')[0], paymentDate: new Date().toISOString().split('T')[0], status: 'En cours' })}>
              Ajouter une dette
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
