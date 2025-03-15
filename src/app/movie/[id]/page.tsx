'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { fetchMovieDetails, rateMovie } from '@/api/tmdb';
import {
  Box,
  Card,
  CardMedia,
  Typography,
  List,
  ListItem,
  Link,
  Grid,
  Button,
  Divider,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useParams, useRouter } from 'next/navigation';
import RatingStars from '@/components/RatingStars';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface MovieDetailsData {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
  overview: string;
  runtime: number;
  genres: { id: number; name: string }[];
  homepage: string;
  imdb_id: string;
  production_companies: { id: number; name: string }[];
  credits: {
    cast: CastMember[];
    crew: CrewMember[];
  };
  reviews: {
    results: Review[];
  };
  recommendations: { results: MovieRecommendation[] };
  vote_average: number;
  user_rating?: number;
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface CrewMember {
  id: number;
  name: string;
  job: string;
  profile_path: string | null;
}

interface Review {
  id: string;
  author: string;
  content: string;
  created_at: string;
}

interface MovieRecommendation {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  user_rating?: number;
}

const MovieDetails: React.FC = () => {
  const params = useParams() as { id: string };
  const { id } = params;
  const router = useRouter();
  const [movie, setMovie] = useState<MovieDetailsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Get sessionId from Redux state
  const sessionId = useSelector((state: RootState) => state.auth.sessionId);

  const loadMovie = useCallback(async () => {
    try {
      const data = (await fetchMovieDetails(id)) as MovieDetailsData;
      setMovie(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Failed to load movie details:', err.message);
      } else {
        console.error('Failed to load movie details:', err);
      }
      setError('Failed to load movie details');
    }
  }, [id]);

  useEffect(() => {
    loadMovie();
  }, [loadMovie]);

  const handleRate = async (newRating: number) => {
    if (!sessionId) {
      alert('You must be signed in to rate a movie.');
      return;
    }
    try {
      await rateMovie(movie!.id, newRating, sessionId);
      alert('Rating submitted successfully!');
      loadMovie();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Rating error:', err.message);
      } else {
        console.error('Rating error:', err);
      }
      alert('Failed to submit rating.');
    }
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!movie) {
    return <Typography>Loading...</Typography>;
  }

  const directors = movie.credits.crew.filter(
    (crew) => crew.job === 'Director'
  );
  const cast = movie.credits.cast.slice(0, 5);
  const reviews = movie.reviews.results.slice(0, 5);
  const recommendations = movie.recommendations.results.slice(0, 20);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            {movie.title} ({new Date(movie.release_date).getFullYear()})
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {movie.overview}
          </Typography>
          <List>
            <ListItem>Runtime: {movie.runtime} minutes</ListItem>
            <ListItem>
              Genres: {movie.genres.map((g) => g.name).join(', ')}
            </ListItem>
            <ListItem>
              Homepage:{' '}
              <Link href={movie.homepage} target="_blank" rel="noopener">
                {movie.homepage}
              </Link>
            </ListItem>
            <ListItem>
              IMDb:{' '}
              <Link
                href={`https://www.imdb.com/title/${movie.imdb_id}`}
                target="_blank"
                rel="noopener"
              >
                IMDb Page
              </Link>
            </ListItem>
            {directors.length > 0 && (
              <ListItem>
                Director{directors.length > 1 ? 's' : ''}:{' '}
                {directors.map((d) => d.name).join(', ')}
              </ListItem>
            )}
            {movie.production_companies.length > 0 && (
              <ListItem>
                Production:{' '}
                {movie.production_companies.map((p) => p.name).join(', ')}
              </ListItem>
            )}
          </List>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Rate this Movie
            </Typography>
            <RatingStars
              initialRating={movie.user_rating || movie.vote_average}
              onRate={handleRate}
            />
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Cast
        </Typography>
        <Grid container spacing={2}>
          {cast.map((actor) => (
            <Grid item key={actor.id} xs={6} sm={4} md={3}>
              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
              >
                {actor.profile_path ? (
                  <CardMedia
                    component="img"
                    image={`https://image.tmdb.org/t/p/w300${actor.profile_path}`}
                    alt={actor.name}
                    sx={{ height: 200 }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 200,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'grey.300',
                    }}
                  >
                    <Typography variant="caption">No Image</Typography>
                  </Box>
                )}
                <Box sx={{ p: 1 }}>
                  <Typography variant="subtitle1" noWrap>
                    {actor.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" noWrap>
                    as {actor.character}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {reviews.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            User Reviews
          </Typography>
          {reviews.map((review) => (
            <Box
              key={review.id}
              sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 2 }}
            >
              <Typography variant="subtitle1" gutterBottom>
                {review.author}
              </Typography>
              <Typography variant="body2">
                {review.content.length > 300
                  ? review.content.slice(0, 300) + '...'
                  : review.content}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          You Might Also Enjoy
        </Typography>
        {recommendations.length > 0 ? (
          <Box sx={{ display: 'flex', overflowX: 'auto', py: 2 }}>
            {recommendations.map((rec) => (
              <Box
                key={rec.id}
                sx={{ minWidth: 180, mr: 2, cursor: 'pointer', flexShrink: 0 }}
                onClick={() => router.push(`/movie/${rec.id}`)}
              >
                <Card>
                  <CardMedia
                    component="img"
                    image={`https://image.tmdb.org/t/p/w300${rec.poster_path}`}
                    alt={rec.title}
                    sx={{ height: 270 }}
                  />
                </Card>
                <Typography variant="subtitle1" noWrap sx={{ mt: 1 }}>
                  {rec.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {new Date(rec.release_date).getFullYear()}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mr: 0.5 }}
                  >
                    {rec.user_rating ? rec.user_rating : rec.vote_average}
                  </Typography>
                  <StarIcon sx={{ color: 'yellow', fontSize: 16 }} />
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography>No recommendations available.</Typography>
        )}
      </Box>
      <Box sx={{ mt: 4 }}>
        <Button variant="contained" onClick={() => router.back()}>
          Back
        </Button>
      </Box>
    </Box>
  );
};

export default MovieDetails;
