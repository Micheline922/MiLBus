
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
import { Separator } from '../ui/separator';

const formSchema = z.object({
  companyStory: z.string().min(1, "La présentation de l'entreprise est requise"),
  testimonials: z.array(
    z.object({
      name: z.string().min(1, 'Le nom est requis'),
      avatar: z.string().min(1, 'Les initiales sont requises'),
      text: z.string().min(1, 'Le témoignage est requis'),
    })
  ),
  advertisingPhrases: z.array(
      z.object({
          value: z.string().min(1, 'La phrase est requise')
      })
  )
});

type EditAboutFormValues = z.infer<typeof formSchema>;

type EditAboutFormProps = {
  initialValues: { companyStory: string, testimonials: any[], advertisingPhrases: string[] };
  onSubmit: (values: any) => void;
};

export default function EditAboutForm({ initialValues, onSubmit }: EditAboutFormProps) {
  const form = useForm<EditAboutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        companyStory: initialValues.companyStory,
        testimonials: initialValues.testimonials,
        advertisingPhrases: initialValues.advertisingPhrases.map(p => ({ value: p })),
    },
  });
  
  const { fields: testimonialFields, append: appendTestimonial, remove: removeTestimonial } = useFieldArray({
    control: form.control,
    name: 'testimonials'
  });
  
  const { fields: phraseFields, append: appendPhrase, remove: removePhrase } = useFieldArray({
    control: form.control,
    name: 'advertisingPhrases'
  });

  const handleFormSubmit = (values: EditAboutFormValues) => {
    onSubmit({
        companyStory: values.companyStory,
        testimonials: values.testimonials,
        advertisingPhrases: values.advertisingPhrases.map(p => p.value),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 flex flex-col h-[70vh]">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
             <h3 className="text-lg font-medium">Présentation de l'Entreprise</h3>
             <FormField
                control={form.control}
                name="companyStory"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Notre Histoire</FormLabel>
                    <FormControl><Textarea {...field} rows={5} /></FormControl>
                    <FormMessage />
                </FormItem>
                )}
             />
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Témoignages</h3>
            {testimonialFields.map((field, index) => (
              <div key={field.id} className="relative space-y-2 p-4 border rounded-lg">
                <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeTestimonial(index)}>
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
            <Button type="button" variant="outline" size="sm" onClick={() => appendTestimonial({ name: '', avatar: '', text: '' })}>
              Ajouter un témoignage
            </Button>
          </div>
          
          <Separator className="my-6" />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Slogans & Phrases Publicitaires</h3>
            {phraseFields.map((field, index) => (
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
                 <Button type="button" variant="destructive" size="icon" className="h-9 w-9" onClick={() => removePhrase(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
             <Button type="button" variant="outline" size="sm" onClick={() => appendPhrase({ value: '' })}>
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
