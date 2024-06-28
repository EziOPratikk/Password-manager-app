import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import InputField from '../components/UI/forgot password/InputField.tsx';
import NotificationSnackbar from '../components/UI/NotificationSnackbar.tsx';
import { useSnackbar } from '../utils/hooks.ts';
import { BASE_URL } from '../utils/constants.ts';
import { postRequest } from '../utils/http.ts';
import codeExpiredImg from '../assets/images/expired.png';

type RawResponseMessage = {
  message: string;
};

export default function ResetPassword() {
  const userEmail = localStorage.getItem('recoveryEmail') || '';
  const expirationTimeStr = localStorage.getItem('expireTime');
  const expirationTime = expirationTimeStr
    ? new Date(expirationTimeStr).getTime()
    : 0;

  const initialRemainingTime = Math.max(
    0,
    Math.floor((expirationTime - Date.now()) / 1000)
  );

  const [isLoading, setIsLoading] = useState(false);
  const [remainingTime, setRemainingTime] =
    useState<number>(initialRemainingTime);
  const [isSuccessResponse, setIsSuccessResponse] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(remainingTime);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [remainingTime]);

  const {
    showSnackbar,
    closeSnackbar,
    snackbarMessage,
    snackbarSeverity,
    isSnackbarOpen,
  } = useSnackbar();

  function sendPasswordResetCode(resetCode: string) {
    setIsLoading(true);

    postRequest(`${BASE_URL}/reset-password`, {
      email: userEmail,
      resetCode: resetCode,
    })
      .then((response: RawResponseMessage) => {
        if (response.message === 'valid reset code') {
          localStorage.removeItem('expireTime');
          setIsSuccessResponse(true);
        }

        if (response.message === 'invalid or expired reset code')
          return showSnackbar('Invalid or expired reset code', 'error');
      })
      .catch(() =>
        showSnackbar(
          'Unexpected error occurred while validating reset code',
          'error'
        )
      )
      .finally(() => {
        setIsLoading(false);
        closeSnackbar();
      });
  }

  function resetPassword(password: string) {
    setIsLoading(true);

    // * Patch Request
    fetch(`${BASE_URL}/reset-password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userEmail,
        newPassword: password,
      }),
    })
      .then((res) => res.json())
      .then((response: RawResponseMessage) => {
        if (response.message === 'password reset successfully') {
          localStorage.removeItem('recoveryEmail');
          showSnackbar('Password reset successful', 'success');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          showSnackbar('Failed to reset password', 'error');
        }
      })
      .catch(() =>
        showSnackbar(
          'Unexpected error occurred while resetting your password',
          'error'
        )
      )
      .finally(() => {
        setIsLoading(false);
        closeSnackbar();
      });
  }

  return isSuccessResponse ? (
    <section>
      <InputField
        inputType='password'
        title='New Password'
        label='New Password'
        buttonLabel='Reset'
        onSubmit={resetPassword}
        loading={isLoading}
      />
      <NotificationSnackbar
        isOpen={isSnackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </section>
  ) : remainingTime === 0 ? (
    <section className='text-center w-fit mx-auto'>
      <img
        src={codeExpiredImg}
        alt='reset code expired icon'
        className='mx-auto w-[45%]'
      />
      <h2 className='font-bold my-4'>
        Password reset code is already expired. Please try sending your email
        again!
      </h2>
      <Link to='/forgot-password'>
        <p className='text-blue-400 font-bold cursor-pointer hover:text-blue-500 hover:underline'>
          Forgot Password
        </p>
      </Link>
    </section>
  ) : (
    <section>
      <div className='-mb-10 text-center '>
        <h1 className='font-bold'>
          Enter the 6-digit code sent in your email: {userEmail}
        </h1>

        <h2>
          Reset Code expires in: <strong>{remainingTime} sec</strong>
        </h2>
      </div>
      <InputField
        inputType='text'
        title='Reset Password'
        label='6-Digit Code'
        buttonLabel='Send'
        onSubmit={sendPasswordResetCode}
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