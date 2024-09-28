import { Role } from './enum';

export interface IUser {
  id: number;
  username: string;
  email: string;
  role: Role;
  avatar_url: string;
  created_at: string;
  update_at: string;
}
