import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';

interface RoleBasedRenderProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export function RoleBasedRender({ children, allowedRoles = ['ADMIN'] }: RoleBasedRenderProps) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user?.role)) {
    return null;
  }

  return <>{children}</>;
} 