import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { prisma } from '@/app/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (
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

    const { id } = params;

    const post = await prisma.post.findUnique({ where: { id: Number(id) } });
    if (!post)
      return NextResponse.json(
        { status: 'error', code: 404, message: 'Post not found' },
        { status: 404 }
      );

    let likes = post.likes;
    let likesCount = post.likesCount;
    if (likes.includes(session.user.id)) {
      likes = likes.filter((like) => like !== session.user.id);
      likesCount--;
    } else {
      likes.push(session.user.id);
      likesCount++;
    }

    const updatedPost = await prisma.post.update({
      where: { id: Number(id) },
      data: { likes, likesCount },
    });

    return NextResponse.json(
      {
        status: 'success',
        code: 200,
        message: 'Post updated',
        data: updatedPost,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[ERROR:API] GET /api/post\n', error);
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
