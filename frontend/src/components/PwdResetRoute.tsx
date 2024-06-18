import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

type PwdResetRouteProps = {
  children: ReactNode;
};

export default function PwdResetRoute(props: PwdResetRouteProps) {
  const recoveryEmail = localStorage.getItem('recoveryEmail');

  if (!recoveryEmail) {
    return <Navigate to='/forgot-password' />;
  }

  return props.children;
}