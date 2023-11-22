'use client';

import { FC } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { LogInIcon, LogOutIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

interface Props {
  className?: string;
}

const LoginButton: FC<Props> = ({ className }) => {
  const session = useSession();

  if (session.status === 'loading') return;

  if (session.status === 'authenticated')
    return (
      <button
        onClick={() => signOut()}
        className={cn(
          'flex items-center py-2 gap-4 text-xl transition-colors hover:text-primary',
          className
        )}
      >
        <LogOutIcon size={18} />
        Sign Out
      </button>
    );

  return (
    <Link
      href="/auth/sign-in"
      className={cn(
        'flex items-center py-2 gap-4 text-xl transition-colors hover:text-primary',
        className
      )}
    >
      <LogInIcon size={18} />
      Sign In
    </Link>
  );
};

export default LoginButton;
