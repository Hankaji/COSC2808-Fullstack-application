export type Account = {
  id: string;
  username: string;
  displayName: string;
  imgUrl?: string;
  isSuspended?: boolean;
};

export enum NotificationType {
  FRIEND_REQUEST = 'FRIEND_REQUEST',
  FRIEND_REQUEST_ACCEPTED = 'FRIEND_REQUEST_ACCEPTED',
  POST_COMMENT = 'POST_COMMENT',
  POST_REACTION = 'POST_REACTION',
  GROUP_CREATION_APPROVAL = 'GROUP_CREATION_APPROVAL',
  GROUP_MEMBER_REQUEST_APPROVAL = 'GROUP_MEMBER_REQUEST_APPROVAL',
}

export type Notification = {
  id: string;
  type: NotificationType;
  message: string;
  createdAt: Date;
  isRead: boolean;
};

export type Group = {
  id: string;
  name: string;
  description: string;
  visibility: 'public' | 'private';
  imgUrl: string;
};
