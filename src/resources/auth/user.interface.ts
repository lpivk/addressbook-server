export interface IUser {
  username: string;
  email: string;
  password: string;
  isActive: boolean;
  role: string;
  avatar: string;
  createdAt: Date;

  isValidPassword(password: string): Promise<boolean>;
}
