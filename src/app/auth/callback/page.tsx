'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Box, Typography, CircularProgress } from '@mui/material';
import { createSession } from '@/api/tmdb';
import { setSessionId, setAuthenticated } from '@/store/authSlice';

const CallbackPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleCallback() {
      const params = new URLSearchParams(window.location.search);
      const request_token = params.get('request_token');
      const approved = params.get('approved');

      if (!request_token || approved !== 'true') {
        setError('Authorization was not approved or request token is missing.');
        return;
      }

      try {
        const sessionId = await createSession(request_token);
        localStorage.setItem('tmdb_session_id', sessionId);
        dispatch(setSessionId(sessionId));
        dispatch(setAuthenticated());
        router.push('/home');
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(`Error creating session: ${err.message}`);
        } else {
          setError('Error creating session');
        }
      }
    }

    handleCallback();
  }, [dispatch, router]);

  return (
    <Box>
      {error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Box sx={{ textAlign: 'center', mt: 10 }}>
          <CircularProgress />
          <Typography variant="body1">Completing sign-in...</Typography>
        </Box>
      )}
    </Box>
  );
};

export default CallbackPage;
