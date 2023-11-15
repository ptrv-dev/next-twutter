'use client';

import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import * as z from 'zod';

import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Form, FormField, FormItem, FormMessage } from './ui/form';
import { toast } from './ui/use-toast';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import PostImageButton from './PostImageButton';

const formSchema = z.object({
  text: z
    .string({ required_error: 'Text is required' })
    .min(4, 'Text must be at least 4 characters long')
    .max(2048, 'Text must be at most 2048 characters long'),
});
type FormSchemaType = z.infer<typeof formSchema>;

interface Props {
  className?: string;
}

const WritePost: FC<Props> = ({ className }) => {
  const form = useForm<FormSchemaType>({
    defaultValues: { text: '' },
    resolver: zodResolver(formSchema),
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | undefined>();

  const onSubmit = async (data: FormSchemaType) => {
    if (loading) return;
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('text', data.text);
      if (image) formData.append('image', image);

      await axios.post('/api/post', formData, { withCredentials: true });
      toast({
        title: 'Post created',
      });
      form.reset();
      setImage(undefined);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Something went wrong, please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form className={cn(className)} onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="text"
          render={({ field }) => (
            <FormItem>
              <Textarea
                className="resize-none w-full"
                placeholder="Write your post here..."
                rows={4}
                disabled={loading}
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full mt-2 gap-4 flex justify-between">
          <PostImageButton
            image={image}
            onImageChange={(image) => setImage(image)}
          />
          <Button type="submit" className="flex" disabled={loading}>
            Post
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default WritePost;
