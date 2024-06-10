import PlatformItem from '../components/PlatformItem';
import { PLATFORMS } from '../data/platforms';

export default function Home() {
  return (
    <div>
      <h1 className='text-center text-xl font-bold mb-12'>
        Manage Your Passwords
      </h1>
      <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
        {PLATFORMS.map((platform) => {
          return (
            <PlatformItem
              key={platform.id}
              id={platform.id}
              name={platform.name}
              src={platform.src}
            />
          );
        })}
      </ul>
    </div>
  );
}