import { type ChangeEvent, type ReactNode, useState, useEffect } from 'react';

import PlatformItem from '../components/PlatformItem.tsx';
import PlatformItemSkeleton from '../components/PlatformItemSkeleton.tsx';
import { PLATFORMS } from '../data/platforms.ts';

import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from '@mui/material';

export default function Home() {
  const [platforms, setPlatforms] = useState(PLATFORMS);
  const [searchedKeyword, setSearchedKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  function handleSearchedKeyword(event: ChangeEvent<HTMLInputElement>) {
    const inputKeyword = event.currentTarget.value;
    setSearchedKeyword(inputKeyword);

    if (!inputKeyword) {
      setPlatforms(PLATFORMS);
      return;
    }
  }

  function searchPlatforms() {
    if (!searchedKeyword) return;

    const filteredPlatforms = PLATFORMS.filter((platform) =>
      platform.keywords.includes(searchedKeyword.toLowerCase())
    );

    setPlatforms(filteredPlatforms);
  }

  let platformsGridContent: ReactNode;

  if (platforms.length !== 0) {
    platformsGridContent = (
      <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
        {platforms.map((platform) => {
          return isLoading ? (
            <PlatformItemSkeleton key={platform.id} />
          ) : (
            <PlatformItem
              key={platform.id}
              id={platform.id}
              name={platform.name}
              src={platform.src}
            />
          );
        })}
      </ul>
    );
  } else {
    platformsGridContent = (
      <p className='text-center text-xl font-bold'>
        Sorry, we couldn’t find any matches for "{searchedKeyword}" platform :(
      </p>
    );
  }

  return (
    <div>
      <h1 className='text-center text-xl font-bold mb-8 md:-mt-4'>
        Manage Your Passwords
      </h1>
      <div className='text-center mb-8'>
        <TextField
          type='text'
          size='small'
          label='Search'
          autoComplete='off'
          InputProps={{ sx: { borderRadius: 50 } }}
          value={searchedKeyword}
          onChange={handleSearchedKeyword}
        />
        <IconButton
          type='button'
          aria-label='search'
          sx={{ marginLeft: '-2.5rem' }}
          onClick={searchPlatforms}
        >
          <SearchIcon />
        </IconButton>
      </div>
      {platformsGridContent}
    </div>
  );
}