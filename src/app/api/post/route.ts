import { prisma } from '@/app/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';
import { authOptions } from '../auth/[...nextauth]/options';
import { saveFile } from '@/utils/saveFile';

export const GET = async (req: NextRequest) => {
  try {
    const query = new URL(req.url).searchParams;
    const skip = Number(query.get('skip')) || 0;
    const limit = Number(query.get('limit')) || 10;
    const orderBy = query.get('orderBy') || 'createdAt';
    const sortBy = query.get('sortBy')?.toLowerCase() || 'desc';

    const count = await prisma.post.count();
    const posts = await prisma.post.findMany({
      include: {
        author: { select: { id: true, username: true, avatar: true } },
        comments: {
          include: {
            author: { select: { id: true, username: true, avatar: true } },
          },
        },
      },
      orderBy: { [orderBy]: sortBy },
      skip,
      take: limit,
    });
    return NextResponse.json(
      {
        status: 'success',
        code: 200,
        message: 'Posts retrieved',
        data: posts,
        count,
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

const postCreateSchema = z.object({
  text: z
    .string({ required_error: 'Text is required' })
    .min(4, 'Text must be at least 4 characters long')
    .max(2048, 'Text must be at most 2048 characters long'),
});

export const POST = async (req: NextRequest, res: Response) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user)
      return NextResponse.json(
        { status: 'error', code: 401, message: 'Unauthorized' },
        { status: 401 }
      );

    const formData = await req.formData();
    const formDataObject = Object.fromEntries(formData.entries());
    postCreateSchema.parse(formDataObject);

    const text = formData.get('text') as string;
    const image = formData.get('image') as File | undefined;
    let uploadedImage = image ? await saveFile(image) : undefined;
    const imageUrl = uploadedImage ? uploadedImage.url : undefined;

    const post = await prisma.post.create({
      data: {
        image: imageUrl || null,
        text,
        author: { connect: { id: session.user.id } },
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
