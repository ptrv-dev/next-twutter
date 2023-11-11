import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const FORM_ITEM_NAME = 'file';
const UPLOAD_PATH = path.join(process.cwd(), 'public/upload');

export async function POST(req: NextRequest) {
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

  return NextResponse.json({
    status: 'success',
    code: 201,
    message: 'File uploaded',
    data: {
      filename: fileName,
      url: `/upload/${fileName}`,
      originalname: file.name,
      size: file.size,
      mimetype: file.type,
    },
  });
}
