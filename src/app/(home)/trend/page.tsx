import { prisma } from '@/app/prisma';
import { InfinitePosts, Post } from '@/components';

const TrendPage = async () => {
  const limit = 10;
  const posts = await prisma.post.findMany({
    include: {
      author: true,
      comments: {
        include: { author: true },
      },
    },
    take: limit,
    orderBy: { likesCount: 'desc' },
  });
  return (
    <div className="border-r h-full">
      <div className="border-b p-4">
        <h1 className="text-2xl">Trend</h1>
      </div>
      <div className="flex flex-col">
        {posts.map((post) => (
          <Post
            className="border-b p-4"
            key={post.id}
            {...post}
            createdAt={new Date(post.createdAt)}
          />
        ))}
        <InfinitePosts orderBy="likesCount" sortBy="desc" limit={limit} />
      </div>
    </div>
  );
};

export default TrendPage;
