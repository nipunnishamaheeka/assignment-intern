import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:3000'; // Same as in other slices

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // Fetch users with matching email
      const response = await fetch(`${API_URL}/users?email=${credentials.email}`);
      
      if (!response.ok) {
        throw new Error('Server error');
      }
      
      const users = await response.json();
      const user = users.find(u => u.email === credentials.email && u.password === credentials.password);
      
      if (!user) {
        return rejectWithValue('Invalid email or password');
      }
      
      // Don't send password to the client
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (userData, { rejectWithValue }) => {
    try {
      // Check if email already exists
      const checkResponse = await fetch(`${API_URL}/users?email=${userData.email}`);
      const existingUsers = await checkResponse.json();
      
      if (existingUsers.length > 0) {
        return rejectWithValue('Email already exists');
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        avatarUrl: `https://ui-avatars.com/api/?name=${userData.name}&background=random`,
        favorites: []
      };
      
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create user');
      }
      
      const createdUser = await response.json();
      const { password, ...userWithoutPassword } = createdUser;
      return userWithoutPassword;
    } catch (error) {
      return rejectWithValue(error.message || 'Sign up failed');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      // Get the complete user data first
      const getResponse = await fetch(`${API_URL}/users/${userData.id}`);
      if (!getResponse.ok) {
        throw new Error('User not found');
      }
      
      const currentUser = await getResponse.json();
      
      // Update only the provided fields
      const updatedUser = { ...currentUser, ...userData };
      
      const response = await fetch(`${API_URL}/users/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      const result = await response.json();
      const { password, ...userWithoutPassword } = result;
      return userWithoutPassword;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      // Sign Up cases
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Sign up failed';
      })
      // Update Profile cases
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state) => {
        state.loading = false;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;