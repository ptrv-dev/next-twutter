'use client';

import { MessageCircleIcon } from 'lucide-react';
import { FC, useState } from 'react';
import Comment, { ICommentProps } from './Comment';
import { useSession } from 'next-auth/react';
import WriteComment from './WriteComment';

interface Props {
  postId: number;
  comments: ICommentProps[];
  onComment?: () => void;
}

const PostCommentButton: FC<Props> = ({ postId, comments, onComment }) => {
  const [open, setOpen] = useState<boolean>(false);
  const session = useSession();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-primary p-2 rounded hover:bg-primary-foreground transition-colors"
      >
        <MessageCircleIcon size={20} />
        {comments.length}
      </button>
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed z-50 top-0 left-0 w-full h-full bg-black bg-opacity-25 p-4 flex items-center justify-center"
        >
          <div
            className="bg-white rounded-lg p-4 max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 font-bold text-2xl">Post comments</h3>
            <div className="flex flex-col gap-4">
              {comments.length === 0 && <p>There is no comments yet.</p>}
              {comments
                .sort((c1, c2) => {
                  const date1 = new Date(c1.createdAt);
                  const date2 = new Date(c2.createdAt);
                  return date2.getTime() - date1.getTime();
                })
                .map((comment) => (
                  <Comment
                    key={comment.id}
                    {...comment}
                    createdAt={new Date(comment.createdAt)}
                  />
                ))}
              {session.status === 'authenticated' && (
                <WriteComment
                  onCreate={onComment}
                  postId={postId}
                  className="mt-8"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostCommentButton;
