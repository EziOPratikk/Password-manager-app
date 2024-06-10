import { Fragment } from 'react/jsx-runtime';
import { type ReactNode } from 'react';

import MainNavigation from './MainNavigation.tsx';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout(props: LayoutProps) {
  return (
    <Fragment>
      <MainNavigation />
      <main className='my-8 mx-auto max-w-[50rem] w-[90%]'>
        {props.children}
      </main>
    </Fragment>
  );
}
