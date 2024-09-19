import type { Pokemon } from '../types';

export const fetchPokemonData = async (pokemonId: string): Promise<Pokemon> => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
  );
  const data = await response.json();

  return data;
};
