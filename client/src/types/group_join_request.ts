import { parseRequestStatus, RequestStatus } from './group_creation_request';
import { parseBasicUser, User } from './post';

export interface GroupJoinRequest {
  id: string;
  user: User;
  requestedDate: Date;
  status: RequestStatus;
}

export const parseGroupJoinReq = (data: any) => {
  return {
    id: data.id,
    user: parseBasicUser(data.user),
    requestedDate: new Date(data.createdAt),
    status: parseRequestStatus(data.status),
  } as GroupJoinRequest;
};
