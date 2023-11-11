import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import { prisma } from '@/app/prisma';

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user)
      return NextResponse.json(
        { status: 'error', code: 401, message: 'Unauthorized' },
        { status: 401 }
      );

    const post = await prisma.post.findUnique({
      where: { id: Number(params.id) },
      include: { author: { select: { id: true } } },
    });
    if (!post)
      return NextResponse.json(
        { status: 'error', code: 404, message: 'Post not found' },
        { status: 404 }
      );

    if (session.user.id !== post.author.id)
      return NextResponse.json(
        { status: 'error', code: 403, message: 'Forbidden' },
        { status: 403 }
      );

    await prisma.post.delete({ where: { id: post.id } });

    return NextResponse.json({
      status: 'success',
      code: 200,
      message: 'Post deleted',
      data: post,
    });
  } catch (error) {
    console.error('[ERROR:API] DELETE /api/post/[id]\n', error);
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
