'use client';

import { Loader2Icon, MoreHorizontalIcon, Trash2Icon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { FC, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { toast } from './ui/use-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Props {
  commentId: number;
  authorId: number;
  onRemove?: () => void;
}

const CommentControl: FC<Props> = ({ commentId, authorId, onRemove }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const session = useSession();
  const router = useRouter();

  const handleRemove = async () => {
    try {
      setLoading(true);

      await axios.delete('/api/comment/' + commentId);

      toast({ title: 'Success', description: 'Comment removed' });
      if (onRemove) onRemove();
      else router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: "Can't remove comment, please try again later..",
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <Loader2Icon size={20} className="text-primary animate-spin" />;

  if (session.status === 'authenticated' && session.data.user.id === authorId)
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
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

export default CommentControl;
