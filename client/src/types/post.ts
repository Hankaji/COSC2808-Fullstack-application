export interface Post {
  _id: string;
  user: User;
  group_id: null;
  content: string;
  images: string[];
  visibility: string;
  reactions: any[];
  comments: Comment[];
  editHistory: any[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface Comment {
  author_id: User;
  content: string;
  reactions: any[];
  createdAt: Date;
  editHistory: any[];
  _id: string;
}

export interface User {
  _id: string;
  username: string;
  displayName: string;
  virtualProfileImage: string;
  id: string;
}
