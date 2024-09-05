export interface Posts {
  id: string;
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
  id: string;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  profileImage?: string;
}

export type Reaction = {
  author: User;
  type: ReactionTypes;
};

export enum ReactionTypes {
  LIKE = "LIKE",
  LOVE = "LOVE",
  HAHA = "HAHA",
  ANGRY = "ANGRY",
  NULL = "NULL",
}

export const parsePost = (data: any) => {
  return {
    id: data._id,
    user: parseBasicUser(data.user),
    group_id: data.group_id,
    content: data.content,
    images: data.images,
    visibility: data.visibility,
    reactions: (data.reactions as string[]).map((react) =>
      parseReaction(react),
    ),
    comments: (data.comments as any[]).map((cmt) => parseComment(cmt)),
    editHistory: data.editHistory,
    createdAt: new Date(data.createdAt),
  } as Posts;
};

export const parseComment = (data: any) => {
  return {
    author_id: parseBasicUser(data.author_id),
    content: data.content,
    reactions: (data.reactions as string[]).map((react) =>
      parseReaction(react),
    ),
    createdAt: new Date(data.createdAt),
    editHistory: data.editHistory,
    id: data._id,
  } as Comment;
};

export const parseReaction = (data: any) => {
  return {
    author: parseBasicUser(data.author),
    type: ReactionTypes[data.type.toUpperCase() as keyof typeof ReactionTypes],
  } as Reaction;
};

export const parseBasicUser = (data: any) => {
  return {
    id: data._id,
    username: data.username,
    displayName: data.displayName,
    profileImage: data.virtualProfileImage,
  } as User;
};
