import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { useAuthContext } from '../store/auth-context';

type PrivateRouteProps = {
  children: ReactNode;
};

export default function PrivateRoute(props: PrivateRouteProps) {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to='/login' />;
  }

  return props.children;
}