import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// API base URL - replace with your json-server URL (typically http://localhost:3000)
const API_URL = 'http://localhost:3000';

export const fetchAllRecipes = createAsyncThunk(
  'recipes/fetchAll',
  async () => {
    try {
      const response = await fetch(`${API_URL}/recipes`);
      if (!response.ok) throw new Error('Failed to fetch recipes');
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
);

export const fetchRecipeById = createAsyncThunk(
  'recipes/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/recipes/${id}`);
      if (!response.ok) {
        return rejectWithValue('Recipe not found');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserRecipes = createAsyncThunk(
  'recipes/fetchUserRecipes',
  async (userId) => {
    try {
      const response = await fetch(`${API_URL}/recipes?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user recipes');
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
);

export const createRecipe = createAsyncThunk(
  'recipes/create',
  async (recipeData) => {
    try {
      const response = await fetch(`${API_URL}/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...recipeData,
          id: Date.now().toString(),
          rating: 0
        })
      });
      if (!response.ok) throw new Error('Failed to create recipe');
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
);

export const updateRecipe = createAsyncThunk(
  'recipes/update',
  async (recipeData) => {
    try {
      const response = await fetch(`${API_URL}/recipes/${recipeData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData)
      });
      if (!response.ok) throw new Error('Failed to update recipe');
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
);

const recipeSlice = createSlice({
  name: 'recipes',
  initialState: {
    recipes: [],
    userRecipes: [],
    currentRecipe: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All Recipes
      .addCase(fetchAllRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes = action.payload;
      })
      .addCase(fetchAllRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch Recipe by ID
      .addCase(fetchRecipeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRecipe = action.payload;
      })
      .addCase(fetchRecipeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Fetch User Recipes
      .addCase(fetchUserRecipes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.userRecipes = action.payload;
      })
      .addCase(fetchUserRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create Recipe
      .addCase(createRecipe.pending, (state) => {
        state.loading = true;
      })
      .addCase(createRecipe.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes.push(action.payload);
        state.userRecipes.push(action.payload);
      })
      .addCase(createRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update Recipe
      .addCase(updateRecipe.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateRecipe.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRecipe = action.payload;
        const index = state.recipes.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.recipes[index] = action.payload;
        }
        const userIndex = state.userRecipes.findIndex(r => r.id === action.payload.id);
        if (userIndex !== -1) {
          state.userRecipes[userIndex] = action.payload;
        }
      })
      .addCase(updateRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default recipeSlice.reducer;