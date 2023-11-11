export interface IUploadResponse {
  status: string;
  code: number;
  message: string;
  data: IUploadedFile;
}

export interface IUploadedFile {
  filename: string;
  url: string;
  originalname: string;
  size: number;
  mimetype: string;
}
