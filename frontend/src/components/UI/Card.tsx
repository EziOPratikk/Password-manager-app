import { type ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
};

export default function Card(props: CardProps) {
  return <div className='shadow-md rounded-md'>{props.children}</div>;
}