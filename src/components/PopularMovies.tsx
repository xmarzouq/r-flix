// src/components/PopularMovies.tsx
'use client';
import React, { useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import {
  fetchPopularMoviesThunk,
  fetchGenresThunk,
  fetchUserRatingsThunk,
  setPopularCurrentPage,
  setPopularSelectedGenre,
} from '@/store/movieSlice';

const PopularMovies: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { movies, currentPage, selectedGenre, error } = useSelector(
    (state: RootState) => state.movies.popular
  );
  const genresState = useSelector((state: RootState) => state.movies.genres);
  const userRatings = useSelector(
    (state: RootState) => state.movies.userRatings
  );
  const sessionId = useSelector((state: RootState) => state.auth.sessionId);

  useEffect(() => {
    dispatch(
      fetchPopularMoviesThunk({ page: currentPage, genre: selectedGenre })
    );
  }, [dispatch, currentPage, selectedGenre]);

  useEffect(() => {
    dispatch(fetchGenresThunk());
  }, [dispatch]);

  useEffect(() => {
    if (sessionId) {
      dispatch(fetchUserRatingsThunk(sessionId));
    }
  }, [dispatch, sessionId]);

  const handleGenreChange = (event: SelectChangeEvent<number>) => {
    const value = event.target.value as number | '';
    dispatch(setPopularSelectedGenre(value === '' ? null : value));
    dispatch(setPopularCurrentPage(1));
  };

  const handleCardClick = (movieId: number) => {
    router.push(`/movie/${movieId}`);
  };

  const handlePageChange = (page: number) => {
    dispatch(setPopularCurrentPage(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getGenreNames = (genreIds: number[]): string => {
    return genreIds
      .map((id) => genresState.data.find((genre) => genre.id === id)?.name)
      .filter((name) => name)
      .join(', ');
  };

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, pb: 4, transition: 'all 0.3s' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
        }}
      >
        <Typography variant="h4" sx={{ mb: { xs: 2, sm: 0 } }}>
          Popular Movies
        </Typography>
        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel id="genre-select-label">Genre</InputLabel>
          <Select
            labelId="genre-select-label"
            value={selectedGenre || ''}
            label="Genre"
            onChange={handleGenreChange}
          >
            <MenuItem value="">All Genres</MenuItem>
            {genresState.data.map((genre) => (
              <MenuItem key={genre.id} value={genre.id}>
                {genre.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Grid container spacing={3}>
        {movies.map((movie) => (
          <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
            <Card
              onClick={() => handleCardClick(movie.id)}
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
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
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
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography
                      variant="body2"
                      sx={{ color: 'white', mr: 0.5, fontSize: 14 }}
                    >
                      {userRatings[movie.id] !== undefined
                        ? userRatings[movie.id]
                        : movie.vote_average}
                    </Typography>
                    <StarIcon sx={{ color: 'yellow', fontSize: 16 }} />
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: 'white' }}>
                  {new Date(movie.release_date).getFullYear()}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white' }}>
                  {getGenreNames(movie.genre_ids)}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          variant="contained"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          sx={{ mr: 2 }}
        >
          Previous
        </Button>
        <Button
          variant="contained"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default PopularMovies;
