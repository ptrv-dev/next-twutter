'use client';

import { HeartIcon, Loader2Icon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { FC, useState } from 'react';
import { toast } from './ui/use-toast';
import axios from 'axios';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface Props {
  id: number;
  likes: number[];
}

const CommentLikeButton: FC<Props> = ({ id, likes }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const session = useSession();
  const router = useRouter();

  const handleLike = async () => {
    if (session.status === 'loading') return;
    if (session.status === 'unauthenticated')
      return toast({ title: 'You should be logged in' });

    setLoading(true);

    try {
      await axios.post(`/api/comment/like/${id}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: "Can't like post, please try again later..",
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      className="flex items-center gap-2 text-primary p-2 rounded hover:bg-primary-foreground transition-colors"
    >
      {loading ? (
        <Loader2Icon size={20} className="animate-spin" />
      ) : (
        <>
          <HeartIcon
            className={cn({
              'fill-primary': likes.includes(session.data?.user.id || -1),
            })}
            size={20}
          />
          {likes.length}
        </>
      )}
    </button>
  );
};

export default CommentLikeButton;
