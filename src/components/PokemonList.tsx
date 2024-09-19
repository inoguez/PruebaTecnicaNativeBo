import { useEffect, useState, useRef } from 'react';
import PokeCard from './PokeCard';

interface Pokemon {
  name: string;
  url: string;
}

export default function PokemonList() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [page, setPage] = useState<number>(1); // Página actual
  const [loading, setLoading] = useState<boolean>(false); // Indicador de carga
  const [hasMore, setHasMore] = useState<boolean>(true); // Si hay más Pokémon por cargar
  const observerRef = useRef<HTMLDivElement | null>(null); // Referencia al observador

  // Función para obtener los Pokémon de la API
  const fetchPokemon = async (page: number): Promise<void> => {
    setLoading(true);
    const limit = 20;
    const offset = (page - 1) * limit;

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
      );
      const data = await response.json();

      setPokemonList((prev) => [...prev, ...data.results]);
      setHasMore(data.results.length > 0);
    } catch (error) {
      console.error('Error fetching Pokémon:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar la intersección del observador
  const handleObserver: IntersectionObserverCallback = (entries) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    fetchPokemon(page);
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 1.0,
    });
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasMore, loading]);

  return (
    <div>
      <ul className='p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {pokemonList.map((pokemon, index) => (
          <li key={index}>
            <PokeCard name={pokemon.name} />
          </li>
        ))}
      </ul>
      <div ref={observerRef}>
        {loading && <p>Cargando...</p>}
        {!hasMore && <p>No hay más Pokémon</p>}
      </div>
    </div>
  );
}
