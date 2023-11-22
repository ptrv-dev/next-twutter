'use client';

import { cn } from '@/lib/utils';
import { LogInIcon, LogOutIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FC } from 'react';

interface Props {
  className?: string;
}

const LoginButton: FC<Props> = ({ className }) => {
  const session = useSession();

  if (session.status === 'loading') return;

  if (session.status === 'authenticated')
    return (
      <Link
        href="/auth/sign-out"
        className={cn(
          'flex items-center py-2 gap-4 text-xl transition-colors hover:text-primary',
          className
        )}
      >
        <LogOutIcon size={18} />
        Sign Out
      </Link>
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
