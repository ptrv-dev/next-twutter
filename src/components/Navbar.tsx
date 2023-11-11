import { FC } from 'react';
import Link from 'next/link';
import { HomeIcon, SearchIcon, StarsIcon, UserIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

interface Props {
  className?: string;
}

const navigationItems = [
  {
    label: 'Home',
    href: '/',
    icon: <HomeIcon size={18} />,
  },
  {
    label: 'Trend',
    href: '/trend',
    icon: <StarsIcon size={18} />,
  },
  {
    label: 'Search',
    href: '/search',
    icon: <SearchIcon size={18} />,
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: <UserIcon size={18} />,
  },
];

const Navbar: FC<Props> = ({ className }) => {
  return (
    <aside className={cn('flex flex-col py-4 border-r', className)}>
      <Link
        className="text-3xl font-bold text-primary self-start mb-4"
        href="/"
      >
        Twutter
      </Link>
      <nav className="flex flex-col">
        {navigationItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center py-2 gap-4 text-xl transition-colors hover:text-primary"
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Navbar;
