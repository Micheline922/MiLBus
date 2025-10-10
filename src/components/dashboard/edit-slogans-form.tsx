
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
  advertisingPhrases: z.array(
      z.object({
          value: z.string().min(1, 'La phrase est requise')
      })
  )
});

type EditSlogansFormValues = z.infer<typeof formSchema>;

type EditSlogansFormProps = {
  initialValues: { advertisingPhrases: string[] };
  onSubmit: (values: { advertisingPhrases: string[] }) => void;
};

export default function EditSlogansForm({ initialValues, onSubmit }: EditSlogansFormProps) {
  const form = useForm<EditSlogansFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        advertisingPhrases: initialValues.advertisingPhrases.map(p => ({ value: p })),
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'advertisingPhrases'
  });

  const handleFormSubmit = (values: EditSlogansFormValues) => {
    onSubmit({
        advertisingPhrases: values.advertisingPhrases.map(p => p.value),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 flex flex-col h-[70vh]">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="relative flex items-center gap-2 p-4 border rounded-lg">
                <FormField
                  control={form.control}
                  name={`advertisingPhrases.${index}.value`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="sr-only">Phrase</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <Button type="button" variant="destructive" size="icon" className="h-9 w-9" onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
             <Button type="button" variant="outline" size="sm" onClick={() => append({ value: '' })}>
              Ajouter une phrase
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

    