import Card from '@mui/material/Card';

import { useThemeContext } from '../store/theme-context.tsx';

export default function PlatformItemSkeleton() {
  const { mode } = useThemeContext();

  return (
    <Card variant='outlined'>
      <li
        className={`list-none py-8 px-14 text-center cursor-pointer ${
          mode === 'dark' && 'bg-gray-800 text-white'
        }`}
      >
        <div className='w-24 h-20 mb-4 mx-auto rounded-sm bg-gray-300 animate-pulse'>
          <img className='object-contain w-full' />
        </div>
        <p className='mx-auto h-3 w-20 bg-gray-300 rounded-full mb-4 animate-pulse'></p>
      </li>
    </Card>
  );
}