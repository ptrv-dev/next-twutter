import { getServerSession } from 'next-auth';

import WritePost from '@/components/WritePost';
import { authOptions } from '../api/auth/[...nextauth]/options';
import Post from '@/components/Post';
import axios from 'axios';
import { type IGetPosts } from '../api/post/interface';
import InfinitePosts from '@/components/InfinitePosts';

async function getPosts(limit: number) {
  try {
    const { data } = await axios.get<IGetPosts>(
      'http://localhost:3000/api/post?limit=' + limit
    );
    return data.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const HomePage = async () => {
  const limit = 10;
  const session = await getServerSession(authOptions);
  const posts = await getPosts(limit);
  return (
    <div className="border-r h-full">
      <div className="border-b h-[69px] px-4 flex pb-4">
        <h1 className="text-2xl mt-auto">Home</h1>
      </div>
      {session && <WritePost className="p-4 border-b" />}
      <div className="flex flex-col p-4 gap-4">
        {posts ? (
          <>
            {posts.map((post) => (
              <Post
                key={post.id}
                id={post.id}
                author={post.author}
                text={post.text}
                likes={post.likes}
                createdAt={new Date(post.createdAt)}
              />
            ))}
            <InfinitePosts limit={limit} />
          </>
        ) : (
          'Something went wrong...'
        )}
      </div>
    </div>
  );
};

export default HomePage;
