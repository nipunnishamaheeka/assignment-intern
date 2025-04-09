import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import recipeReducer from './recipeSlice';
import favoriteReducer from './favoriteSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    recipes: recipeReducer,
    favorites: favoriteReducer,
  },
});

export default store;