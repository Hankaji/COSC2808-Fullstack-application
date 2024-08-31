import { Group, parseGroup } from './group';

export interface GroupCreationRequest {
  id: string;
  user_id: string;
  status: RequestStatus;
  group: Group;
}

export enum RequestStatus {
  PENDING,
  ACCEPTED,
  REJECTED,
}

export const parseGroupCreationRequest = (data: any) => {
  return {
    id: data._id,
    user_id: data.user_id,
    status:
      RequestStatus[
        (data.status as string).toUpperCase() as keyof typeof RequestStatus
      ],
    group: parseGroup(data.group),
  } as GroupCreationRequest;
};
