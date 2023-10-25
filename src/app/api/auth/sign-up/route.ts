import { prisma } from '@/app/prisma';
import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';
import * as bcrypt from 'bcrypt';

const signUpSchema = z.object({
  username: z
    .string({ required_error: 'Username is required' })
    .min(3, 'Username must be at least 3 characters long')
    .max(32, 'Username must be at most 32 characters long'),
  email: z
    .string({ required_error: 'Email is required' })
    .email('Email is invalid'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters long')
    .max(64, 'Password must be at most 64 characters long'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    signUpSchema.parse(body);

    let candidate = await prisma.user.findUnique({
      where: { username: body.username },
    });
    if (candidate)
      return NextResponse.json(
        { status: 'error', code: 409, message: 'Username is already taken' },
        { status: 409 }
      );

    candidate = await prisma.user.findUnique({
      where: { email: body.email },
    });
    if (candidate)
      return NextResponse.json(
        { status: 'error', code: 409, message: 'Email is already taken' },
        { status: 409 }
      );

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        username: body.username,
        email: body.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        avatar: true,
        username: true,
        email: true,
      },
    });

    return NextResponse.json(
      { status: 'success', code: 201, message: 'User created', data: user },
      { status: 201 }
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

    console.error('[ERROR:API] POST /api/auth/sign-up\n', error);
    return NextResponse.json(
      {
        status: 'error',
        code: 500,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
