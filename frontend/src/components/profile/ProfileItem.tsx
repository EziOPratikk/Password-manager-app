import { Card } from '@mui/material';
import Avatar from '@mui/material/Avatar';

import userImg from '../../assets/images/user.png';
import { useThemeContext } from '../../store/theme-context';

type ProfileItemProps = {
  email: string;
  savedPlatforms: string[];
};

export default function ProfileItem(props: ProfileItemProps) {
  const { mode } = useThemeContext();

  return (
    <Card className='p-8'>
      <Avatar
        src={userImg}
        sx={{
          height: '100px',
          width: '100px',
          margin: 'auto',
        }}
      ></Avatar>
      <div className='text-center mt-4 leading-8'>
        <p>
          <strong>Username: </strong>
          {props.email.split('@')[0]}
        </p>
        <p>
          <strong>Email: </strong>
          {props.email}
        </p>
        <p>
          <strong>Total saved platforms: </strong>
          {props.savedPlatforms.length}
        </p>
        <p>
          <strong>Saved platforms: </strong>
          {props.savedPlatforms.length !== 0 ? (
            props.savedPlatforms.map((platformName, index) => (
              <span key={index} className='pr-1'>
                {platformName}
              </span>
            ))
          ) : (
            <span>None</span>
          )}
        </p>
        <p>
          <strong>Preferred theme: </strong>
          {mode.toUpperCase()}
        </p>
      </div>
    </Card>
  );
}