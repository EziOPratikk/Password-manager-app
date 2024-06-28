import { Card } from '@mui/material';
import Avatar from '@mui/material/Avatar';

export default function ProfileSkeleton() {
  return (
    <Card className='p-8'>
      <Avatar
        sx={{
          height: '100px',
          width: '100px',
          margin: 'auto',
        }}
        className='animate-pulse'
      ></Avatar>
      <div className='mt-4 leading-8 animate-pulse'>
        <p className='mx-auto h-3 w-56 bg-gray-300 rounded-full mb-4'></p>
        <p className='mx-auto h-3 w-56 bg-gray-300 rounded-full mb-4'></p>
        <p className='mx-auto h-3 w-56 bg-gray-300 rounded-full mb-4'></p>
        <p className='mx-auto h-3 w-56 bg-gray-300 rounded-full mb-4'></p>
        <p className='mx-auto h-3 w-56 bg-gray-300 rounded-full mb-4'></p>
      </div>
    </Card>
  );
}