import React from 'react';

export default function NavBar() {
  return (
    <nav className='flex gap-2 text-lg justify-center items-center h-full'>
      <a href='/'>Home</a>
      <a href='/favorites'>Favorites</a>
    </nav>
  );
}
