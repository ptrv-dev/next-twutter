import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import SignUpForm from '@/components/SignUpForm';

const SignUpPage = async () => {
  const session = await getServerSession(authOptions);
  if (session) return redirect('/');
  return (
    <div className="min-h-screen bg-secondary sm:bg-transparent sm:p-4">
      <div className="mx-auto mt-20 sm:max-w-lg w-full p-4 sm:p-8 py-8 sm:py-16 bg-background sm:bg-secondary sm:rounded-lg">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center">Sign Up</h1>
          <p className="text-center text-muted-foreground">
            Please create your account to continue
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUpPage;
