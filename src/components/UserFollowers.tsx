'use client';

import { FC, useState } from 'react';
import UsersListModal from './UsersListModal';

type User = {
  id: number;
  username: string;
  avatar: string | null;
};

interface Props {
  followers: User[];
}

const UserFollowers: FC<Props> = ({ followers }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="px-8 p-4 rounded-lg bg-primary-foreground flex flex-col items-center text-center cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <strong className="text-4xl font-medium leading-none text-primary">
          {followers.length}
        </strong>
        <sub className="uppercase text-xs leading-none">followers</sub>
      </div>
      <UsersListModal
        title="User Followers"
        users={followers}
        open={open}
        onOpenChange={(open) => setOpen(open)}
      />
    </>
  );
};

export default UserFollowers;
