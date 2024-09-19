interface Pokemon {
  id: string; // Changed from string to number
  name: string;
}

// Define the store for favorites

// Initialize the database and IndexedDB configuration
const initDB = async (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('PokemonDB', 1);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('favorites')) {
        const store = db.createObjectStore('favorites', { keyPath: 'id' });
        store.createIndex('name', 'name', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

// Function to add a Pokemon to favorites
export const addPokemonToFavorites = async (
  pokemon: Pokemon
): Promise<void> => {
  const db = await initDB();
  const transaction = db.transaction(['favorites'], 'readwrite');
  const store = transaction.objectStore('favorites');

  return new Promise((resolve, reject) => {
    const request = store.add(pokemon);
    request.onsuccess = () => {
      console.log('se registro correctamente');
      resolve();
    };
    request.onerror = (event) => {
      console.log('Hubo un error');

      reject((event.target as IDBRequest).error);
    };
  });
};

// Function to remove a Pokemon from favorites
export const removePokemonFromFavorites = async (id: string): Promise<void> => {
  const db = await initDB();
  const transaction = db.transaction(['favorites'], 'readwrite');
  const store = transaction.objectStore('favorites');

  return new Promise((resolve, reject) => {
    const request = store.delete(id);
    request.onsuccess = () => {
      resolve();
    };
    request.onerror = (event) => {
      reject((event.target as IDBRequest).error);
    };
  });
};

// Function to get all favorite Pokemon
export const getFavorites = async (): Promise<Pokemon[]> => {
  const db = await initDB();
  const transaction = db.transaction(['favorites'], 'readonly');
  const store = transaction.objectStore('favorites');

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = (event) => {
      reject((event.target as IDBRequest).error);
    };
  });
};

export const doesPokemonExist = async (id: string): Promise<boolean> => {
  const db = await initDB();
  const transaction = db.transaction(['favorites'], 'readonly');
  const store = transaction.objectStore('favorites');

  return new Promise((resolve, reject) => {
    const request = store.get(id);
    request.onsuccess = () => {
      // If the result is not undefined, the item exists
      resolve(request.result !== undefined);
    };
    request.onerror = (event) => {
      console.error(
        'Error checking if Pokémon exists:',
        (event.target as IDBRequest).error
      );
      reject((event.target as IDBRequest).error);
    };
  });
};
