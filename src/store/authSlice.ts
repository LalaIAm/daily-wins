import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  timezone: string | null;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  hasCompletedOnboarding: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  hasCompletedOnboarding: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    completeOnboarding: (state) => {
      state.hasCompletedOnboarding = true;
    },
    logout: (state) => {
      state.user = null;
      state.error = null;
      state.isLoading = false;
      // We purposefully don't reset hasCompletedOnboarding immediately upon simple logout 
      // if we want to remember it for this device, but usually logout clears session.
      // However, redux-persist might keep it. Let's keep it for now.
    },
  },
});

export const { setUser, setLoading, setError, completeOnboarding, logout } = authSlice.actions;

export default authSlice.reducer;
