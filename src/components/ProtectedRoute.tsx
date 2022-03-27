import { useAuthStore, User } from '../store/authStore';
import { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children?: ReactElement;
  resolve?: () => ReactElement;
  check?: (user: User) => boolean;
}

export default function ProtectedRoute({ children, resolve, check }: ProtectedRouteProps) {
  const { isSignedIn, user } = useAuthStore();
  const location = useLocation();
  return (
    (isSignedIn() && (check?.(user!) ?? true)) ?
      (children ?? resolve!()) :
      <Navigate to='/logowanie' replace state={{ ref: location }}/>
  )
}
