import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// This is a mock API. In a real app, you would make an actual API call
const mockFindRecipes = async (ids) => {
  // Mock recipe data - same as in recipeSlice
  const mockRecipes = [
    {
      id: '1',
      userId: '1',
      title: 'Creamy Garlic Pasta',
      description: 'A delicious creamy pasta dish with garlic flavor',
      cookingTime: 30,
      rating: 4.8,
      imageUrl: 'https://gimmedelicious.com/wp-content/uploads/2024/01/Creamy-Garlic-Shrimp-Pasta-sq.jpg',
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
      id: '3',
      userId: '1',
      title: 'Chicken Stir Fry',
      description: 'Quick and healthy stir fry with fresh vegetables',
      cookingTime: 25,
      rating: 4.6,
      imageUrl: 'https://cookingorgeous.com/wp-content/uploads/2020/12/chicken-stirfry-noodles-recipe-2-1.jpg',
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
  
  return mockRecipes.filter(recipe => ids.includes(recipe.id));
};

export const fetchFavoriteRecipes = createAsyncThunk(
  'favorites/fetchRecipes',
  async (favoriteIds) => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(async () => {
        const recipes = await mockFindRecipes(favoriteIds);
        resolve(recipes);
      }, 1000);
    });
  }
);

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState: {
    favorites: ['1', '3'],  // These would come from the user object in a real app
    favoriteRecipes: [],
    loading: false,
    error: null
  },
  reducers: {
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
        state.error = action.error.message;
      });
  }
});

export const { toggleFavorite } = favoriteSlice.actions;
export default favoriteSlice.reducer;