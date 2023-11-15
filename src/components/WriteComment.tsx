'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

import {
  Button,
  Form,
  FormField,
  FormItem,
  FormMessage,
  Textarea,
  toast,
} from './ui';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
  postId: number;
  onCreate?: () => void;
}

const formSchema = z.object({
  text: z
    .string({ required_error: 'Text is required' })
    .min(4, 'Text must be at least 4 characters long')
    .max(2048, 'Text must be at most 2048 characters long'),
});
type FormSchemaType = z.infer<typeof formSchema>;

const WriteComment: FC<Props> = ({ postId, className, onCreate }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<FormSchemaType>({
    defaultValues: { text: '' },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormSchemaType) => {
    try {
      setLoading(true);

      await axios.post('/api/comment', { postId, text: data.text });

      toast({ title: 'Comment created' });
      form.reset();
      if (onCreate) onCreate();
      else router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: "Can't create comment, please try again later",
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
                placeholder="Write your comment here..."
                rows={4}
                disabled={loading}
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="flex ml-auto mt-2" disabled={loading}>
          Comment
        </Button>
      </form>
    </Form>
  );
};

export default WriteComment;
