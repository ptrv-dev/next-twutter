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

    const comment = await prisma.comment.findUnique({
      where: { id: Number(params.id) },
      include: { author: { select: { id: true } } },
    });
    if (!comment)
      return NextResponse.json(
        { status: 'error', code: 404, message: 'Comment not found' },
        { status: 404 }
      );

    if (session.user.id !== comment.author.id)
      return NextResponse.json(
        { status: 'error', code: 403, message: 'Forbidden' },
        { status: 403 }
      );

    await prisma.comment.delete({ where: { id: comment.id } });

    return NextResponse.json({
      status: 'success',
      code: 200,
      message: 'Comment deleted',
      data: comment,
    });
  } catch (error) {
    console.error('[ERROR:API] DELETE /api/comment/[id]\n', error);
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
