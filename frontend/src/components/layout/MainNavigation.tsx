import { Link, useLocation, useNavigate } from 'react-router-dom';

import pwdManagerIcon from '../../assets/images/password-manager.png';
import NotificationSnackbar from '../UI/NotificationSnackbar.tsx';
import { useSnackbar } from '../../utils/hooks.ts';
import { useAuthContext } from '../../store/auth-context';

export default function MainNavigation() {
  const location = useLocation();
  const routeName = location.pathname;

  const navigate = useNavigate();

  const { logout, isAuthenticated } = useAuthContext();

  const {
    showSnackbar,
    closeSnackbar,
    snackbarMessage,
    snackbarSeverity,
    isSnackbarOpen,
  } = useSnackbar();

  function handleLogout() {
    logout();
    showSnackbar('Logged out successfully', 'success');

    setTimeout(() => {
      closeSnackbar();
      navigate('/login', { replace: true });
    }, 2000);
  }

  return (
    <header className='bg-white shadow-md flex py-4 pl-12 justify-around items-center flex-wrap'>
      <div className='flex items-center gap-4'>
        <Link to='/'>
          <img
            src={pwdManagerIcon}
            alt='pwd manager icon'
            className='w-20 object-contain cursor-pointer'
          />
        </Link>
        <div>
          <h1 className='text-xl font-bold'>Password Manager</h1>
          <p className='text-gray-500'>Keep all your passwords in one place</p>
        </div>
      </div>
      <div>
        <ul className='flex gap-12 items-center'>
          <li
            className={`hover:font-bold cursor-pointer ${
              routeName === '/' && 'font-extrabold text-[1.1rem]'
            }`}
          >
            <Link to='/'>Home</Link>
          </li>
          {!isAuthenticated && (
            <li
              className={`hover:font-bold cursor-pointer ${
                routeName === '/login' && 'font-extrabold text-[1.1rem]'
              }`}
            >
              <Link to='/login'>Login</Link>
            </li>
          )}
          {isAuthenticated && (
            <li
              className='hover:font-bold cursor-pointer'
              onClick={handleLogout}
            >
              Logout
            </li>
          )}
        </ul>
      </div>
      <NotificationSnackbar
        isOpen={isSnackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </header>
  );
}