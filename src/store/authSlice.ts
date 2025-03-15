import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  requestToken: string | null;
  sessionId: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  requestToken: null,
  sessionId: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setRequestToken: (state, action: PayloadAction<string>) => {
      state.requestToken = action.payload;
    },
    setSessionId: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload;
    },
    setAuthenticated: (state) => {
      state.isAuthenticated = true;
    },
    clearSession: (state) => {
      state.requestToken = null;
      state.sessionId = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setRequestToken, setSessionId, setAuthenticated, clearSession } =
  authSlice.actions;
export default authSlice.reducer;
