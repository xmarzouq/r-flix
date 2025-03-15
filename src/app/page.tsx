'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { RootState } from '@/store/store';
import { clearSession } from '@/store/authSlice';
import SignIn from '@/components/SignIn';
import FeatureCard from '@/components/FeatureCard';

const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('tmdb_session_id');
    dispatch(clearSession());
  };

  return loading ? (
    <>
      <Typography variant="h3" gutterBottom>
        Welcome to R-flix
      </Typography>
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
    </>
  ) : (
    <Box sx={{ p: 2 }}>
      {isAuthenticated ? (
        <>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              mt: 4,
            }}
          >
            <FeatureCard
              title="My Rating"
              description="View and manage your rated movies."
              route="/myratings"
            />
            <FeatureCard
              title="Popular Movies"
              description="Browse the most popular movies."
              route="/home?view=popular"
            />
            <FeatureCard
              title="Top Rated"
              description="Check out the top-rated movies."
              route="/home?view=toprated"
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 4,
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </Box>
        </>
      ) : (
        <SignIn />
      )}
    </Box>
  );
};

export default HomePage;
