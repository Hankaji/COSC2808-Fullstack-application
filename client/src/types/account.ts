import { Account } from '.';

export function convertFetchDataToAccount(data: {
  _id: string;
  username: string;
  displayName: string;
  email: string;
  virtualProfileImage?: string;
}): Account {
  return {
    id: data._id,
    username: data.username,
    displayName: data.displayName,
    imgUrl: data.virtualProfileImage,
  };
}
