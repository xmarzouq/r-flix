import { TMDB_ACCESS_TOKEN } from '@/config';
const BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchRequestToken(): Promise<string> {
  const response = await fetch(`${BASE_URL}/authentication/token/new`, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch request token: ${response.statusText}`);
  }
  const data = await response.json();
  return data.request_token;
}

export async function validateRequestToken(
  requestToken: string,
  username: string,
  password: string
): Promise<void> {
  const response = await fetch(
    `${BASE_URL}/authentication/token/validate_with_login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        username,
        password,
        request_token: requestToken,
      }),
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to validate request token: ${response.statusText}`);
  }
  // If successful, no data is needed.
}

export async function createSession(requestToken: string): Promise<string> {
  const response = await fetch(`${BASE_URL}/authentication/session/new`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({ request_token: requestToken }),
  });
  if (!response.ok) {
    throw new Error(`Failed to create session: ${response.statusText}`);
  }
  const data = await response.json();
  return data.session_id;
}

export async function fetchPopularMovies(
  page: number,
  genre?: number | null
): Promise<any> {
  let url: URL;
  if (genre) {
    url = new URL(`${BASE_URL}/discover/movie`);
    url.searchParams.set('sort_by', 'popularity.desc');
    url.searchParams.set('page', page.toString());
    url.searchParams.set('with_genres', genre.toString());
  } else {
    url = new URL(`${BASE_URL}/movie/popular`);
    url.searchParams.set('page', page.toString());
  }

  const response = await fetch(url.toString(), {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchGenres(): Promise<any> {
  const response = await fetch(`${BASE_URL}/genre/movie/list`, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch genres: ${response.statusText}`);
  }
  return response.json();
}

export async function searchMovies(
  query: string,
  page: number = 1
): Promise<any> {
  const url = new URL(`${BASE_URL}/search/movie`);
  url.searchParams.set('query', query);
  url.searchParams.set('page', page.toString());

  const response = await fetch(url.toString(), {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to search movies: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchMovieDetails(id: string): Promise<any> {
  const response = await fetch(
    `${BASE_URL}/movie/${id}?append_to_response=credits,reviews,recommendations`,
    {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch movie details: ${response.statusText}`);
  }
  return response.json();
}
export async function fetchTopRatedMovies(
  page: number,
  genre?: number | null
): Promise<any> {
  let url: URL;
  if (genre) {
    url = new URL(`${BASE_URL}/discover/movie`);
    url.searchParams.set('sort_by', 'vote_average.desc');
    url.searchParams.set('vote_count.gte', '100'); // Ensure movies have at least 100 votes
    url.searchParams.set('page', page.toString());
    url.searchParams.set('with_genres', genre.toString());
  } else {
    url = new URL(`${BASE_URL}/movie/top_rated`);
    url.searchParams.set('page', page.toString());
  }

  const response = await fetch(url.toString(), {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch top rated movies: ${response.statusText}`);
  }

  return response.json();
}
/* --- New Functions for Rating --- */

/* Fetch movies that the user rated */
export async function fetchMyRatedMovies(sessionId: string): Promise<any> {
  // First, get the account details to obtain account_id
  const accountResponse = await fetch(
    `${BASE_URL}/account?session_id=${sessionId}`,
    {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
      },
    }
  );
  if (!accountResponse.ok) {
    throw new Error(
      `Failed to fetch account details: ${accountResponse.statusText}`
    );
  }
  const accountData = await accountResponse.json();
  const accountId = accountData.id;
  // Fetch rated movies for the account
  const ratedResponse = await fetch(
    `${BASE_URL}/account/${accountId}/rated/movies?session_id=${sessionId}`,
    {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
      },
    }
  );
  if (!ratedResponse.ok) {
    throw new Error(
      `Failed to fetch rated movies: ${ratedResponse.statusText}`
    );
  }
  return ratedResponse.json();
}

/* Submit or update a movie rating */
export async function rateMovie(
  movieId: number,
  rating: number,
  sessionId: string
): Promise<any> {
  const response = await fetch(
    `${BASE_URL}/movie/${movieId}/rating?session_id=${sessionId}`,
    {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ value: rating }),
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to rate movie: ${response.statusText}`);
  }
  return response.json();
}

/* Optional: Delete a movie rating */
export async function deleteMovieRating(
  movieId: number,
  sessionId: string
): Promise<any> {
  const response = await fetch(
    `${BASE_URL}/movie/${movieId}/rating?session_id=${sessionId}`,
    {
      method: 'DELETE',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to delete movie rating: ${response.statusText}`);
  }
  return response.json();
}
