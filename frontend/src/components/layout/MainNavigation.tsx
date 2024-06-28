import { Fragment } from 'react/jsx-runtime';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useRef } from 'react';

import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';

import pwdManagerIcon from '../../assets/images/password-manager.png';
import NotificationSnackbar from '../UI/NotificationSnackbar.tsx';
import MenuItemModal from './MenuItemModal.tsx';
import { useSnackbar } from '../../utils/hooks.ts';
import { useAuthContext } from '../../store/auth-context.tsx';
import { useThemeContext } from '../../store/theme-context.tsx';
import { ModalHandle } from './MenuItemModal.tsx';

export default function MainNavigation() {
  const modalRef = useRef<ModalHandle>(null);

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

  const userEmail = JSON.parse(localStorage.getItem('email')!);
  const splittedUserEmail = userEmail && userEmail.split('@')[0];
  const username = '@' + splittedUserEmail;

  function handleLogout() {
    logout();
    showSnackbar('Logged out successfully', 'success');

    setTimeout(() => {
      closeSnackbar();
      navigate('/login', { replace: true });
    }, 2000);
  }

  function handleToggleModal() {
    modalRef.current?.toggleModal();
  }

  return (
    <header
      className={`fixed top-0 z-10 w-[100%] shadow-md flex py-4 pl-12 justify-around items-center transition-all ease-in duration-300  ${
        mode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'
      }`}
    >
      <div className='flex items-center gap-4'>
        <Link to='/'>
          <img
            src={pwdManagerIcon}
            alt='pwd manager icon'
            className='w-20 object-contain cursor-pointer hidden sm:inline'
          />
        </Link>
        <div>
          <h1 className='text-xl font-bold'>Password Manager</h1>
          <p className='text-gray-500'>Keep all your passwords in one place</p>
        </div>
      </div>
      <div>
        <ul className='flex gap-12 items-center'>
          <aside className='md:hidden'>
            <IconButton onClick={handleToggleModal}>
              <MenuIcon fontSize='large' />
            </IconButton>
          </aside>
          {isAuthenticated ? (
            <Fragment>
              <li
                className={`hidden md:inline hover:font-bold cursor-pointer ${
                  routeName === '/' && 'font-extrabold text-[1.1rem]'
                }`}
              >
                <Link to='/'>Home</Link>
              </li>
              <li
                className={`hidden md:inline hover:font-bold cursor-pointer ${
                  routeName === `/profile/${username}` &&
                  'font-extrabold text-[1.1rem]'
                }`}
              >
                <Link to={`/profile/${username}`}>Profile</Link>
              </li>
              <li
                className='hidden md:inline hover:font-bold cursor-pointer'
                onClick={handleLogout}
              >
                Logout
              </li>
            </Fragment>
          ) : (
            <li
              className={`hidden md:inline  hover:font-bold cursor-pointer ${
                routeName === '/login' && 'font-extrabold text-[1.1rem]'
              }`}
            >
              <Link to='/login'>Login</Link>
            </li>
          )}

          <div className='hidden md:block'>
            <IconButton onClick={toggleTheme} color='inherit'>
              {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
          </div>
        </ul>
      </div>
      <NotificationSnackbar
        isOpen={isSnackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
      <MenuItemModal
        ref={modalRef}
        isAuthenticated={isAuthenticated}
        mode={mode}
        routeName={routeName}
        username={username}
        onLogout={handleLogout}
        onToggleTheme={toggleTheme}
      />
    </header>
  );
}