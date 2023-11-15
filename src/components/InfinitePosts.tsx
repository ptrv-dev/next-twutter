'use client';

interface Props {
  limit: number;
}

import { IGetPosts, IPost } from '@/app/api/post/interface';
import { FC, useEffect, useRef, useState } from 'react';
import { toast } from './ui/use-toast';
import axios from 'axios';
import Post from './Post';
import { Loader2Icon } from 'lucide-react';

const InfinitePosts: FC<Props> = ({ limit }) => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [times, setTimes] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const observableRef = useRef<HTMLDivElement>(null);

  const fetchPosts = async (limit: number, skip: number, clear = false) => {
    if (loading) return;
    try {
      setLoading(true);

      const { data } = await axios.get<IGetPosts>(
        '/api/post?skip=' + skip + '&limit=' + limit
      );

      if (clear) {
        setPosts(data.data);
      } else {
        setPosts((prev) => [...prev, ...data.data]);
        setTimes((prev) => prev + 1);
        setHasMore(data.count > limit * times);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: "Can't fetch more posts, please try again later..",
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const reloadPosts = async () => {
    await fetchPosts(posts.length, limit, true);
  };

  useEffect(() => {
    if (!observableRef.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        fetchPosts(limit, limit * times);
        observer.unobserve(entry.target);
      }
    });

    if (hasMore) observer.observe(observableRef.current);
    else observer.unobserve(observableRef.current);

    return () => {
      observer.disconnect();
    };
  }, [times, hasMore]);

  return (
    <>
      {posts.map((post) => (
        <Post
          className="p-4 border-b"
          key={post.id}
          {...post}
          onRemove={reloadPosts}
          onLike={reloadPosts}
          createdAt={new Date(post.createdAt)}
        />
      ))}
      <div ref={observableRef} className="w-full">
        {loading && (
          <Loader2Icon
            size={24}
            className="text-primary animate-spin mx-auto"
          />
        )}
      </div>
    </>
  );
};

export default InfinitePosts;
