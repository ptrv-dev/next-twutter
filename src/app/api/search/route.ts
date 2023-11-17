import { prisma } from '@/app/prisma';
import { getSession } from '@/utils/getSession';
import { NextRequest, NextResponse } from 'next/server';

export type User = {
  id: number;
  avatar: string | null;
  username: string;
};

export type Comment = {
  id: number;
  text: string;
  author: User;
  likes: number[];
  createdAt: Date;
};

export type Post = {
  id: number;
  text: string;
  image: string | null;
  author: User;
  likes: number[];
  likesCount: number;
  comments: Comment[];
  createdAt: Date;
};

export interface SearchResponse {
  status: 'error' | 'success';
  code: number;
  message: string;
  data: {
    users: User[];
    posts: Post[];
    usersCount: number;
    postsCount: number;
  };
}

export const GET = async (req: NextRequest) => {
  try {
    const session = await getSession();
    if (!session || !session.user)
      return NextResponse.json(
        { status: 'error', code: 401, message: 'Unauthorized' },
        { status: 401 }
      );

    const params = new URL(req.url).searchParams;
    const query = params.get('query');
    if (!query)
      return NextResponse.json(
        {
          status: 'error',
          code: 400,
          message: 'Query parameter must be provided',
        },
        { status: 400 }
      );

    const page = Number(params.get('page')) || 1;
    const limit = Number(params.get('limit')) || 20;

    const usersCount = await prisma.user.count({
      where: { username: { contains: query } },
    });
    const postsCount = await prisma.post.count({
      where: { text: { contains: query } },
    });

    const users = await prisma.user.findMany({
      where: { username: { contains: query } },
      select: { id: true, username: true, avatar: true },
      take: limit,
      skip: limit * (page - 1),
    });
    const posts = await prisma.post.findMany({
      where: { text: { contains: query } },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                avatar: true,
                username: true,
              },
            },
          },
        },
      },
      take: limit,
      skip: limit * (page - 1),
    });

    return NextResponse.json({
      status: 'success',
      code: 200,
      message: 'Search data retrieved',
      data: {
        users,
        posts,
        usersCount,
        postsCount,
      },
    });
  } catch (error) {
    console.error('[ERROR:API] GET /api/search\n', error);
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
