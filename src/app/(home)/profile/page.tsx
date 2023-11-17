import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import { prisma } from '@/app/prisma';
import {
  Post,
  ProfileAvatar,
  UserFollowers,
  UserFollowing,
} from '@/components';
import { Button } from '@/components/ui/button';
import { getSession } from '@/utils/getSession';

const ProfilePage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) => {
  const session = await getSession();
  if (!session) return redirect('/auth/sign-in');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { following: true, followedBy: true },
  });
  if (!user) return redirect('/auth/sign-out');

  const postsCount = await prisma.post.count({ where: { authorId: user.id } });

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
        <h1 className="text-2xl">My Profile</h1>
      </div>
      <div className="p-4 flex">
        <ProfileAvatar
          className="mr-4 flex-shrink-0"
          avatar={user.avatar}
          username={user.username}
        />
        <div className="w-full flex flex-col">
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">My Information</h3>
            <div className="max-w-sm grid grid-cols-3">
              <p>Username</p>
              <span className="text-center">:</span>
              <p className="text-primary text-right">{user.username}</p>
              <p>E-Mail</p>
              <span className="text-center">:</span>
              <p className="text-primary text-right">{user.email}</p>
            </div>
          </div>
          <div className="w-full max-w-sm grid grid-cols-3 gap-4">
            <UserFollowers followers={user.followedBy} />
            <UserFollowing following={user.following} />
            <div className="px-8 p-4 rounded-lg bg-primary-foreground flex flex-col items-center text-center">
              <strong className="text-4xl font-medium leading-none text-primary">
                {postsCount}
              </strong>
              <sub className="uppercase text-xs leading-none">posts</sub>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 border-t">
        <h1 className="text-2xl mb-4">My Posts</h1>
        <div className="flex flex-col gap-4">
          {postsCount === 0 && <p>You don&apos;t have any posts yet</p>}
          {posts.map((post) => (
            <Post key={post.id} {...post} />
          ))}
          {postsCount > limit && (
            <div className="flex gap-2">
              <Link href={page <= 1 ? '' : `/profile?page=${page - 1}`}>
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
                <Link key={i} href={`/profile?page=${i + 1}`}>
                  <Button
                    className="w-8 h-8 text-xs"
                    size="icon"
                    variant={page === i + 1 ? 'default' : 'secondary'}
                  >
                    {i + 1}
                  </Button>
                </Link>
              ))}
              <Link href={page >= maxPage ? '' : `/profile?page=${page + 1}`}>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
