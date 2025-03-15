'use client';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { setSessionId, setAuthenticated } from '@/store/authSlice';

interface ClientProviderProps {
  children: React.ReactNode;
}

export function ClientProvider({ children }: ClientProviderProps) {
  const sessionId =
    typeof window !== 'undefined'
      ? localStorage.getItem('tmdb_session_id')
      : null;

  useEffect(() => {
    if (sessionId) {
      store.dispatch(setSessionId(sessionId));
      store.dispatch(setAuthenticated());
    }
  }, [sessionId]);

  return <Provider store={store}>{children}</Provider>;
}
