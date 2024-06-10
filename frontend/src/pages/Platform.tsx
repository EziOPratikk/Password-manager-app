import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import TextFormField from '../components/UI/TextFormField';
import {
  postRequestWithToken,
  getRequestWithToken,
  patchRequestWithToken,
} from '../utils/http.ts';
import { BASE_URL } from '../utils/constants.ts';
import NotificationSnackbar from '../components/UI/NotificationSnackbar.tsx';
import { useSnackbar } from '../utils/hooks.ts';
// import NotFound from './NotFound.tsx';
import { useAuthContext } from '../store/auth-context.tsx';

type RawPlatformData = {
  _id: string;
  name: string;
  email: string;
  password: string;
  message?: string;
};

export default function Platform() {
  const [isLoading, setIsLoading] = useState(false);
  const [platformCredentials, setPlatformCredentials] =
    useState<RawPlatformData>({
      _id: '',
      name: '',
      email: '',
      password: '',
    });

  const navigate = useNavigate();

  // const params = useParams<string>();
  // const routeName = params.platformName!;

  const location = useLocation();
  const routeName = location.pathname.substring(1);

  const {
    showSnackbar,
    closeSnackbar,
    snackbarMessage,
    snackbarSeverity,
    isSnackbarOpen,
  } = useSnackbar();

  const { logout } = useAuthContext();

  // const platformList = [
  //   'facebook',
  //   'twitter',
  //   'gmail',
  //   'youtube',
  //   'github',
  //   'tiktok',
  // ];

  const userEmail = JSON.parse(localStorage.getItem('email')!);
  const token = JSON.parse(localStorage.getItem('token')!);

  useEffect(() => {
    getRequestWithToken(
      `${BASE_URL}/platform/${routeName}?userEmail=${userEmail}`,
      token
    )
      .then((response: RawPlatformData) => {
        if (
          response.message === 'Invalid token' ||
          response.message === 'Access denied! unauthorized user'
        ) {
          showSnackbar(response.message, 'error');

          logout();

          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }

        if (response.message === 'no credentials saved yet') {
          return showSnackbar(
            `Credentials for ${routeName} not saved yet!`,
            'warning'
          );
        }

        setPlatformCredentials({
          _id: response._id,
          name: response.name,
          email: response.email,
          password: response.password,
        });
      })
      .catch(() =>
        showSnackbar(
          'Unexpected error occurred while fetching credentials',
          'error'
        )
      )
      .finally(() => closeSnackbar());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function saveCredentials(email: string, password: string) {
    setIsLoading(true);

    const platformCredentials = {
      email,
      password,
    };

    postRequestWithToken(
      `${BASE_URL}/platform/${routeName}?userEmail=${userEmail}`,
      token,
      platformCredentials
    )
      .then((response) => {
        if (
          response.message === 'Invalid token' ||
          response.message === 'Access denied! unauthorized user'
        ) {
          showSnackbar(response.message, 'error');

          logout();

          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }

        if (
          response.message === `${routeName} credentials has already been saved`
        ) {
          showSnackbar(
            `${routeName} credentials has already been saved`,
            'success'
          );
        }

        if (
          response.message === `${routeName} credentials saved successfully`
        ) {
          showSnackbar(
            `${routeName} credentials saved successfully`,
            'success'
          );
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }
      })
      .catch(() => showSnackbar('Unexpected error occurred!', 'error'))
      .finally(() => {
        setIsLoading(false);
        closeSnackbar();
      });
  }

  function updateCredentials(email: string, password: string) {
    setIsLoading(true);

    const platformCredentials = {
      email,
      password,
    };

    patchRequestWithToken(
      `${BASE_URL}/platform/${routeName}?userEmail=${userEmail}`,
      token,
      platformCredentials
    )
      .then((response) => {
        if (
          response.message === 'Invalid token' ||
          response.message === 'Access denied! unauthorized user'
        ) {
          showSnackbar(response.message, 'error');

          logout();

          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }

        if (
          response.message === `${routeName} credentials updated successfully`
        ) {
          showSnackbar(response.message, 'success');
        } else {
          showSnackbar(response.message, 'error');
        }
      })
      .catch(() => showSnackbar('Unexpected error occurred!', 'error'))
      .finally(() => {
        setIsLoading(false);
        closeSnackbar();
      });
  }

  // if (
  //   !params.platformName ||
  //   !platformList.includes(routeName.toLocaleLowerCase())
  // )
  //   return <NotFound />;

  return (
    <section className='h-96 flex flex-col justify-center items-center'>
      <h1 className='text-center text-xl font-bold mb-8'>
        Your password for {routeName.toUpperCase()}
      </h1>
      <TextFormField
        type='platform'
        onSave={saveCredentials}
        onUpdate={updateCredentials}
        buttonLabel={
          platformCredentials.email && platformCredentials.password
            ? 'Update'
            : 'Save'
        }
        buttonIcon={<CloudUploadIcon />}
        loading={isLoading}
        platformEmail={platformCredentials.email}
        platformPassword={platformCredentials.password}
      />
      <NotificationSnackbar
        isOpen={isSnackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </section>
  );
}