import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { subscribeToMovies, type Movie } from '@/lib/movies';

type MoviesContextValue = {
  movies: Movie[];
  moviesLoading: boolean;
  moviesError: string | null;
};

type LoadedMovies = {
  userId: string;
  movies: Movie[];
  error: string | null;
};

const MoviesContext = createContext<MoviesContextValue | null>(null);

export function MoviesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.uid ?? null;
  const [loaded, setLoaded] = useState<LoadedMovies | null>(null);

  useEffect(() => {
    if (!userId) {
      return;
    }
    return subscribeToMovies(
      userId,
      (movies) => setLoaded({ userId, movies, error: null }),
      (error) => setLoaded({ userId, movies: [], error: error.message }),
    );
  }, [userId]);

  const value = useMemo<MoviesContextValue>(() => {
    // Rows loaded for a previous account are never handed to the next one.
    const current = loaded && loaded.userId === userId ? loaded : null;
    return {
      movies: current?.movies ?? [],
      moviesLoading: Boolean(userId) && !current,
      moviesError: current?.error ?? null,
    };
  }, [loaded, userId]);

  return (
    <MoviesContext.Provider value={value}>{children}</MoviesContext.Provider>
  );
}

export function useMovies(): MoviesContextValue {
  const value = useContext(MoviesContext);
  if (!value) {
    throw new Error('useMovies must be used inside MoviesProvider');
  }
  return value;
}
