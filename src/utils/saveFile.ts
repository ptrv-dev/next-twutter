import path from 'path';
import fs from 'fs/promises';

type Options = {
  fileName?: string;
  uploadPath?: string;
};

export const saveFile = async (
  file: File,
  options?: Options
): Promise<boolean> => {
  const uploadPath =
    options?.uploadPath || path.join(process.cwd(), 'public/upload');
  const fileName = options?.fileName || Date.now();

  try {
    const fileArrayBuffer = await file.arrayBuffer();
    const fileExtension = path.extname(file.name);

    await fs.writeFile(
      path.join(uploadPath, `${fileName}${fileExtension}`),
      Buffer.from(fileArrayBuffer)
    );

    return true;
  } catch (error) {
    console.log(
      `[${new Date().toLocaleString()}][ERROR] Save file error\n`,
      error
    );
    return false;
  }
};
