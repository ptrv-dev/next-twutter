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
    icon: <HomeIcon />,
  },
  {
    label: 'Trend',
    href: '/trend',
    icon: <StarsIcon />,
  },
  {
    label: 'Search',
    href: '/search',
    icon: <SearchIcon />,
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: <UserIcon />,
  },
];

const Navbar: FC<Props> = ({ className }) => {
  return (
    <aside className={cn('flex flex-col py-4 border-r', className)}>
      <Link className="text-3xl font-bold text-primary self-start" href="/">
        Twutter
      </Link>
      <hr className="my-4" />
      <nav className="flex flex-col">
        {navigationItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center py-2 gap-2 text-xl transition-colors hover:text-primary"
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
