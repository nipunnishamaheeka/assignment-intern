import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:3000';

export const fetchFavoriteRecipes = createAsyncThunk(
  'favorites/fetchRecipes',
  async (favoriteIds, { rejectWithValue }) => {
    try {
      // Only proceed if we have favorite ids to look up
      if (!favoriteIds || favoriteIds.length === 0) {
        return [];
      }
      
      // Fetch all recipes data
      const response = await fetch(`${API_URL}/recipes`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
      
      const recipes = await response.json();
      
      // Filter recipes to only include those that match the favorite ids
      const favoriteRecipes = recipes.filter(recipe => 
        favoriteIds.includes(recipe.id)
      );
      
      return favoriteRecipes;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load favorite recipes');
    }
  }
);

export const updateUserFavorites = createAsyncThunk(
  'favorites/updateUserFavorites',
  async ({ userId, favorites }, { rejectWithValue }) => {
    try {
      // Get current user data
      const userResponse = await fetch(`${API_URL}/users/${userId}`);
      if (!userResponse.ok) {
        throw new Error('User not found');
      }
      
      const userData = await userResponse.json();
      
      // Update favorites
      const updatedUser = { ...userData, favorites };
      
      const updateResponse = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser)
      });
      
      if (!updateResponse.ok) {
        throw new Error('Failed to update favorites');
      }
      
      return favorites;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState: {
    favorites: [], // Will be populated from user data
    favoriteRecipes: [],
    loading: false,
    error: null
  },
  reducers: {
    setFavorites: (state, action) => {
      state.favorites = action.payload;
    },
    toggleFavorite: (state, action) => {
      const recipeId = action.payload;
      if (state.favorites.includes(recipeId)) {
        state.favorites = state.favorites.filter(id => id !== recipeId);
        state.favoriteRecipes = state.favoriteRecipes.filter(recipe => recipe.id !== recipeId);
      } else {
        state.favorites.push(recipeId);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavoriteRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavoriteRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.favoriteRecipes = action.payload;
      })
      .addCase(fetchFavoriteRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(updateUserFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;
      });
  }
});

export const { setFavorites, toggleFavorite } = favoriteSlice.actions;
export default favoriteSlice.reducer;