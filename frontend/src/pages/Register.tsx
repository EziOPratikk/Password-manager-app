import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import TextFormField from '../components/UI/TextFormField.tsx';
import NotificationSnackbar from '../components/UI/NotificationSnackbar.tsx';
import { postRequest } from '../utils/http.ts';
import { BASE_URL } from '../utils/constants.ts';
import { useSnackbar } from '../utils/hooks.ts';

import LoginIcon from '@mui/icons-material/Login';

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const {
    showSnackbar,
    closeSnackbar,
    snackbarMessage,
    snackbarSeverity,
    isSnackbarOpen,
  } = useSnackbar(); // * custom useSnackbar hook

  function registerUser(email: string, password: string) {
    setIsLoading(true);
    const userCredentials = {
      email,
      password,
    };

    postRequest(`${BASE_URL}/register/`, userCredentials)
      .then((response) => {
        if (response.message === 'invalid email address')
          showSnackbar('Invalid email address', 'error');

        if (response.message === 'password should be at least 8 characters')
          showSnackbar('Password should be at least 8 characters', 'error');

        if (response.message === 'user with this email already exists')
          showSnackbar('Email is already taken!', 'error');

        if (response.message === 'user registered successfully') {
          showSnackbar('User registered successfully', 'success');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }

        if (response.message === 'user registration failed')
          showSnackbar('Failed to register!', 'error');
      })
      .catch(() => showSnackbar('Unexpected error occurred!', 'error'))
      .finally(() => {
        setIsLoading(false);
        closeSnackbar();
      });
  }

  return (
    <section className='h-96 flex flex-col justify-center items-center'>
      <h1 className='text-center text-xl font-bold mb-4'>Register</h1>
      <TextFormField
        type='authentication'
        onSave={registerUser}
        buttonLabel='Register'
        buttonIcon={<LoginIcon />}
        loading={isLoading}
      />
      <NotificationSnackbar
        isOpen={isSnackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </section>
  );
}
