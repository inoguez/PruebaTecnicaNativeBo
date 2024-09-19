import React, { useEffect, useState } from 'react';
import PokeCard from './PokeCard';
import { getFavorites } from '@/utils';

// Ensure this interface matches the shape of the Pokemon objects returned by getFavorites
interface Pokemon {
  id: string;
  name: string;
}

export default function FavoritePokeList() {
  const [favorites, setFavorites] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFavorites() {
      try {
        setLoading(true);
        const favoritePokemon = await getFavorites();
        setFavorites(favoritePokemon);
      } catch (err) {
        setError('Failed to load favorites');
        console.error('Error loading favorites:', err);
      } finally {
        setLoading(false);
      }
    }

    loadFavorites();
  }, []);

  if (loading) {
    return <div>Loading favorites...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
      {favorites.length === 0 ? (
        <p>No favorite Pokémon yet.</p>
      ) : (
        favorites.map((pokemon) => (
          <PokeCard key={pokemon.id} name={pokemon.name} />
        ))
      )}
    </div>
  );
}
