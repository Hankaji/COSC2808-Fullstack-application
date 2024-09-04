export interface Posts {
  _id: string;
  user: User;
  group_id: null;
  content: string;
  images: string[];
  visibility: string;
  reactions: Reaction[];
  comments: Comment[];
  editHistory: any[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface Comment {
  author_id: User;
  content: string;
  reactions: Reaction[];
  createdAt: Date;
  editHistory: any[];
  _id: string;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  profileImage?: string;
}

export type Reaction = {
  author: User;
  type: string;
};

export enum ReactionTypes {
  LIKE = "LIKE",
  LOVE = "LOVE",
  HAHA = "HAHA",
  ANGRY = "ANGRY",
  NULL = "NULL",
}

export const parseBasicUser = (data: any) => {
  return {
    id: data._id,
    username: data.username,
    displayName: data.displayName,
    profileImage: data.virtualProfileImage,
  } as User;
};
