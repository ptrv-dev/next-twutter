import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { prisma } from '@/app/prisma';
import ProfileAvatar from '@/components/ProfileAvatar';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

const ProfilePage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return redirect('/auth/sign-in');

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return redirect('/auth/sign-in');

  const postsCount = await prisma.post.count({ where: { authorId: user.id } });
  const commentsCount = await prisma.comment.count({
    where: { authorId: user.id },
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
          <div className="w-full max-w-sm grid grid-cols-2 gap-4">
            <div className="px-8 p-4 rounded-lg bg-primary-foreground flex flex-col items-center text-center">
              <strong className="text-4xl font-medium leading-none text-primary">
                {postsCount}
              </strong>
              <sub className="uppercase text-xs leading-none">posts</sub>
            </div>
            <div className="px-8 p-4 rounded-lg bg-primary-foreground flex flex-col items-center text-center">
              <strong className="text-4xl font-medium leading-none text-primary">
                {commentsCount}
              </strong>
              <sub className="uppercase text-xs leading-none">comments</sub>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
