import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import SignInForm from '@/components/SignInForm';
import { redirect } from 'next/navigation';

const SignInPage = async () => {
  const session = await getServerSession(authOptions);
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
      </div>
    </div>
  );
};

export default SignInPage;
