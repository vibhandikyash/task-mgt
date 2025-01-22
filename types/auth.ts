export type UserRole = 'ADMIN' | 'USER';

export const USER_ROLES: UserRole[] = ['ADMIN', 'USER'];

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthPayload {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
    };
}

export interface Context {
  user?: User | null;
  token?: string;
} 