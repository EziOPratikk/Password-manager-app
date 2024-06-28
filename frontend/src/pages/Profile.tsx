import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import ProfileItem from '../components/profile/ProfileItem.tsx';
import ProfileSkeleton from '../components/profile/ProfileSkeleton.tsx';
import { getRequestWithToken } from '../utils/http.ts';
import { BASE_URL } from '../utils/constants.ts';
import NotFound from './NotFound.tsx';

type RawPlatformsData = {
  platformNames?: string[];
  message?: string;
};

export default function Profile() {
  const [platformList, setPlatformList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const routeName = location.pathname;

  const userEmail = JSON.parse(localStorage.getItem('email')!);
  const token = JSON.parse(localStorage.getItem('token')!);

  const splittedUserEmail = userEmail && userEmail.split('@')[0];
  const username = '@' + splittedUserEmail;

  useEffect(() => {
    setIsLoading(true);

    getRequestWithToken(`${BASE_URL}/platforms/${userEmail}`, token)
      .then((response: RawPlatformsData) => {
        if (response.message === 'no platforms saved yet') return;

        if (response.platformNames) {
          setPlatformList(response.platformNames);
        }
      })
      .catch((error) => {
        throw new Error(error);
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (routeName.substring(9) !== username) return <NotFound />;

  return (
    <section className='max-w-96 mx-auto'>
      <h1 className='text-center text-3xl font-bold mb-8'>User Profile</h1>
      {isLoading ? (
        <ProfileSkeleton />
      ) : (
        <ProfileItem email={userEmail} savedPlatforms={platformList} />
      )}
    </section>
  );
}