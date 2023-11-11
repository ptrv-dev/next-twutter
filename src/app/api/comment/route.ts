import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';
import { authOptions } from '../auth/[...nextauth]/options';
import { prisma } from '@/app/prisma';

const createCommentSchema = z.object({
  postId: z
    .number({ required_error: 'Post ID is required' })
    .min(0, 'Post ID must be a positive number'),
  text: z
    .string({ required_error: 'Text is required' })
    .min(4, 'Text must be at least 4 characters long')
    .max(2048, 'Text must be at most 2048 characters long'),
});
type CreateCommentSchemaType = z.infer<typeof createCommentSchema>;

export const POST = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user)
      return NextResponse.json(
        { status: 'error', code: 401, message: 'Unauthorized' },
        { status: 401 }
      );

    const json = (await req.json()) as CreateCommentSchemaType;
    createCommentSchema.parse(json);

    const post = await prisma.post.findUnique({ where: { id: json.postId } });
    if (!post)
      return NextResponse.json(
        { status: 'error', code: 404, message: 'Post not found' },
        { status: 404 }
      );

    const comment = await prisma.comment.create({
      data: {
        text: json.text,
        post: { connect: { id: post.id } },
        author: { connect: { id: session.user.id } },
      },
    });

    return NextResponse.json(
      {
        status: 'success',
        code: 201,
        message: 'Comment created',
        data: comment,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => err.message);
      return NextResponse.json(
        {
          status: 'error',
          code: 400,
          message: 'Validation error',
          errors,
        },
        { status: 400 }
      );
    }

    console.error('[ERROR:API] POST /api/comment\n', error);
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
