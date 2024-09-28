import { Role } from './enum';
import { PaginationData } from './Shared';

export interface IUser {
  id: number;
  username: string;
  email: string;
  role: Role;
  avatar_url: string;
  created_at: Date;
  updated_at: Date;
}

export type IUsersList = PaginationData<IUser[]>;
