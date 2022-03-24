import { useAuthStore } from '../store/authStore';
import { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children, resolve }: { children?: ReactElement, resolve?: () => ReactElement }) {
  const { isSignedIn } = useAuthStore();
  const location = useLocation();
  return (
    isSignedIn() ? (children ?? resolve!()) : <Navigate to='/logowanie' replace state={{ ref: location }}/>
  )
}
