'use client';
import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  Button,
  CircularProgress,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import PopularMovies from '@/components/PopularMovies';
import TopRatedMovies from '@/components/TopRatedMovies';
import Search from '@/components/Search';
import SignIn from '@/components/SignIn';

import {
  fetchSearchMoviesThunk,
  clearSearchResults,
  setSearchQuery,
  setAuthenticated,
} from '@/store/movieSlice';
import { useRouter, useSearchParams } from 'next/navigation';

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchState = useSelector((state: RootState) => state.movies.search);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'popular' | 'toprated' | 'search'>(
    (searchParams.get('view') as 'popular' | 'toprated' | 'search') || 'popular'
  );
  const searchRef = useRef<{ clearInput: () => void }>(null);

  // Redirect to sign-in page if not authenticated
  useEffect(() => {
    const storedAuthState = localStorage.getItem('isAuthenticated');
    if (storedAuthState === 'true') {
      dispatch(setAuthenticated(true));
    }
    setLoading(false);
  }, [dispatch]);

  // Update view state when searchParams change
  useEffect(() => {
    const newView =
      (searchParams.get('view') as 'popular' | 'toprated' | 'search') ||
      'popular';
    setView(newView);
  }, [searchParams]);

  // When search query changes, fetch search movies
  useEffect(() => {
    if (searchState.query) {
      dispatch(fetchSearchMoviesThunk({ query: searchState.query }));
      setView('search');
      router.replace(`/home?view=search`);
    }
  }, [dispatch, searchState.query, router]);

  const handleSearchComplete = (query: string) => {
    // When user hits ENTER, the Search component will trigger onSearchComplete.
    // We then set the query in the Redux state.
    dispatch(setSearchQuery(query));
  };

  const handleClearSearch = () => {
    dispatch(clearSearchResults());
    setView('popular');
    router.replace(`/home?view=popular`);
    if (searchRef.current) {
      searchRef.current.clearInput();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderSearchResults = () => (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Search Results
      </Typography>
      <Grid container spacing={3}>
        {searchState.results.map((movie: any) => (
          <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
            <Card
              onClick={() => router.push(`/movie/${movie.id}`)}
              sx={{
                cursor: 'pointer',
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 3,
                transition: 'transform 0.3s, box-shadow 0.3s',
                position: 'relative',
                '&:hover': { transform: 'scale(1.03)', boxShadow: 6 },
              }}
            >
              <CardMedia
                component="img"
                image={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
                sx={{ height: 450 }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  py: 1,
                  px: 1.5,
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2))',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: 'white',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {movie.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white' }}>
                  {movie.release_date
                    ? new Date(movie.release_date).getFullYear()
                    : ''}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      {searchState.results.length === 0 && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          No results found.
        </Typography>
      )}
      <Button variant="contained" sx={{ mt: 4 }} onClick={handleClearSearch}>
        Clear Search
      </Button>
    </Box>
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Render nothing if not authenticated
  if (!isAuthenticated) {
    return <SignIn />;
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" gutterBottom>
        Discover Movies
      </Typography>
      {isAuthenticated && (
        <Box sx={{ mb: 4 }}>
          <Search ref={searchRef} onSearchComplete={handleSearchComplete} />
        </Box>
      )}
      {searchState.results.length > 0 ? (
        renderSearchResults()
      ) : (
        <>{view === 'toprated' ? <TopRatedMovies /> : <PopularMovies />}</>
      )}
    </Box>
  );
};

export default HomePage;
