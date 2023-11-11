'use client';

import { FC, useState } from 'react';
import { ImageIcon, VideoIcon } from 'lucide-react';
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

  const onSubmit = async (data: FormSchemaType) => {
    if (loading) return;
    try {
      setLoading(true);
      await axios.post(
        '/api/post',
        { text: data.text },
        { withCredentials: true }
      );
      toast({
        title: 'Post created',
      });
      form.reset();
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
        <div className="w-full mt-2 flex justify-between">
          <div className="flex gap-2">
            <Button
              type="button"
              size="icon"
              className="w-8 h-8"
              variant="link"
              disabled={loading}
            >
              <ImageIcon size={20} />
            </Button>
            <Button
              type="button"
              size="icon"
              className="w-8 h-8"
              variant="link"
              disabled={loading}
            >
              <VideoIcon size={20} />
            </Button>
          </div>
          <Button type="submit" className="flex" disabled={loading}>
            Post
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default WritePost;
