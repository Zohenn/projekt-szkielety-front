import { useAuthStore } from '../store/authStore';
import { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children }: { children: ReactElement }) {
  const isSignedIn = useAuthStore(state => state.isSignedIn);
  const location = useLocation();

  return (
    isSignedIn() ? children : <Navigate to='/logowanie' replace state={{ ref: location }}/>
  )
}
