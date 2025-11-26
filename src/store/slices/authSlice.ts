import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService, User, LoginResponse } from '@/services';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response: any = await authService.login({ emailOrPhone: email, password });
      const userResponse: any = await authService.getProfile();
      const authData = response.data || response;
      const token = authData.token;
      if (token) {
        localStorage.setItem('token', token);
        authService.setToken(token);
      }
      const user = userResponse.data || userResponse;
      return { token, user: user.user || user };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (
    data: { email: string; password: string; firstName: string; lastName: string },
    { rejectWithValue }
  ) => {
    try {
      await authService.registerUser({ email: data.email, phone: '', name: data.firstName + ' ' + data.lastName, password: data.password });
      const response: any = await authService.login({ emailOrPhone: data.email, password: data.password });
      const authData = response.data || response;
      const token = authData.token;
      if (token) {
        localStorage.setItem('token', token);
        authService.setToken(token);
      }
      const userResponse: any = await authService.getProfile();
      const user = userResponse.data || userResponse;
      return { token, user: user.user || user };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authService.logout();
    // Clear all auth data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    localStorage.removeItem('vendorId');
    localStorage.removeItem('userId');
    localStorage.removeItem('refreshToken');
    // Also clear from auth service
    authService.clearAuth();
    return null;
  } catch (error: any) {
    // Even if logout API fails, clear local data
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    authService.clearAuth();
    return rejectWithValue(error.response?.data?.message || 'Logout failed');
  }
});

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response: any = await authService.getProfile();
      const user = response.data || response;
      return user.user || user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    forceLogout: (state) => {
      // Force logout without API call (used for 401 or expired token)
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, forceLogout } = authSlice.actions;
export default authSlice.reducer;
