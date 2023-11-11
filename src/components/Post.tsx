import { cn } from '@/lib/utils';
import { FC } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import PostLikeButton from './PostLikeButton';
import PostCommentButton from './PostCommentButton';
import { IComment } from '@/app/api/post/interface';

interface Props {
  className?: string;
  id: number;
  author: {
    username: string;
    avatar?: string | null;
  };
  text: string;
  likes: number[];
  comments: IComment[];
  createdAt: Date;
}

const Post: FC<Props> = ({
  className,
  id,
  author,
  text,
  likes,
  comments,
  createdAt,
}) => {
  return (
    <div className={cn('flex', className)}>
      <Avatar className="mr-4">
        {author.avatar && <AvatarImage src={author.avatar} />}
        <AvatarFallback>{author.username[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="w-full">
        <div className="w-full flex items-center justify-between leading-none mb-2">
          <h5 className="font-medium text-lg">{author.username}</h5>
          <p className="text-sm text-muted-foreground">
            {createdAt.toLocaleString('ru-RU')}
          </p>
        </div>
        <p className="whitespace-pre-wrap">{text}</p>
        <div className="mt-2 flex items-center gap-2">
          <PostLikeButton id={id} likes={likes} />
          <PostCommentButton postId={id} comments={comments} />
        </div>
      </div>
    </div>
  );
};

export default Post;
