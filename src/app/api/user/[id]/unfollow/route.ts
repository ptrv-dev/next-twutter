import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { prisma } from '@/app/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;

    const session = await getServerSession(authOptions);
    if (!session || !session.user)
      return NextResponse.json(
        { status: 'error', code: 401, message: 'Unauthorized' },
        { status: 401 }
      );

    const self = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { following: true },
    });
    if (!self)
      return NextResponse.json(
        { status: 'error', code: 401, message: 'Unauthorized' },
        { status: 401 }
      );

    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: { followedBy: true },
    });
    if (!user)
      return NextResponse.json({
        status: 'error',
        code: 404,
        message: 'User not found',
      });

    if (user.id === self.id)
      return NextResponse.json({
        status: 'error',
        code: 400,
        message: 'You cannot subscribe yourself',
      });

    if (
      self.following.findIndex((following) => following.id === user.id) === -1
    )
      return NextResponse.json({
        status: 'error',
        code: 400,
        message: "You haven't followed this user yet",
      });

    await prisma.user.update({
      where: { id: self.id },
      data: { following: { disconnect: { id: user.id } } },
    });
    await prisma.user.update({
      where: { id: user.id },
      data: { followedBy: { disconnect: { id: self.id } } },
    });

    return NextResponse.json({
      status: 'success',
      code: 201,
      message: 'User unfollowed',
    });
  } catch (error) {
    console.error('[ERROR:API] POST /api/user/[id]/unfollow\n', error);
    return NextResponse.json(
      {
        status: 'error',
        code: 500,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
};
