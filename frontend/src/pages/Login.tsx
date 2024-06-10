import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';

import TextFormField from '../components/UI/TextFormField.tsx';
import NotificationSnackbar from '../components/UI/NotificationSnackbar.tsx';
import { postRequest } from '../utils/http.ts';
import { BASE_URL } from '../utils/constants.ts';
import { useSnackbar } from '../utils/hooks.ts';
import { useAuthContext } from '../store/auth-context.tsx';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const {
    showSnackbar,
    closeSnackbar,
    snackbarMessage,
    snackbarSeverity,
    isSnackbarOpen,
  } = useSnackbar();

  const { login } = useAuthContext();

  function loginUser(email: string, password: string) {
    setIsLoading(true);

    const userCredentials = {
      email,
      password,
    };

    postRequest(`${BASE_URL}/login`, userCredentials)
      .then((response) => {
        if (response.message === 'invalid email or password') {
          showSnackbar('Invalid email or password', 'error');
        }

        if (response.message === 'user with this email does not exist') {
          showSnackbar('User with this email does not exist', 'error');
        }

        if (response.message === 'user logged in successfully') {
          login(userCredentials.email, response.token);

          showSnackbar('Logged in successfully', 'success');
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 2000);
        }
      })
      .catch(() => showSnackbar('Unexpected error occurred!', 'error'))
      .finally(() => {
        setIsLoading(false);
        closeSnackbar();
      });
  }

  return (
    <section className='h-96 flex flex-col justify-center items-center'>
      <h1 className='text-center text-xl font-bold mb-4'>Login</h1>
      <TextFormField
        type='authentication'
        onSave={loginUser}
        buttonLabel='Login'
        buttonIcon={<LoginIcon />}
        loading={isLoading}
      />
      <Link to='/register'>
        <Button variant='text' size='small'>
          Don't have an account?
        </Button>
      </Link>
      <NotificationSnackbar
        isOpen={isSnackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </section>
  );
}