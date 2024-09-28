import { IUser } from './User';

export interface Login {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface LoginResponse extends TokenResponse {
  user: IUser;
}
