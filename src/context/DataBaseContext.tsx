import React, { createContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react'; // Importación de tipo para ReactNode

// Definir el tipo para Pokémon
interface Pokemon {
  id: string;
  name: string;
}

// Definir el tipo para el contexto
interface DatabaseContextType {
  db: IDBDatabase | null;
  addPokemonToFavorites: (pokemon: Pokemon) => void;
  removePokemonFromFavorites: (id: number) => void;
  getFavorites: () => Promise<Pokemon[]>;
}

// Crear el contexto con el tipo
export const DatabaseContext = createContext<DatabaseContextType | null>(null);

// Props del Provider
interface DatabaseProviderProps {
  children: ReactNode; // Usar el tipo importado aquí
}

// Crear el DatabaseProvider
export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({
  children,
}) => {
  const [db, setDb] = useState<IDBDatabase | null>(null);

  // Abrir o crear la base de datos en IndexedDB
  useEffect(() => {
    const openDatabase = () => {
      const request = indexedDB.open('PokemonDB', 1);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('favorites')) {
          const store = db.createObjectStore('favorites', { keyPath: 'id' });
          store.createIndex('name', 'name', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        setDb((event.target as IDBOpenDBRequest).result);
        console.log('Base de datos abierta con éxito.');
      };

      request.onerror = (event) => {
        console.error(
          'Error al abrir la base de datos:',
          (event.target as IDBOpenDBRequest).error
        );
      };
    };

    openDatabase();
  }, []);

  // Función para agregar un Pokémon a favoritos
  const addPokemonToFavorites = (pokemon: Pokemon) => {
    if (!db) return;

    const transaction = db.transaction(['favorites'], 'readwrite');
    const store = transaction.objectStore('favorites');

    const request = store.add(pokemon);
    request.onsuccess = () => {
      console.log(`${pokemon.name} ha sido agregado a favoritos.`);
    };

    request.onerror = (event) => {
      console.error(
        'Error al agregar el Pokémon:',
        (event.target as IDBRequest).error
      );
    };
  };

  // Función para eliminar un Pokémon de favoritos
  const removePokemonFromFavorites = (id: number) => {
    if (!db) return;

    const transaction = db.transaction(['favorites'], 'readwrite');
    const store = transaction.objectStore('favorites');

    const request = store.delete(id);
    request.onsuccess = () => {
      console.log(`Pokémon con ID ${id} ha sido eliminado de favoritos.`);
    };

    request.onerror = (event) => {
      console.error(
        'Error al eliminar el Pokémon:',
        (event.target as IDBRequest).error
      );
    };
  };

  // Función para obtener todos los Pokémon favoritos
  const getFavorites = async (): Promise<Pokemon[]> => {
    return new Promise((resolve, reject) => {
      if (!db) return reject('Base de datos no disponible.');

      const transaction = db.transaction(['favorites'], 'readonly');
      const store = transaction.objectStore('favorites');
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    });
  };

  return (
    <DatabaseContext.Provider
      value={{
        db,
        addPokemonToFavorites,
        removePokemonFromFavorites,
        getFavorites,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};
