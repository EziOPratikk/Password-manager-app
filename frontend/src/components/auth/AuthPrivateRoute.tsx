import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { useAuthContext } from '../../store/auth-context.tsx';

type AuthPrivateRouteProps = {
  children: ReactNode;
};

export default function AuthPrivateRoute(props: AuthPrivateRouteProps) {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to='/login' />;
  }

  return props.children;
}