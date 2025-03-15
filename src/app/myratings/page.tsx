/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  Button,
  CircularProgress,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { fetchMyRatedMovies, rateMovie, deleteMovieRating } from '@/api/tmdb';
import RatingStars from '@/components/RatingStars';
import SignIn from '@/components/SignIn';

const MyRatingsPage: React.FC = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingMovieId, setEditingMovieId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const sessionId = useSelector((state: RootState) => state.auth.sessionId);

  const loadRatedMovies = async () => {
    try {
      if (!sessionId) {
        setError('You are not signed in.');
        setLoading(false);
        return;
      }
      const data = (await fetchMyRatedMovies(sessionId)) as { results: any[] };
      const ratedMovies = data.results.map((movie: any) => ({
        ...movie,
        user_rating: movie.rating,
      }));
      setMovies(ratedMovies);
    } catch (err: any) {
      setError('Failed to load rated movies.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadRatedMovies();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, sessionId]);

  const handleEditClick = (movieId: number) => {
    setEditingMovieId(movieId);
  };

  const handleUpdateRating = async (movieId: number, newRating: number) => {
    if (!sessionId) {
      alert('You must be signed in to update a rating.');
      return;
    }
    try {
      await rateMovie(movieId, newRating, sessionId);
      alert('Rating updated successfully!');
      setEditingMovieId(null);
      loadRatedMovies();
    } catch (err: any) {
      console.error('Rating update error:', err.message);
      alert('Failed to update rating.');
    }
  };

  const handleDeleteRating = async (movieId: number) => {
    if (!sessionId) {
      alert('You must be signed in to delete a rating.');
      return;
    }
    try {
      await deleteMovieRating(movieId, sessionId);
      alert('Rating deleted successfully!');
      loadRatedMovies();
    } catch (err: any) {
      console.error('Rating deletion error:', err.message);
      alert('Failed to delete rating.');
    }
  };

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

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, transition: 'all 0.3s' }}>
      <Typography variant="h4" gutterBottom>
        My Ratings
      </Typography>
      {error ? (
        <Typography color="error">{error}</Typography>
      ) : !isAuthenticated ? (
        <SignIn />
      ) : (
        <Grid container spacing={3}>
          {movies.map((movie) => (
            <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ p: 1, transition: 'all 0.3s' }}>
                <CardMedia
                  component="img"
                  image={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => router.push(`/movie/${movie.id}`)}
                />
                <Typography
                  variant="subtitle1"
                  noWrap
                  sx={{ mt: 1, textAlign: 'center' }}
                >
                  {movie.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ textAlign: 'center' }}
                >
                  {new Date(movie.release_date).getFullYear()}
                </Typography>
                <Box sx={{ textAlign: 'center', mt: 1 }}>
                  {editingMovieId === movie.id ? (
                    <RatingStars
                      initialRating={movie.user_rating}
                      onRate={(newRating) =>
                        handleUpdateRating(movie.id, newRating)
                      }
                    />
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      Rating: {movie.user_rating}
                    </Typography>
                  )}
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    mt: 1,
                  }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleEditClick(movie.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleDeleteRating(movie.id)}
                  >
                    Delete
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default MyRatingsPage;
