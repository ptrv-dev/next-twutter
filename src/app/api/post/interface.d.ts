export interface IGetPosts {
  status: string;
  code: number;
  message: string;
  data: IPost[];
  count: number;
}

export interface IGetPost {
  status: string;
  code: number;
  data: IPost;
}

export interface IPost {
  id: number;
  authorId: number;
  text: string;
  likes: number[];
  comments: IComment[];
  createdAt: string;
  author: IAuthor;
}

export interface IAuthor {
  id: number;
  username: string;
  avatar: string | null;
}

export interface IComment {
  id: number;
  post: IPost;
  postId: number;
  author: IAuthor;
  authorId: number;
  likes: number[];
  text: string;
  createdAt: Date;
}
