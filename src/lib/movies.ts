import {
  collection,
  doc,
  deleteDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const GENRES = ['Action', 'Comedy', 'Drama', 'Horror'] as const;
export const STATUSES = ['Plan to Watch', 'Watching', 'Watched'] as const;

export type Movie = {
  id: string;
  userId: string;
  title: string;
  director: string;
  genre: string;
  status: string;
  rating: number | null;
  favorite: boolean;
  notes: string;
  createdAt: Timestamp | null;
};

export type MovieFormValues = {
  title: string;
  director: string;
  genre: string;
  status: string;
  rating: string;
  notes: string;
};

export type MovieFormErrors = Partial<Record<keyof MovieFormValues, string>>;

export const EMPTY_MOVIE_FORM: MovieFormValues = {
  title: '',
  director: '',
  genre: '',
  status: '',
  rating: '',
  notes: '',
};

export function validateMovie(values: MovieFormValues): MovieFormErrors {
  const errors: MovieFormErrors = {};
  const title = values.title.trim();
  const director = values.director.trim();
  const rating = values.rating.trim();

  if (title.length === 0) {
    errors.title = 'Title is required';
  } else if (title.length > 100) {
    errors.title = 'Title must be at most 100 characters';
  }
  if (director.length === 0) {
    errors.director = 'Director is required';
  } else if (director.length > 60) {
    errors.director = 'Director must be at most 60 characters';
  }
  if (!values.genre) {
    errors.genre = 'Please choose a genre';
  }
  if (!values.status) {
    errors.status = 'Please choose a status';
  }
  if (rating.length > 0 && !/^[0-5]$/.test(rating)) {
    errors.rating = 'Rating must be a whole number from 0 to 5';
  }
  if (values.notes.trim().length > 300) {
    errors.notes = 'Notes must be at most 300 characters';
  }
  return errors;
}

export function hasErrors(errors: MovieFormErrors): boolean {
  return Object.keys(errors).length > 0;
}

// Must match keyPart() in firestore.rules. Rules' lower() only changes A-Z, so
// toLowerCase() here would refuse titles such as "Đẹp".
function movieKeyPart(value: string): string {
  return value
    .trim()
    .replace(/[A-Z]/g, (letter) => letter.toLowerCase())
    .replace(/%/g, '%25')
    .replace(/\//g, '%2F')
    .replace(/\|/g, '%7C');
}

// The document id is what makes user + title + director unique in Firestore.
export function movieDocId(
  userId: string,
  title: string,
  director: string,
): string {
  return `${userId}|${movieKeyPart(title)}|${movieKeyPart(director)}`;
}

// Document ids hold whatever the title holds, such as / or %, which the router
// cannot carry in a path. These keep them to characters a URL leaves alone.
export function toRouteId(movieId: string): string {
  return encodeURIComponent(movieId).replace(/~/g, '%7E').replace(/%/g, '~');
}

export function fromRouteId(routeId: string): string {
  try {
    return decodeURIComponent(routeId.replace(/~/g, '%'));
  } catch {
    return '';
  }
}

// Covers every alphabet, including the letters the document id cannot fold.
export function isSameMovie(movie: Movie, values: MovieFormValues): boolean {
  return (
    movie.title.trim().toLowerCase() === values.title.trim().toLowerCase() &&
    movie.director.trim().toLowerCase() === values.director.trim().toLowerCase()
  );
}

function toFields(values: MovieFormValues) {
  const rating = values.rating.trim();
  return {
    title: values.title.trim(),
    director: values.director.trim(),
    genre: values.genre,
    status: values.status,
    rating: rating.length > 0 ? Number(rating) : null,
    notes: values.notes.trim(),
  };
}

export function movieToFormValues(movie: Movie): MovieFormValues {
  return {
    title: movie.title,
    director: movie.director,
    genre: movie.genre,
    status: movie.status,
    rating: movie.rating === null ? '' : String(movie.rating),
    notes: movie.notes,
  };
}

export function compareMovies(a: Movie, b: Movie): number {
  return (
    a.title.toLowerCase().localeCompare(b.title.toLowerCase()) ||
    a.director.toLowerCase().localeCompare(b.director.toLowerCase())
  );
}

export type MovieFilters = {
  genre: string;
  status: string;
  favoritesOnly: boolean;
  search: string;
};

export const EMPTY_FILTERS: MovieFilters = {
  genre: '',
  status: '',
  favoritesOnly: false,
  search: '',
};

export function filterMovies(movies: Movie[], filters: MovieFilters): Movie[] {
  const search = filters.search.trim().toLowerCase();
  return movies.filter(
    (movie) =>
      (!filters.genre || movie.genre === filters.genre) &&
      (!filters.status || movie.status === filters.status) &&
      (!filters.favoritesOnly || movie.favorite) &&
      (!search ||
        movie.title.toLowerCase().includes(search) ||
        movie.director.toLowerCase().includes(search)),
  );
}

export type StatusRow = { status: string; count: number };

export function statusBreakdown(movies: Movie[]): StatusRow[] {
  return STATUSES.map((status) => ({
    status: status as string,
    count: movies.filter((movie) => movie.status === status).length,
  }))
    .filter((row) => row.count > 0)
    .sort((a, b) => b.count - a.count); // stable: ties keep the STATUSES order
}

export function subscribeToMovies(
  userId: string,
  onData: (movies: Movie[]) => void,
  onError: (error: Error) => void,
): () => void {
  const moviesQuery = query(
    collection(db, 'movies'),
    where('userId', '==', userId),
  );
  return onSnapshot(
    moviesQuery,
    (snapshot) => {
      const movies = snapshot.docs.map((item) => {
        const data = item.data({ serverTimestamps: 'estimate' });
        return {
          id: item.id,
          userId: data.userId,
          title: data.title,
          director: data.director,
          genre: data.genre,
          status: data.status,
          rating: typeof data.rating === 'number' ? data.rating : null,
          favorite: data.favorite === true,
          notes: typeof data.notes === 'string' ? data.notes : '',
          createdAt: data.createdAt ?? null,
        } satisfies Movie;
      });
      onData(movies.sort(compareMovies));
    },
    onError,
  );
}

export async function addMovie(
  userId: string,
  values: MovieFormValues,
): Promise<void> {
  const fields = toFields(values);
  const id = movieDocId(userId, fields.title, fields.director);
  await setDoc(doc(db, 'movies', id), {
    ...fields,
    id,
    userId,
    favorite: false,
    createdAt: serverTimestamp(),
  });
}

// Changing the title or director changes the document id, so the movie moves
// to a new document in one atomic write. Returns the id it now lives under.
export async function saveMovie(
  movie: Movie,
  values: MovieFormValues,
): Promise<string> {
  const fields = toFields(values);
  const id = movieDocId(movie.userId, fields.title, fields.director);
  if (id === movie.id) {
    await updateDoc(doc(db, 'movies', id), { ...fields });
    return id;
  }
  const batch = writeBatch(db);
  batch.delete(doc(db, 'movies', movie.id));
  batch.set(doc(db, 'movies', id), {
    ...fields,
    id,
    userId: movie.userId,
    favorite: movie.favorite,
    createdAt: movie.createdAt ?? serverTimestamp(),
  });
  await batch.commit();
  return id;
}

export async function setMovieFavorite(
  movieId: string,
  favorite: boolean,
): Promise<void> {
  await updateDoc(doc(db, 'movies', movieId), { favorite });
}

export async function deleteMovie(movieId: string): Promise<void> {
  await deleteDoc(doc(db, 'movies', movieId));
}

export function cleanMovieError(err: unknown): string {
  const code =
    typeof err === 'object' && err !== null && 'code' in err
      ? String((err as { code: unknown }).code)
      : '';
  if (code === 'permission-denied') {
    return 'This movie could not be saved. It may already be in your list.';
  }
  return err instanceof Error ? err.message : String(err);
}

export const DUPLICATE_MOVIE = 'This movie is already in your list';
