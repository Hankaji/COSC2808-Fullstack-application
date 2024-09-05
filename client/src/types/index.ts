export type Account = {
  id: string;
  username: string;
  displayName: string;
  imgUrl?: string;
  isSuspended?: boolean;
};

export type FriendRequest = {
  id: string;
  acc: Account;
};

export type NotificationType =
  | 'User'
  | 'Group'
  | 'Post'
  | 'Comment'
  | 'Reaction';

export type Notification = {
  id: string;
  type: NotificationType;
  message: string;
  createdAt: string;
  isRead: boolean;
};

export type Group = {
  id: string;
  name: string;
  description: string;
  visibility: 'public' | 'private';
  imgUrl: string;
};
