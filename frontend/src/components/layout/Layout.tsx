import { Fragment } from 'react/jsx-runtime';
import { type ReactNode } from 'react';

import MainNavigation from './MainNavigation.tsx';
import Footer from './Footer.tsx';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout(props: LayoutProps) {
  return (
    <Fragment>
      <MainNavigation />
      <main className='mt-44 mb-8 mx-auto max-w-[50rem] w-[90%]'>
        {props.children}
      </main>
      <Footer />
    </Fragment>
  );
}