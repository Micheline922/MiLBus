
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
import { Textarea } from '../ui/textarea';

const formSchema = z.object({
  testimonials: z.array(
    z.object({
      name: z.string().min(1, 'Le nom est requis'),
      avatar: z.string().min(1, 'Les initiales sont requises'),
      text: z.string().min(1, 'Le témoignage est requis'),
    })
  ),
});

type EditTestimonialsFormValues = z.infer<typeof formSchema>;

type EditTestimonialsFormProps = {
  initialValues: { testimonials: any[] };
  onSubmit: (values: EditTestimonialsFormValues) => void;
};

export default function EditTestimonialsForm({ initialValues, onSubmit }: EditTestimonialsFormProps) {
  const form = useForm<EditTestimonialsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'testimonials'
  });

  const handleFormSubmit = (values: EditTestimonialsFormValues) => {
    onSubmit(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 flex flex-col h-[70vh]">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="relative space-y-2 p-4 border rounded-lg">
                <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
                 <div className="grid grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name={`testimonials.${index}.name`}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Nom du client</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name={`testimonials.${index}.avatar`}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Initiales (Avatar)</FormLabel>
                        <FormControl><Input {...field} maxLength={2} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <FormField
                  control={form.control}
                  name={`testimonials.${index}.text`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Texte du témoignage</FormLabel>
                      <FormControl><Textarea {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', avatar: '', text: '' })}>
              Ajouter un témoignage
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

    