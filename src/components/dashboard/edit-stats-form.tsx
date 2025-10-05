
'use client';

import { useForm } from 'react-hook-form';
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

const formSchema = z.object({
  totalRevenue: z.object({
    value: z.string(),
    change: z.string(),
  }),
  sales: z.object({
    value: z.string(),
    change: z.string(),
  }),
  stock: z.object({
    value: z.string(),
    change: z.string(),
  }),
});

type EditStatsFormValues = z.infer<typeof formSchema>;

type EditStatsFormProps = {
  initialValues: EditStatsFormValues;
  onSubmit: (values: EditStatsFormValues) => void;
};

export default function EditStatsForm({ initialValues, onSubmit }: EditStatsFormProps) {
  const form = useForm<EditStatsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
        </div>
        <div className="flex justify-end pt-4 border-t">
            <Button type="submit">Enregistrer les modifications</Button>
        </div>
      </form>
    </Form>
  );
}
