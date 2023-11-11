import { cn } from '@/lib/utils';
import { FC } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { HeartIcon, MessageCircleIcon } from 'lucide-react';

interface Props {
  className?: string;
  author: {
    username: string;
    avatar?: string;
  };
  text: string;
  createdAt: Date;
}

const Post: FC<Props> = ({ className, author, text, createdAt }) => {
  return (
    <div className={cn('w-full flex items-start', className)}>
      <Avatar className="mr-4">
        {author.avatar && <AvatarImage src={author.avatar} />}
        <AvatarFallback>{author.username[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <div className="flex items-center justify-between leading-none mb-2">
          <h5 className="font-medium text-lg">{author.username}</h5>
          <p className="text-sm text-muted-foreground">
            {createdAt.toLocaleString('ru-RU')}
          </p>
        </div>
        <p className="whitespace-pre-wrap">{text}</p>
        <div className="mt-2 flex items-center gap-2">
          <button className="flex items-center gap-2 text-primary p-2 rounded hover:bg-primary-foreground transition-colors">
            <HeartIcon size={20} />
            10
          </button>
          <button className="flex items-center gap-2 text-primary p-2 rounded hover:bg-primary-foreground transition-colors">
            <MessageCircleIcon size={20} />4
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;
