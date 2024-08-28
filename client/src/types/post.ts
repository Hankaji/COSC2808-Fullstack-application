export interface Post {
  _id: string;
  user_id: UserID;
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
  author_id: AuthorID;
  content: string;
  reactions: any[];
  createdAt: Date;
  editHistory: any[];
  _id: string;
}

export interface AuthorID {
  _id: string;
  username: string;
  displayName: string;
  virtualProfileImage: string;
  id: string;
}

export interface UserID {
  _id: string;
  username: string;
  displayName: string;
  id: string;
}
