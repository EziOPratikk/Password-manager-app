import { useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';

type PlatformItemProps = {
  id: string;
  name: string;
  src: string;
};

export default function PlatformItem(props: PlatformItemProps) {
  const navigate = useNavigate();

  function handlePlatformNavigation() {
    navigate(`/${props.id}`);
  }

  return (
    <Card
      variant='outlined'
      className='hover:shadow-md transition-shadow duration-300 ease-in-out'
      onClick={handlePlatformNavigation}
    >
      <li className='list-none py-8 px-14 text-center cursor-pointer'>
        <div className='w-20 mb-4 mx-auto'>
          <img
            src={props.src}
            alt={`a ${props.name} icon`}
            className='object-contain w-full'
          />
        </div>
        <p>{props.name}</p>
      </li>
    </Card>
  );
}