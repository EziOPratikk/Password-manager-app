import { useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';

import InputField from '../components/UI/forgot password/InputField.tsx';
import NotificationSnackbar from '../components/UI/NotificationSnackbar.tsx';
import { useSnackbar } from '../utils/hooks.ts';
import { BASE_URL } from '../utils/constants.ts';
import { postRequest } from '../utils/http.ts';

type RawResponseMessage = {
  message: string;
  expireTime: number;
};

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const {
    showSnackbar,
    closeSnackbar,
    snackbarMessage,
    snackbarSeverity,
    isSnackbarOpen,
  } = useSnackbar();

  function sendEmail(email: string) {
    setIsLoading(true);

    postRequest(`${BASE_URL}/forgot-password`, { email })
      .then((response: RawResponseMessage) => {
        if (response.message === 'email is not registered')
          return showSnackbar(
            'User associated with this email does not exist',
            'error'
          );

        if (
          response.message ===
          'unexpected error occurred while sending an email'
        )
          return showSnackbar(
            'Failed to send email, please try again later',
            'error'
          );

        if (response.message === 'email sent successfully to recipient') {
          localStorage.setItem('expireTime', response.expireTime.toString());
          navigate('/reset-password', { replace: true });
        }
      })
      .catch(() =>
        showSnackbar(
          'Unexpected error occurred while sending an email',
          'error'
        )
      )
      .finally(() => {
        setIsLoading(false);
        closeSnackbar();
      });
  }

  return (
    <Fragment>
      <InputField
        inputType='email'
        title='Forgot Password'
        label='Email'
        buttonLabel='Send'
        onSubmit={sendEmail}
        loading={isLoading}
      />
      <NotificationSnackbar
        isOpen={isSnackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </Fragment>
  );
}