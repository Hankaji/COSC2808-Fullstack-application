import { Account } from '.';

export function parseAccount(data: {
  _id: string;
  username: string;
  displayName: string;
  email: string;
  virtualProfileImage?: string;
  status: string;
}): Account {
  return {
    id: data._id,
    username: data.username,
    displayName: data.displayName,
    imgUrl: data.virtualProfileImage,
    isSuspended: data.status === 'Suspended',
  };
}
