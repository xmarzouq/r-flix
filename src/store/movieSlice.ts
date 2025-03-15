import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchGenres,
  searchMovies,
  fetchMyRatedMovies,
} from '@/api/tmdb';

export interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
  vote_average: number;
  genre_ids: number[];
  vote_count: number;
  user_rating?: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MoviesState {
  popular: {
    movies: Movie[];
    currentPage: number;
    selectedGenre: number | null;
    loading: boolean;
    error: string | null;
  };
  topRated: {
    movies: Movie[];
    currentPage: number;
    selectedGenre: number | null;
    loading: boolean;
    error: string | null;
  };
  genres: {
    data: Genre[];
    loading: boolean;
    error: string | null;
  };
  search: {
    results: Movie[];
    query: string;
    loading: boolean;
    error: string | null;
  };
  userRatings: { [key: number]: number };
}

const initialState: MoviesState = {
  popular: {
    movies: [],
    currentPage: 1,
    selectedGenre: null,
    loading: false,
    error: null,
  },
  topRated: {
    movies: [],
    currentPage: 1,
    selectedGenre: null,
    loading: false,
    error: null,
  },
  genres: {
    data: [],
    loading: false,
    error: null,
  },
  search: {
    results: [],
    query: '',
    loading: false,
    error: null,
  },
  userRatings: {},
};

export const fetchPopularMoviesThunk = createAsyncThunk(
  'movies/fetchPopular',
  async (params: { page: number; genre: number | null }) => {
    const { page, genre } = params;
    const data = (await fetchPopularMovies(page, genre)) as {
      results: Movie[];
    };
    return data.results as Movie[];
  }
);

export const fetchTopRatedMoviesThunk = createAsyncThunk(
  'movies/fetchTopRated',
  async (params: { page: number; genre: number | null }) => {
    const { page, genre } = params;
    const data = (await fetchTopRatedMovies(page, genre)) as {
      results: Movie[];
    };
    const filtered = data.results.filter(
      (movie: Movie) => movie.vote_count >= 100
    );
    return filtered.slice(0, 40) as Movie[];
  }
);

export const fetchGenresThunk = createAsyncThunk(
  'movies/fetchGenres',
  async () => {
    const data = (await fetchGenres()) as { genres: Genre[] };
    return data.genres as Genre[];
  }
);

export const fetchSearchMoviesThunk = createAsyncThunk(
  'movies/fetchSearch',
  async (params: { query: string; page?: number }) => {
    const { query, page = 1 } = params;
    const data = (await searchMovies(query, page)) as { results: Movie[] };
    return data.results as Movie[];
  }
);

export const fetchUserRatingsThunk = createAsyncThunk(
  'movies/fetchUserRatings',
  async (sessionId: string) => {
    const data = (await fetchMyRatedMovies(sessionId)) as {
      results: { id: number; rating: number }[];
    };
    const ratingsMap: { [key: number]: number } = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.results.forEach((movie) => {
      ratingsMap[movie.id] = movie.rating;
    });
    return ratingsMap;
  }
);

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setPopularCurrentPage(state, action: PayloadAction<number>) {
      state.popular.currentPage = action.payload;
    },
    setPopularSelectedGenre(state, action: PayloadAction<number | null>) {
      state.popular.selectedGenre = action.payload;
    },
    setTopRatedCurrentPage(state, action: PayloadAction<number>) {
      state.topRated.currentPage = action.payload;
    },
    setTopRatedSelectedGenre(state, action: PayloadAction<number | null>) {
      state.topRated.selectedGenre = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.search.query = action.payload;
    },
    clearSearchResults(state) {
      state.search.results = [];
      state.search.query = '';
      state.search.error = null;
      state.search.loading = false;
    },
    setAuthenticated(state, action: PayloadAction<boolean>) {
      state.auth.isAuthenticated = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPopularMoviesThunk.pending, (state) => {
      state.popular.loading = true;
      state.popular.error = null;
    });
    builder.addCase(fetchPopularMoviesThunk.fulfilled, (state, action) => {
      state.popular.loading = false;
      state.popular.movies = action.payload;
    });
    builder.addCase(fetchPopularMoviesThunk.rejected, (state, action) => {
      state.popular.loading = false;
      state.popular.error =
        action.error.message || 'Failed to load popular movies';
    });
    builder.addCase(fetchTopRatedMoviesThunk.pending, (state) => {
      state.topRated.loading = true;
      state.topRated.error = null;
    });
    builder.addCase(fetchTopRatedMoviesThunk.fulfilled, (state, action) => {
      state.topRated.loading = false;
      state.topRated.movies = action.payload;
    });
    builder.addCase(fetchTopRatedMoviesThunk.rejected, (state, action) => {
      state.topRated.loading = false;
      state.topRated.error =
        action.error.message || 'Failed to load top rated movies';
    });
    builder.addCase(fetchGenresThunk.pending, (state) => {
      state.genres.loading = true;
      state.genres.error = null;
    });
    builder.addCase(fetchGenresThunk.fulfilled, (state, action) => {
      state.genres.loading = false;
      state.genres.data = action.payload;
    });
    builder.addCase(fetchGenresThunk.rejected, (state, action) => {
      state.genres.loading = false;
      state.genres.error = action.error.message || 'Failed to load genres';
    });
    builder.addCase(fetchSearchMoviesThunk.pending, (state) => {
      state.search.loading = true;
      state.search.error = null;
    });
    builder.addCase(fetchSearchMoviesThunk.fulfilled, (state, action) => {
      state.search.loading = false;
      state.search.results = action.payload;
    });
    builder.addCase(fetchSearchMoviesThunk.rejected, (state, action) => {
      state.search.loading = false;
      state.search.error =
        action.error.message || 'Failed to load search results';
    });
    builder.addCase(fetchUserRatingsThunk.pending, (state) => {
      state.userRatings.loading = true;
      state.userRatings.error = null;
    });
    builder.addCase(fetchUserRatingsThunk.fulfilled, (state, action) => {
      state.userRatings.loading = false;
      state.userRatings = action.payload;
    });
    builder.addCase(fetchUserRatingsThunk.rejected, (state, action) => {
      state.userRatings.loading = false;
      state.userRatings.error =
        action.error.message || 'Failed to load user ratings';
    });
  },
});

export const {
  setPopularCurrentPage,
  setPopularSelectedGenre,
  setTopRatedCurrentPage,
  setTopRatedSelectedGenre,
  setSearchQuery,
  clearSearchResults,
  setAuthenticated,
} = moviesSlice.actions;

export default moviesSlice.reducer;
