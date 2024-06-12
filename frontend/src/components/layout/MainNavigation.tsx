import { Link, useLocation, useNavigate } from 'react-router-dom';

import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import pwdManagerIcon from '../../assets/images/password-manager.png';
import NotificationSnackbar from '../UI/NotificationSnackbar.tsx';
import { useSnackbar } from '../../utils/hooks.ts';
import { useAuthContext } from '../../store/auth-context.tsx';
import { useThemeContext } from '../../store/theme-context.tsx';

export default function MainNavigation() {
  const location = useLocation();
  const routeName = location.pathname;

  const navigate = useNavigate();

  const { logout, isAuthenticated } = useAuthContext();

  const { mode, toggleTheme } = useThemeContext();

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
    <header
      className={`shadow-md flex py-4 pl-12 justify-around items-center flex-wrap ${
        mode === 'dark' && 'bg-gray-800 text-white shadow-sm shadow-white'
      }`}
    >
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
          {isAuthenticated && (
            <li
              className={`hover:font-bold cursor-pointer ${
                routeName === '/' && 'font-extrabold text-[1.1rem]'
              }`}
            >
              <Link to='/'>Home</Link>
            </li>
          )}
          {!isAuthenticated ? (
            <li
              className={`hover:font-bold cursor-pointer ${
                routeName === '/login' && 'font-extrabold text-[1.1rem]'
              }`}
            >
              <Link to='/login'>Login</Link>
            </li>
          ) : (
            <li
              className='hover:font-bold cursor-pointer'
              onClick={handleLogout}
            >
              Logout
            </li>
          )}
          <IconButton
            sx={{ ml: 1 }}
            onClick={() => toggleTheme()}
            color='inherit'
          >
            {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
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