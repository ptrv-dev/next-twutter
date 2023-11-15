'use client';

import { ChangeEvent, FC, useRef } from 'react';
import { Button } from './ui/button';
import { ImageIcon, Trash2Icon } from 'lucide-react';
import Image from 'next/image';

interface Props {
  image: File | undefined;
  onImageChange: (image: File | undefined) => void;
}

const PostImageButton: FC<Props> = ({ image, onImageChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    onImageChange(file);
  };

  const onImageRemove = () => onImageChange(undefined);

  if (!image)
    return (
      <>
        <input
          ref={inputRef}
          className="hidden"
          type="file"
          accept="image/jpeg,image/png"
          onChange={onInputChange}
        />
        <Button
          type="button"
          className="w-8 h-8"
          size="icon"
          variant="link"
          onClick={() => inputRef.current?.click()}
        >
          <ImageIcon size={20} />
        </Button>
      </>
    );

  return (
    <div className="relative w-full rounded-md overflow-hidden h-96 group">
      <Button
        type="button"
        className="absolute top-2 left-2 z-50 w-8 h-8 opacity-0 transition-opacity group-hover:opacity-100"
        variant="destructive"
        size="icon"
        onClick={onImageRemove}
      >
        <Trash2Icon size={16} />
      </Button>
      <Image
        className="object-cover"
        src={URL.createObjectURL(image)}
        alt=""
        fill
      />
    </div>
  );
};

export default PostImageButton;
