'use client';

import { FC, useState } from 'react';
import { ImageIcon, VideoIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
}

const WritePost: FC<Props> = ({ className }) => {
  const [text, setText] = useState('');
  return (
    <div className={cn(className)}>
      <Textarea
        className="resize-none w-full"
        placeholder="Write your post here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
      />
      <div className="w-full mt-2 flex justify-between">
        <div className="flex gap-2">
          <Button size="icon" className="w-8 h-8" variant="link">
            <ImageIcon size={20} />
          </Button>
          <Button size="icon" className="w-8 h-8" variant="link">
            <VideoIcon size={20} />
          </Button>
        </div>
        <Button className="flex">Post</Button>
      </div>
    </div>
  );
};

export default WritePost;
