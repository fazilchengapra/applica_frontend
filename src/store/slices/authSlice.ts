import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserProfile {
  first_name: string;
  last_name: string;
  avatar_url: string;
}

export interface User {
  id: number;
  email: string;
  phone_number: string;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  date_joined: string;
  profile: UserProfile;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Starts loading since we verify on mount
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }
  },
});

export const { setUser, clearUser, setLoading } = authSlice.actions;
export default authSlice.reducer;
