import { cn } from '@/lib/utils';
import { FC } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import PostLikeButton from './PostLikeButton';
import PostCommentButton from './PostCommentButton';
import PostControl from './PostControl';
import Link from 'next/link';
import { ICommentProps } from './Comment';

interface Props {
  className?: string;
  id: number;
  author: {
    id: number;
    username: string;
    avatar?: string | null;
  };
  text: string;
  likes: number[];
  comments: ICommentProps[];
  createdAt: Date;
  onRemove?: () => void;
  onLike?: () => void;
}

const Post: FC<Props> = ({
  className,
  id,
  author,
  text,
  likes,
  comments,
  createdAt,
  onRemove,
  onLike,
}) => {
  return (
    <div className={cn('flex', className)}>
      <Link href={`/user/${author.username}`}>
        <Avatar className="mr-4">
          {author.avatar && <AvatarImage src={author.avatar} />}
          <AvatarFallback>{author.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
      </Link>
      <div className="w-full">
        <div className="w-full flex items-center justify-between leading-none mb-2">
          <Link href={`/user/${author.username}`}>
            <h5 className="font-medium text-lg">{author.username}</h5>
          </Link>
          <p className="text-sm text-muted-foreground">
            {createdAt.toLocaleString('ru-RU')}
          </p>
        </div>
        <p className="whitespace-pre-wrap">{text}</p>
        <div className="mt-2 flex items-center gap-2">
          <PostLikeButton id={id} likes={likes} onLike={onLike} />
          <PostCommentButton postId={id} comments={comments} />
          <PostControl postId={id} authorId={author.id} onRemove={onRemove} />
        </div>
      </div>
    </div>
  );
};

export default Post;
