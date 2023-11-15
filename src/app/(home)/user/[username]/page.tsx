import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { prisma } from '@/app/prisma';
import Post from '@/components/Post';
import UserFollowButton from '@/components/UserFollowButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const UserPage = async ({
  searchParams,
  params,
}: {
  searchParams: { [key: string]: string };
  params: { username: string };
}) => {
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { username: params.username },
    include: { followedBy: true, following: true },
  });

  if (!user)
    return (
      <div className="h-full text-center p-4 border-r flex flex-col items-center justify-center">
        <span className="text-6xl mb-4">🤔</span>
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-lg mb-4">User not found</p>
        <Link href="/">
          <Button>Go home</Button>
        </Link>
      </div>
    );

  if (session && session.user.id === user.id) return redirect('/profile');

  const postsCount = await prisma.post.count({ where: { authorId: user.id } });
  const commentsCount = await prisma.comment.count({
    where: { authorId: user.id },
  });

  const page = Number(searchParams.page) || 1;
  const limit = 20;
  const maxPage = Math.ceil(postsCount / limit);

  const posts = await prisma.post.findMany({
    where: { authorId: user.id },
    include: {
      author: { select: { id: true, avatar: true, username: true } },
      comments: { include: { author: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
  });

  return (
    <div className="border-r h-full">
      <div className="border-b p-4">
        <h1 className="text-2xl">User Profile</h1>
      </div>
      <div className="p-4 flex">
        <div className="w-48 h-48 flex-shrink-0 mr-4">
          <Avatar className="w-full h-full text-2xl">
            {user.avatar && <AvatarImage src={user.avatar} />}
            <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
        <div className="w-full flex flex-col">
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Information</h3>
            <div className="max-w-sm grid grid-cols-3">
              <p>Username</p>
              <span className="text-center">:</span>
              <p className="text-primary text-right">{user.username}</p>
            </div>
          </div>
          <div className="w-full max-w-sm grid grid-cols-3 gap-4 mb-4">
            <div className="px-8 p-4 rounded-lg bg-primary-foreground flex flex-col items-center text-center">
              <strong className="text-4xl font-medium leading-none text-primary">
                {user.followedBy.length}
              </strong>
              <sub className="uppercase text-xs leading-none">followers</sub>
            </div>
            <div className="px-8 p-4 rounded-lg bg-primary-foreground flex flex-col items-center text-center">
              <strong className="text-4xl font-medium leading-none text-primary">
                {user.following.length}
              </strong>
              <sub className="uppercase text-xs leading-none">following</sub>
            </div>
            <div className="px-8 p-4 rounded-lg bg-primary-foreground flex flex-col items-center text-center">
              <strong className="text-4xl font-medium leading-none text-primary">
                {postsCount}
              </strong>
              <sub className="uppercase text-xs leading-none">posts</sub>
            </div>
          </div>
          {session && (
            <div className="flex">
              <UserFollowButton session={session} user={user} />
            </div>
          )}
        </div>
      </div>
      <div className="p-4 border-t">
        <h1 className="text-2xl mb-4">Posts</h1>
        <div className="flex flex-col gap-4">
          {postsCount === 0 && <p>User haven&apos;t any posts yet</p>}
          {posts.map((post) => (
            <Post key={post.id} {...post} />
          ))}
          <div className="flex gap-2">
            <Link
              href={page <= 1 ? '#' : `/user/${user.username}?page=${page - 1}`}
            >
              <Button
                className="w-8 h-8"
                size="icon"
                variant="secondary"
                disabled={page <= 1}
              >
                <ChevronLeftIcon size={16} />
              </Button>
            </Link>
            {[...Array(maxPage)].map((_, i) => (
              <Link key={i} href={`/user/${user.username}?page=${i + 1}`}>
                <Button
                  className="w-8 h-8 text-xs"
                  size="icon"
                  variant={page === i + 1 ? 'default' : 'secondary'}
                >
                  {i + 1}
                </Button>
              </Link>
            ))}
            <Link
              href={
                page >= maxPage
                  ? '#'
                  : `/user/${user.username}?page=${page + 1}`
              }
            >
              <Button
                className="w-8 h-8"
                size="icon"
                variant="secondary"
                disabled={page >= maxPage}
              >
                <ChevronRightIcon size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
