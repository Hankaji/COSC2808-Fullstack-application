import { log } from 'console';
import { CloudCog } from 'lucide-react';
import { parseBasicUser, User } from './post';

export interface Group {
  id: string;
  name: string;
  description: string;
  visibility: GroupVisibility;
  groupImage?: string;
  coverImage?: string;
  admins: User[];
  members: User[];
}

export enum GroupVisibility {
  PUBLIC,
  PRIVATE,
}

export const parseGroup = (data: any) => {
  return {
    id: data._id,
    name: data.name,
    description: data.description,
    visibility:
      GroupVisibility[
        (
          data.visibility as string
        ).toUpperCase() as keyof typeof GroupVisibility
      ],
    groupImage: data.virtualGroupImage,
    coverImage: data.virtualCoverImage,
    admins: data.admins,
    members: (data.members as any[]).map((mem) => parseBasicUser(mem)),
  } as Group;
};
