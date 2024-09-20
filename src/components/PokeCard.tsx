import React, { useContext, useEffect, useState } from 'react';
import { colorDictionary, type Pokemon } from '@/types';
import { fetchPokemonData } from '@/api/pokemonApi';
import { Progress } from '@/components/ui/progress';

import { Label } from './ui/label';
import { Badge } from './ui/badge';

import { Heart } from 'lucide-react';
import SkeletonCard from './SkeletonCard';
import {
  addPokemonToFavorites,
  doesPokemonExist,
  removePokemonFromFavorites,
} from '@/utils';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import AnimatedProgressBar from './AnimatedProgressBar';
export default function PokeCard({ name }: { name: string }) {
  const [pokemon, setPokemon] = useState<Pokemon | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const loadPokemonData = async () => {
      try {
        const pokemonData = await fetchPokemonData(name);
        setPokemon(pokemonData);
      } catch (err) {
        setError('Failed to fetch Pokémon data');
      } finally {
        setLoading(false);
      }
    };

    loadPokemonData();
  }, []);

  useEffect(() => {
    if (!pokemon) return;
    const isFavorite = async () => {
      const exist = await doesPokemonExist(pokemon?.id);
      setIsFavorite(exist);
    };
    isFavorite();
  }, [pokemon]);

  async function handleFavorite() {
    const id = pokemon?.id;
    const name = pokemon?.name;
    if (id && name) {
      if (isFavorite) {
        const { status, message } = await removePokemonFromFavorites(
          pokemon.id
        );
        if (status === 200) {
          toast.success(message);
          setIsFavorite(false);
        }
        return;
      }
      const { status, message } = await addPokemonToFavorites({
        id: id,
        name: name,
      });

      if (status === 200) {
        toast.success(message);
        setIsFavorite(true);
      }
    }
  }
  return (
    <>
      {!loading ? (
        <div className='border-border border-[1px] rounded-lg p-4 overflow-hidden grid gap-1'>
          <div className='flex gap-2 items-center'>
            <button type='button' onClick={handleFavorite} className='group '>
              <Heart
                size={18}
                className={cn(' group-hover:fill-white ', {
                  'fill-red-500 stroke-red-500 group-hover:stroke-white':
                    isFavorite,
                })}
              />
            </button>
            <span className='font-bold ~text-lg/xl'>{pokemon?.name}</span>
          </div>
          <img
            className='aspect-square w-full'
            src={pokemon?.sprites.front_shiny}
            aria-label={`Sprite of ${pokemon?.name.toString()}`}
          />
          <div className='flex gap-1'>
            {pokemon?.types?.map((type) => {
              const color = colorDictionary.get(type.type.name);

              return (
                <Badge
                  key={type.type.name}
                  style={{ borderColor: color, color: color }}
                  className='rounded-full'
                  variant='outline'
                >
                  {type.type.name}
                </Badge>
              );
            })}
          </div>
          <div>
            {pokemon?.stats.map((stat, index) => {
              return (
                <React.Fragment key={stat.stat.name}>
                  <Label htmlFor={stat.stat.name} className='font-thin'>
                    {stat.stat.name}
                  </Label>
                  <AnimatedProgressBar
                    id={stat.stat.name}
                    value={stat.base_stat}
                    duration={800}
                    max={255}
                    delay={index * 100}
                  />
                </React.Fragment>
              );
            })}
          </div>
        </div>
      ) : (
        <SkeletonCard />
      )}
    </>
  );
}
