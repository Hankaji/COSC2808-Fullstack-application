export interface UserSession {
  userId: string;
  username: string;
  isAdmin: boolean;
}

export interface Auth {
  user?: UserSession;
}
