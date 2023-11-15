import { prisma } from '@/app/prisma';
import { InfinitePosts, Post, WritePost } from '@/components';
import { getSession } from '@/utils/getSession';

const HomePage = async () => {
  const session = await getSession();
  const limit = 10;
  const posts = await prisma.post.findMany({
    include: {
      author: true,
      comments: {
        include: { author: true },
      },
    },
    take: limit,
    orderBy: { createdAt: 'desc' },
  });
  return (
    <div className="border-r h-full">
      <div className="border-b p-4">
        <h1 className="text-2xl">Home</h1>
      </div>
      {session && <WritePost className="p-4 border-b" />}
      <div className="flex flex-col">
        {posts.map((post) => (
          <Post
            className="border-b p-4"
            key={post.id}
            {...post}
            createdAt={new Date(post.createdAt)}
          />
        ))}
        <InfinitePosts limit={limit} />
      </div>
    </div>
  );
};

export default HomePage;
