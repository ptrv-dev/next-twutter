'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios, { AxiosError } from 'axios';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from './ui/use-toast';

const formSchema = z.object({
  username: z
    .string({ required_error: 'Username is required' })
    .min(3, 'Username must be at least 3 characters long')
    .max(32, 'Username must be at most 32 characters long'),
  email: z.string({ required_error: 'Email is required' }).email(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters long')
    .max(64, 'Password must be at most 64 characters long'),
  passwordConfirm: z.string({
    required_error: 'Password confirmation is required',
  }),
});
type FormSchema = z.infer<typeof formSchema>;

const SignUpForm = () => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormSchema) => {
    if (loading) return;
    if (data.password !== data.passwordConfirm)
      return form.setError('passwordConfirm', {
        message: 'Passwords do not match',
      });
    setLoading(true);

    try {
      await axios.post('/api/auth/sign-up', {
        username: data.username,
        email: data.email,
        password: data.password,
      });
      const res = await signIn('credentials', {
        username: data.username,
        password: data.password,
      });
      console.log(res);
      if (res?.ok) {
        router.push('/');
      } else {
        toast({ title: 'Something went wrong!', variant: 'destructive' });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          const message = error.response.data.message;
          if (message && message.toLowerCase().includes('username')) {
            return form.setError('username', {
              message: 'Username is already taken',
            });
          } else if (message && message.toLowerCase().includes('email')) {
            return form.setError('email', {
              message: 'Email is already taken',
            });
          }
        }
      } else {
        console.error(error);
        alert('Something went wrong...');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <Input type="text" placeholder="username" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Input type="text" placeholder="example@email.com" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <Input type="password" placeholder="••••••" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="passwordConfirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm your password</FormLabel>
              <Input type="password" placeholder="••••••" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          Sign Up
        </Button>
      </form>
    </Form>
  );
};

export default SignUpForm;
