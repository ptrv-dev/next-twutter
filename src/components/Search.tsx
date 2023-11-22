'use client';

import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage, Input, toast } from './ui';
import axios from 'axios';
import {
  Post as IPost,
  SearchResponse,
  User as IUser,
} from '@/app/api/search/route';
import debounce from '@/utils/debounce';
import Link from 'next/link';
import { Post } from '.';

const Search = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<IUser[] | null>(null);
  const [posts, setPosts] = useState<IPost[] | null>(null);

  const fetchData = async () => {
    try {
      if (!query) {
        setUsers(null);
        setPosts(null);
        return;
      }
      setLoading(true);
      const searchParams = new URLSearchParams();
      searchParams.set('query', query);
      const { data } = await axios.get<SearchResponse>(
        '/api/search?' + searchParams.toString()
      );
      setUsers(data.data.users);
      setPosts(data.data.posts);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: "Can't fetch data from search, please try again later..",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounced = debounce(() => fetchData(), 1000);
    debounced();

    return () => {
      debounced.cancel();
    };
  }, [query]);

  return (
    <>
      <Input
        className="mb-4"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {users && (
        <div className="flex flex-col gap-4 mb-8">
          <h3 className="text-lg font-medium uppercase">Users</h3>
          {users.length === 0 && (
            <p className="text-black text-opacity-50">
              No users were found for the query
            </p>
          )}
          {users.map((user) => (
            <Link
              className="flex gap-2 items-center"
              key={user.id}
              href={`/user/${user.username}`}
            >
              <Avatar>
                {user.avatar && <AvatarImage src={user.avatar} />}
                <AvatarFallback>
                  {user.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h5 className="text-lg font-medium">{user.username}</h5>
            </Link>
          ))}
        </div>
      )}
      {posts && (
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-medium uppercase">Posts</h3>
          {posts.length === 0 && (
            <p className="text-black text-opacity-50">
              No posts were found for the query
            </p>
          )}
          {posts.map((post) => (
            <Post
              key={post.id}
              {...post}
              onComment={fetchData}
              onLike={fetchData}
              onRemove={fetchData}
              createdAt={new Date(post.createdAt)}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default Search;
