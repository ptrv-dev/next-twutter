'use client';

import { HeartIcon, Loader2Icon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { FC, useState } from 'react';
import { toast } from './ui/use-toast';
import axios from 'axios';
import { IGetPost } from '@/app/api/post/interface';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface Props {
  id: number;
  likes: number[];
  onLike?: () => void;
}

const PostLikeButton: FC<Props> = ({ id, likes, onLike }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const session = useSession();
  const router = useRouter();

  const handleLike = async () => {
    if (session.status === 'loading') return;
    if (session.status === 'unauthenticated')
      return toast({ title: 'You should be logged in' });

    setLoading(true);

    try {
      await axios.post<IGetPost>(`/api/post/like/${id}`);
      if (onLike) onLike();
      else router.refresh();
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

export default PostLikeButton;
