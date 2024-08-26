export interface User {
  username: string;
  displayName: string;
  email: string;
  status: string;
  posts: any[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  virtualProfileImage: string;
  id: string;
}
