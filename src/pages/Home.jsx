import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Container, 
  Typography, 
  CircularProgress,
  InputBase,
  Paper,
  Fade,
  Chip,
  IconButton,
  Divider,
  Grid,
  useTheme,
  useMediaQuery,
  InputAdornment,
  TextField,
  Alert,
  styled
} from '@mui/material';
import { 
  Search as SearchIcon,
  RestaurantMenu,
  TrendingUp,
  Fastfood,
  LocalPizza,
  Restaurant,
  FreeBreakfast,
  Clear
} from '@mui/icons-material';
import RecipeCard from '../components/recipes/RecipeCard';
import { fetchAllRecipes } from '../store/recipeSlice';

// Styled components
const SearchBar = styled(Paper)(({ theme }) => ({
  padding: '2px 12px',
  display: 'flex',
  alignItems: 'center',
  borderRadius: 50,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s ease',
  '&:hover, &:focus-within': {
    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.12)',
    transform: 'translateY(-2px)'
  }
}));

const CategoryChip = styled(Chip)(({ theme, selected }) => ({
  margin: theme.spacing(0.5),
  transition: 'all 0.2s ease',
  fontWeight: selected ? 600 : 400,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 3px 8px rgba(0, 0, 0, 0.1)'
  }
}));

const PageTitle = styled(Typography)(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
  fontWeight: 700,
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: 60,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.palette.primary.main
  }
}));

const categories = [
  { label: 'Trending', icon: <TrendingUp fontSize="small" /> },
  { label: 'Breakfast', icon: <FreeBreakfast fontSize="small" /> },
  { label: 'Lunch', icon: <Restaurant fontSize="small" /> },
  { label: 'Dinner', icon: <RestaurantMenu fontSize="small" /> },
  { label: 'Fast Food', icon: <Fastfood fontSize="small" /> },
  { label: 'Pizza', icon: <LocalPizza fontSize="small" /> }
];

const Home = () => {
  const dispatch = useDispatch();
  const { recipes, loading, error } = useSelector((state) => state.recipes);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Trending');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    dispatch(fetchAllRecipes());
  }, [dispatch]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    // In a real app, you might dispatch an action to filter by category
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.ingredients.some(ing => ing.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  //maxWidth="sm" sx={{ py: 8, height: '100vh', display: 'flex', alignItems: 'center' }}
  return (
    <Container maxWidth="lg" sx={{ py: 8, height: '100vh', alignItems: 'center' }}>
      <Box sx={{ mb: 6 }}>
        <PageTitle variant={isMobile ? "h5" : "h4"} component="h1" sx={{ mb: 2 }}>
          Discover Delicious Recipes
        </PageTitle>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
          Find and explore thousands of tasty recipes for any meal, occasion, or dietary preference.
        </Typography>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' }, 
        justifyContent: 'space-between',
        alignItems: { xs: 'stretch', md: 'center' },
        gap: 2,
        mb: 4 
      }}>
        <TextField
          fullWidth
          placeholder="Search recipes or ingredients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ 
            maxWidth: { xs: '100%', md: '400px' },
            '& .MuiOutlinedInput-root': {
              borderRadius: 50,
              pl: 1
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClearSearch}>
                  <Clear fontSize="small" />
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <Box sx={{ 
          overflow: 'auto', 
          whiteSpace: 'nowrap',
          py: 1,
          '&::-webkit-scrollbar': { height: 6 },
          '&::-webkit-scrollbar-thumb': { background: theme.palette.grey[300], borderRadius: 3 }
        }}>
          {categories.map((category) => (
            <CategoryChip
              key={category.label}
              label={category.label}
              icon={category.icon}
              selected={selectedCategory === category.label}
              color={selectedCategory === category.label ? "primary" : "default"}
              variant={selectedCategory === category.label ? "filled" : "outlined"}
              onClick={() => handleCategorySelect(category.label)}
              clickable
            />
          ))}
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      ) : (
        <>
          <Grid container spacing={3}>
            {filteredRecipes.length > 0 ? (
              filteredRecipes.map((recipe, index) => (
                <Fade in={true} timeout={300 + (index * 100)} key={recipe.id}>
                  <Grid item xs={12} sm={6} md={4}>
                    <RecipeCard recipe={recipe} />
                  </Grid>
                </Fade>
              ))
            ) : (
              <Grid item xs={12}>
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 8,
                  bgcolor: 'background.paper', 
                  borderRadius: 2,
                  boxShadow: 1
                }}>
                  <RestaurantMenu sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No recipes found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try a different search term or browse categories
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>

          {filteredRecipes.length > 0 && (
            <Box sx={{ mt: 6, textAlign: 'center' }}>
              <Divider sx={{ mb: 4 }} />
              <Typography variant="body2" color="text.secondary">
                Showing {filteredRecipes.length} of {recipes.length} recipes
              </Typography>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Home;