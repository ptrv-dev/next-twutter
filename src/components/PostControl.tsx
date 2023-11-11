'use client';

import { MoreHorizontalIcon, Trash2Icon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { FC } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface Props {
  postId: number;
  authorId: number;
}

const PostControl: FC<Props> = ({ postId, authorId }) => {
  const session = useSession();

  const handleRemove = async () => {
    console.log('REMOVE ' + postId);
  };

  if (session.status === 'authenticated' && session.data.user.id === authorId)
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <button className="flex items-center gap-2 text-primary p-2 rounded hover:bg-primary-foreground transition-colors">
            <MoreHorizontalIcon size={20} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="flex items-center gap-2 text-destructive focus:text-destructive"
            onClick={handleRemove}
          >
            <Trash2Icon size={16} />
            Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
};

export default PostControl;
