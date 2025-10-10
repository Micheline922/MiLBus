
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
import { ScrollArea } from '../ui/scroll-area';
import { Textarea } from '../ui/textarea';

const formSchema = z.object({
  companyStory: z.string().min(1, "La présentation de l'entreprise est requise"),
});

type EditAboutFormValues = z.infer<typeof formSchema>;

type EditAboutFormProps = {
  initialValues: { companyStory: string };
  onSubmit: (values: any) => void;
};

export default function EditAboutForm({ initialValues, onSubmit }: EditAboutFormProps) {
  const form = useForm<EditAboutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        companyStory: initialValues.companyStory,
    },
  });

  const handleFormSubmit = (values: EditAboutFormValues) => {
    onSubmit(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
             <FormField
                control={form.control}
                name="companyStory"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Notre Histoire</FormLabel>
                    <FormControl><Textarea {...field} rows={8} /></FormControl>
                    <FormMessage />
                </FormItem>
                )}
             />
          </div>
        </ScrollArea>
        <div className="flex justify-end pt-4 border-t">
          <Button type="submit">Enregistrer les modifications</Button>
        </div>
      </form>
    </Form>
  );
}

    