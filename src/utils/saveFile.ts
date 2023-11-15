import path from 'path';
import fs from 'fs/promises';

type Options = {
  fileName?: string;
};

export const saveFile = async (file: File, options?: Options) => {
  const uploadPath = path.join(process.cwd(), 'public/upload');
  const fileName = options?.fileName || Date.now();

  try {
    const fileArrayBuffer = await file.arrayBuffer();
    const fileExtension = path.extname(file.name);

    await fs.writeFile(
      path.join(uploadPath, `${fileName}${fileExtension}`),
      Buffer.from(fileArrayBuffer)
    );

    return {
      fileName: `${fileName}${fileExtension}`,
      url: `/upload/${fileName}${fileExtension}`,
      originalname: file.name,
      size: file.size,
      mimetype: file.type,
    };
  } catch (error) {
    console.log(
      `[${new Date().toLocaleString()}][ERROR] Save file error\n`,
      error
    );
    return false;
  }
};
