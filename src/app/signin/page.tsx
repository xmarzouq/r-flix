'use client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRequestToken } from '@/api/tmdb';
import { Box, Button, Typography } from '@mui/material';
import { RootState, AppDispatch } from '@/store/store';
import { setRequestToken } from '@/store/authSlice';

const SignInPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const requestToken = useSelector(
    (state: RootState) => state.auth.requestToken
  );

  useEffect(() => {
    if (requestToken) {
      console.log('Request token:', requestToken);
    }
  }, [requestToken]);
  const handleSignIn = async () => {
    try {
      let token = requestToken;
      if (!token) {
        token = await fetchRequestToken();
        if (token) {
          dispatch(setRequestToken(token));
        }
      }

      const tmdbAuthUrl = `https://www.themoviedb.org/authenticate/${token}?redirect_to=http://127.0.0.1:3000/auth/callback`;
      window.location.href = tmdbAuthUrl;
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Sign-in failed:', err.message);
      } else {
        console.error('Sign-in failed:', err);
      }
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mt: 10,
        p: 3,
        border: '1px solid #ccc',
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Sign In
      </Typography>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSignIn}
        sx={{ mt: 2 }}
      >
        Sign in with TMDb
      </Button>
    </Box>
  );
};

export default SignInPage;
