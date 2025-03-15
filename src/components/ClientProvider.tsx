'use client';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { useDispatch } from 'react-redux';
import { setSessionId, setAuthenticated } from '@/store/authSlice';

interface ClientProviderProps {
  children: React.ReactNode;
}

export function ClientProvider({ children }: ClientProviderProps) {
  // Everything here will run only on the client because of "use client"
  const sessionId =
    typeof window !== 'undefined'
      ? localStorage.getItem('tmdb_session_id')
      : null;

  useEffect(() => {
    if (sessionId) {
      // Accessing store.dispatch directly because we're not inside a Redux-connected component
      store.dispatch(setSessionId(sessionId));
      store.dispatch(setAuthenticated());
    }
  }, [sessionId]);

  return <Provider store={store}>{children}</Provider>;
}
