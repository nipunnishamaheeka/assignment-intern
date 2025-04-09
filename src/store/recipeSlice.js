import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock recipe data
const mockRecipes = [
  {
    id: '1',
    userId: '1',
    title: 'Creamy Garlic Pasta',
    description: 'A delicious creamy pasta dish with garlic flavor',
    cookingTime: 30,
    rating: 4.8,
    imageUrl: 'https://source.unsplash.com/random/300x200/?pasta',
    ingredients: [
      { name: 'pasta', amount: '250', unit: 'g' },
      { name: 'heavy cream', amount: '200', unit: 'ml' },
      { name: 'garlic', amount: '4', unit: 'cloves', substitutes: 'garlic powder' },
      { name: 'parmesan cheese', amount: '50', unit: 'g' }
    ],
    instructions: [
      'Boil pasta according to package instructions.',
      'In a pan, sauté minced garlic until fragrant.',
      'Pour in the heavy cream and let simmer for 3 minutes.',
      'Add the drained pasta to the sauce, stir in parmesan cheese.',
      'Season with salt and pepper to taste.'
    ],
    dietaryRestrictions: ['Vegetarian']
  },
  {
    id: '2',
    userId: '2',
    title: 'Avocado Toast',
    description: 'Simple and nutritious breakfast',
    cookingTime: 10,
    rating: 4.5,
    imageUrl: 'https://source.unsplash.com/random/300x200/?avocado-toast',
    ingredients: [
      { name: 'bread', amount: '2', unit: 'slices' },
      { name: 'avocado', amount: '1', unit: 'piece' },
      { name: 'salt', amount: '1', unit: 'pinch' },
      { name: 'red pepper flakes', amount: '1', unit: 'pinch', substitutes: 'black pepper' }
    ],
    instructions: [
      'Toast the bread until golden brown.',
      'Mash the avocado in a bowl with salt.',
      'Spread the avocado mash on the toast.',
      'Sprinkle with red pepper flakes.'
    ],
    dietaryRestrictions: ['Vegan', 'Vegetarian']
  },
  {
    id: '3',
    userId: '1',
    title: 'Chicken Stir Fry',
    description: 'Quick and healthy stir fry with fresh vegetables',
    cookingTime: 25,
    rating: 4.6,
    imageUrl: 'https://source.unsplash.com/random/300x200/?stir-fry',
    ingredients: [
      { name: 'chicken breast', amount: '300', unit: 'g' },
      { name: 'broccoli', amount: '1', unit: 'cup' },
      { name: 'carrot', amount: '1', unit: 'piece' },
      { name: 'soy sauce', amount: '3', unit: 'tbsp', substitutes: 'tamari' },
      { name: 'vegetable oil', amount: '1', unit: 'tbsp' }
    ],
    instructions: [
      'Slice chicken breast into thin strips.',
      'Heat oil in a wok over high heat.',
      'Add chicken and stir-fry until no longer pink.',
      'Add vegetables and stir-fry for 3-4 minutes.',
      'Add soy sauce and cook for another minute.',
      'Serve hot with rice.'
    ],
    dietaryRestrictions: []
  }
];

export const fetchAllRecipes = createAsyncThunk(
  'recipes/fetchAll',
  async () => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockRecipes);
      }, 1000);
    });
  }
);

export const fetchRecipeById = createAsyncThunk(
  'recipes/fetchById',
  async (id, { rejectWithValue }) => {
    // In a real app, this would be an API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const recipe = mockRecipes.find(r => r.id === id);
        if (recipe) {
          resolve(recipe);
        } else {
          reject(rejectWithValue('Recipe not found'));
        }
      }, 800);
    });
  }
);

export const fetchUserRecipes = createAsyncThunk(
  'recipes/fetchUserRecipes',
  async (userId) => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const userRecipes = mockRecipes.filter(r => r.userId === userId);
        resolve(userRecipes);
      }, 800);
    });
  }
);

export const createRecipe = createAsyncThunk(
  'recipes/create',
  async (recipeData) => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRecipe = {
          id: Date.now().toString(),
          ...recipeData,
          rating: 0
        };
        resolve(newRecipe);
      }, 1000);
    });
  }
);

export const updateRecipe = createAsyncThunk(
  'recipes/update',
  async (recipeData) => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(recipeData);
      }, 1000);
    });
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
        state.error = action.error.message;
      })
      // Fetch User Recipes
      .addCase(fetchUserRecipes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.userRecipes = action.payload;
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
      });
  }
});

export default recipeSlice.reducer;