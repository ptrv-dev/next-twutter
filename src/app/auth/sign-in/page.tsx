import Link from 'next/link';
import { redirect } from 'next/navigation';

import { SignInForm } from '@/components';
import { getSession } from '@/utils/getSession';

const SignInPage = async () => {
  const session = await getSession();
  if (session) return redirect('/');

  return (
    <div className="min-h-screen bg-secondary sm:bg-transparent sm:p-4">
      <div className="mx-auto mt-20 sm:max-w-lg w-full p-4 sm:p-8 py-8 sm:py-16 bg-background sm:bg-secondary sm:rounded-lg">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center">Sign In</h1>
          <p className="text-center text-muted-foreground">
            Please sign in in your account to continue
          </p>
        </div>
        <SignInForm />
        <div className="mt-8 text-center text-muted-foreground">
          Don&apos;t have an account yet?{' '}
          <Link className="text-primary hover:underline" href="/auth/sign-up">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
