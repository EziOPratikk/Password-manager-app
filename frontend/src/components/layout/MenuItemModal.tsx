import {
  type ElementType,
  Fragment,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import { Link } from 'react-router-dom';

import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export type ModalHandle = {
  toggleModal: () => void;
};

type MenuItemModalProps = {
  username: string;
  routeName: string;
  isAuthenticated: boolean;
  mode: string;
  onLogout: () => void;
  onToggleTheme: () => void;
};

const MenuItemModal = forwardRef<ModalHandle, MenuItemModalProps>(
  function MenuItemModal(props, ref) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    useImperativeHandle(ref, () => {
      return {
        toggleModal() {
          setIsModalOpen((prevValue) => !prevValue);
        },
      };
    });

    function renderMenuItem(
      routeName: string,
      MenuIcon: ElementType,
      label: string
    ) {
      return (
        <li
          className={` hover:font-bold cursor-pointer text-center hover:bg-slate-100 rounded-sm py-2 px-3 ${
            props.mode === 'dark' && 'hover:bg-slate-700'
          } ${props.routeName === routeName && 'font-extrabold text-[1.1rem]'}`}
        >
          <Link to={routeName}>
            <MenuIcon
              fontSize={`${props.routeName === routeName ? 'medium' : 'small'}`}
            />
            <p>{label}</p>
          </Link>
        </li>
      );
    }

    return (
      <ul
        className={`${
          !isModalOpen && 'opacity-0 pointer-events-none'
        } md:hidden flex flex-col justify-start items-center gap-4 shadow-sm absolute top-20 right-0 py-8 px-12 transition-all ease-in duration-300 ${
          props.mode === 'light' ? 'bg-white' : 'bg-slate-800'
        }`}
      >
        {props.isAuthenticated ? (
          <Fragment>
            {renderMenuItem('/', HomeIcon, 'Home')}
            {renderMenuItem(
              `/profile/${props.username}`,
              AccountCircleIcon,
              'Profile'
            )}
            <li
              className=' hover:font-bold cursor-pointer text-center'
              onClick={props.onLogout}
            >
              <LogoutIcon />
              <p>Logout</p>
            </li>
          </Fragment>
        ) : (
          renderMenuItem('/login', LoginIcon, 'Login')
        )}
        <IconButton onClick={props.onToggleTheme} color='inherit'>
          {props.mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
        </IconButton>
      </ul>
    );
  }
);

export default MenuItemModal;
