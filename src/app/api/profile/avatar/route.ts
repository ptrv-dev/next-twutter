import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
import { prisma } from '@/app/prisma';

const FORM_ITEM_NAME = 'file';
const UPLOAD_PATH = path.join(process.cwd(), 'public/upload/avatar');

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user)
      return NextResponse.json(
        { status: 'error', code: 401, message: 'Unauthorized' },
        { status: 401 }
      );

    const formData = await req.formData();

    const f = formData.get(FORM_ITEM_NAME);
    if (!f)
      return NextResponse.json(
        { status: 'error', code: 400, message: 'Bad request' },
        { status: 400 }
      );

    const file = f as File;
    const fileArrayBuffer = await file.arrayBuffer();
    const fileExtension = path.extname(file.name);
    const fileName = `${Date.now()}${fileExtension}`;

    await fs.writeFile(
      path.join(UPLOAD_PATH, fileName),
      Buffer.from(fileArrayBuffer)
    );

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (user?.avatar) {
      await fs.unlink(path.join(process.cwd(), 'public', user.avatar));
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { avatar: `/upload/avatar/${fileName}` },
    });

    return NextResponse.json({
      status: 'success',
      code: 201,
      message: 'Avatar updated',
      data: {
        filename: fileName,
        url: `/upload/avatar/${fileName}`,
        originalname: file.name,
        size: file.size,
        mimetype: file.type,
      },
    });
  } catch (error) {
    console.error('[ERROR:API] POST /api/auth/avatar\n', error);
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
