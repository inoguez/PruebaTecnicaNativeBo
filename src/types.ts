export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonSprites {
  front_default: string;
  front_shiny?: string;
  front_female?: string;
  front_shiny_female?: string;
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface Pokemon {
  id: string;
  name: string;
  base_experience: number;
  height: number;
  is_default: boolean;
  order: number;
  weight: number;
  abilities: PokemonAbility[];
  sprites: PokemonSprites;
  types: PokemonType[];
  stats: PokemonStat[]; // Added this line
}

export const colorDictionary: Map<string, string> = new Map([
  ['normal', '#A8A878'],
  ['fighting', '#C03028'],
  ['flying', '#A890F0'],
  ['poison', '#A040A0'],
  ['ground', '#E0C068'],
  ['rock', '#B8A038'],
  ['bug', '#A8B820'],
  ['ghost', '#705898'],
  ['steel', '#B8B8D0'],
  ['fire', '#F08030'],
  ['water', '#6890F0'],
  ['grass', '#78C850'],
  ['electric', '#F8D030'],
  ['psychic', '#F85888'],
  ['ice', '#98D8D8'],
  ['dragon', '#7038F8'],
  ['dark', '#705848'],
  ['fairy', '#F0B6BC'],
  ['stellar', '#8A8A8A'],
  ['unknown', '#BEBEBE'],
]);
