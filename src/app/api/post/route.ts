import { prisma } from '@/app/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';
import { authOptions } from '../auth/[...nextauth]/options';

export const GET = async (req: NextRequest, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: { select: { id: true, username: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(
      {
        status: 'success',
        code: 200,
        message: 'Posts retrieved',
        data: posts,
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

export const postCreateSchema = z.object({
  text: z
    .string({ required_error: 'Text is required' })
    .min(4, 'Text must be at least 4 characters long')
    .max(2048, 'Text must be at most 2048 characters long'),
});
export type postCreateType = z.infer<typeof postCreateSchema>;

export const POST = async (req: NextRequest, res: Response) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user)
      return NextResponse.json(
        { status: 'error', code: 401, message: 'Unauthorized' },
        { status: 401 }
      );

    const json = await req.json();

    const { success } = await postCreateSchema.safeParseAsync(json);
    if (!success)
      return NextResponse.json(
        {
          status: 'error',
          code: 400,
          message: 'Validation error',
        },
        { status: 400 }
      );

    const post = await prisma.post.create({
      data: {
        text: json.text,
        author: { connect: { email: session.user.email! } },
      },
    });
    return NextResponse.json(
      {
        status: 'success',
        code: 201,
        message: 'Post created',
        data: post,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error('[ERROR:API] POST /api/post\n', error);
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