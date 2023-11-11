import { FC, useState } from 'react';
import { Form, FormField, FormItem, FormMessage } from './ui/form';
import { cn } from '@/lib/utils';
import { ImageIcon, VideoIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from './ui/use-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Props {
  className?: string;
  postId: number;
}

const formSchema = z.object({
  text: z
    .string({ required_error: 'Text is required' })
    .min(4, 'Text must be at least 4 characters long')
    .max(2048, 'Text must be at most 2048 characters long'),
});
type FormSchemaType = z.infer<typeof formSchema>;

const WriteComment: FC<Props> = ({ postId, className }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<FormSchemaType>({
    defaultValues: { text: '' },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormSchemaType) => {
    console.log(data);
    try {
      setLoading(true);

      await axios.post('/api/comment', { postId, text: data.text });

      toast({ title: 'Comment created' });
      form.reset();
      router.refresh();
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
