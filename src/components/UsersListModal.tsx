'use client';

import { FC } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import Link from 'next/link';

type User = {
  id: number;
  username: string;
  avatar: string | null;
};

interface Props {
  title?: string;
  users: User[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UsersListModal: FC<Props> = ({ users, title, open, onOpenChange }) => {
  if (open)
    return (
      <div
        className="fixed z-50 top-0 left-0 w-full h-full bg-black bg-opacity-25 p-4 flex items-center justify-center"
        onClick={() => onOpenChange(false)}
      >
        <div
          className="bg-white rounded-lg p-4 max-w-2xl w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="mb-4 font-bold text-2xl">{title || 'Users'}</h3>
          {users.length < 1 && <p>Empty...</p>}
          <div className="flex flex-col gap-4">
            {users.map((user) => (
              <Link
                key={user.id}
                className="flex gap-2 items-center"
                href={`/user/${user.username}`}
              >
                <Avatar className="w-8 h-8">
                  {user.avatar && <AvatarImage src={user.avatar} />}
                  <AvatarFallback>
                    {user.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h5 className="font-medium text-lg">{user.username}</h5>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
};

export default UsersListModal;
