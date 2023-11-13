'use client';

import { ChangeEvent, FC, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { toast } from './ui/use-toast';
import { useRouter } from 'next/navigation';

interface Props {
  className?: string;
  avatar: string | null;
  username: string;
}

const ProfileAvatar: FC<Props> = ({ className, avatar, username }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleImage = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    try {
      const data = new FormData();
      data.append('file', file);

      await axios.post('/api/profile/avatar', data);
      toast({ title: 'Success', description: 'Avatar updated' });

      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: "Can't upload avatar, please try later..",
        variant: 'destructive',
      });
    }
  };

  return (
    <div
      className={cn(
        'relative w-48 h-48 rounded-full overflow-hidden',
        className
      )}
    >
      <input
        className="hidden"
        ref={inputRef}
        onChange={handleImage}
        type="file"
        accept="image/png,image/jpeg,image/webp"
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="absolute w-full h-full z-10 text-primary flex items-center justify-center bg-black bg-opacity-25 transition-opacity opacity-0 hover:opacity-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          width="32"
          height="32"
          viewBox="0 0 471.04 471.04"
        >
          <g>
            <path
              d="M414.72 112.64h-49.152l-27.136-40.96c-10.24-15.36-28.16-24.576-46.592-24.576H179.2c-18.432 0-36.352 9.216-46.592 24.576l-27.136 40.96H56.32A56.158 56.158 0 0 0 0 168.96v198.656a56.158 56.158 0 0 0 56.32 56.32h358.4a56.158 56.158 0 0 0 56.32-56.32V168.96a56.158 56.158 0 0 0-56.32-56.32zm-179.2 265.216c-70.144 0-126.976-56.832-126.976-126.976s56.832-126.464 126.976-126.464 126.976 56.832 126.976 126.976c0 69.632-56.832 126.464-126.976 126.464zM407.552 192h-22.528c-9.216-.512-16.384-8.192-15.872-17.408.512-8.704 7.168-15.36 15.872-15.872h20.48c9.216-.512 16.896 6.656 17.408 15.872.512 9.216-6.144 16.896-15.36 17.408z"
              fill="currentColor"
            ></path>
            <path
              d="M235.52 180.736c-38.912 0-70.656 31.744-70.656 70.656s31.744 70.144 70.656 70.144 70.656-31.744 70.656-70.656c0-38.912-31.744-70.144-70.656-70.144z"
              fill="currentColor"
            ></path>
          </g>
        </svg>
      </button>
      <Avatar className="w-full h-full text-2xl">
        {avatar && <AvatarImage src={avatar} />}
        <AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default ProfileAvatar;
