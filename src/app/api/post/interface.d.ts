export interface IGetPosts {
  status: string;
  code: number;
  message: string;
  data: IPost[];
}

export interface IPost {
  id: number;
  authorId: number;
  text: string;
  likes: number[];
  createdAt: string;
  author: IAuthor;
}

export interface IAuthor {
  id: number;
  username: string;
  avatar: string | null;
}