import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  Button,
  Box,
  Divider,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Bookmark, RestaurantMenu, FavoriteBorder } from '@mui/icons-material';
import RecipeCard from '../components/recipes/RecipeCard';
import { fetchFavoriteRecipes } from '../store/favoriteSlice';

const Favorites = () => {
  const dispatch = useDispatch();
  const { favorites, favoriteRecipes, loading, error } = useSelector((state) => state.favorites);
  const { user } = useSelector((state) => state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (user) {
      dispatch(fetchFavoriteRecipes(favorites));
    }
  }, [dispatch, favorites, user]);

  if (!user) {
    return (
      <Container maxWidth="md">
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            my: 4, 
            textAlign: 'center',
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper
          }}
        >
          <FavoriteBorder sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
          <Typography variant="h5" component="h1" gutterBottom>
            Please log in to view your favorite recipes
          </Typography>
          <Button
            component={RouterLink}
            to="/login"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 2, borderRadius: 28, px: 4 }}
          >
            Log In
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <Bookmark sx={{ mr: 1, color: theme.palette.primary.main }} />
        <Typography variant="h4" component="h1" fontWeight="500">
          My Favorite Recipes
        </Typography>
      </Box>
      <Divider sx={{ mb: 4 }} />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      ) : error ? (
        <Paper
          elevation={2}
          sx={{
            p: 3,
            backgroundColor: theme.palette.error.light,
            color: theme.palette.error.contrastText,
            borderRadius: 2
          }}
        >
          <Typography variant="body1">{error}</Typography>
        </Paper>
      ) : favoriteRecipes.length === 0 ? (
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mt: 2,
            textAlign: 'center',
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper
          }}
        >
          <RestaurantMenu sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
          <Typography variant="h5" component="h2" gutterBottom>
            You haven't saved any recipes yet
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            Explore recipes and click the heart icon to add them to your favorites
          </Typography>
          <Button
            component={RouterLink}
            to="/recipes"
            variant="contained"
            color="primary"
            size="large"
            startIcon={<RestaurantMenu />}
            sx={{ mt: 2, borderRadius: 28, px: 4 }}
          >
            Discover Recipes
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {favoriteRecipes.map((recipe) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={recipe.id}>
              <RecipeCard recipe={recipe} isFavorite={true} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Favorites;