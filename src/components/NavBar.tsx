import React from 'react';
import { MdCatchingPokemon } from 'react-icons/md';

export default function NavBar() {
  return (
    <nav className='flex gap-2 text-lg justify-center items-center h-full'>
      <MdCatchingPokemon />
      <a className='hover:underline' href='/PruebaTecnicaNativeBo/'>
        Home
      </a>
      <a className='hover:underline' href='/PruebaTecnicaNativeBo/favorites'>
        Favorites
      </a>
    </nav>
  );
}
