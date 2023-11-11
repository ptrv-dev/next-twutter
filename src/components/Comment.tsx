import { FC } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import CommentLikeButton from './CommentLikeButton';

interface Props {
  id: number;
  author: {
    avatar: string | null;
    username: string;
  };
  text: string;
  likes: number[];
  createdAt: Date;
}

const Comment: FC<Props> = ({ id, text, author, likes, createdAt }) => {
  return (
    <div className="flex">
      <Avatar className="mr-4 flex-shrink-0">
        {author.avatar && <AvatarImage src={author.avatar} />}
        <AvatarFallback>{author.username[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="w-full flex items-center justify-between">
          <h5 className="font-medium text-lg">{author.username}</h5>
          <p className="text-sm text-muted-foreground">
            {createdAt.toLocaleString('ru-RU')}
          </p>
        </div>
        <p className="whitespace-pre-line">{text}</p>
        <div>
          <CommentLikeButton id={id} likes={likes} />
        </div>
      </div>
    </div>
  );
};

export default Comment;
