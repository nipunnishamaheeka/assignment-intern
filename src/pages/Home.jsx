import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box,
  Container,
  Typography,
  CircularProgress,
  Paper,
  Fade,
  Chip,
  IconButton,
  Divider,
  Grid,
  TextField,
  Alert,
  Button,
  Drawer,
  Card,
  CardActionArea,
  Avatar,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Search as SearchIcon,
  RestaurantMenu,
  TrendingUp,
  Fastfood,
  LocalPizza,
  Restaurant,
  FreeBreakfast,
  Clear,
  FilterList,
  Timer,
  SoupKitchen,
  EggAlt
} from '@mui/icons-material';
import RecipeCard from '../components/recipes/RecipeCard';
import FilterPanel from '../components/filters/Filter';
import { fetchAllRecipes } from '../store/recipeSlice';
import { useTheme as useAppTheme } from '../components/features/ThemeProvider';

const Home = () => {
  const dispatch = useDispatch();
  const { recipes, loading, error } = useSelector((state) => state.recipes);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Trending');
  const [filters, setFilters] = useState({
    dietary: [],
    cookingTime: [0, 120],
    difficulty: '',
    searchTerm: ''
  });
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  
  // Add theme hooks for dark mode detection
  const theme = useTheme();
  const { darkMode } = useAppTheme();

  useEffect(() => {
    dispatch(fetchAllRecipes());
  }, [dispatch]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setFilterDrawerOpen(false);
  };

  const toggleFilterDrawer = () => {
    setFilterDrawerOpen(!filterDrawerOpen);
  };

  // Apply all filters to recipes
  const filteredRecipes = recipes.filter(recipe => {
    // ...existing filtering logic...
    const matchesSearch = searchTerm === '' || 
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.ingredients.some(ing => ing.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDietary = filters.dietary.length === 0 || 
      filters.dietary.every(diet => recipe.dietary && recipe.dietary.includes(diet));
    
    const cookingTimeInRange = 
      recipe.cookingTime >= filters.cookingTime[0] && 
      recipe.cookingTime <= filters.cookingTime[1];
    
    const matchesDifficulty = !filters.difficulty || recipe.difficulty === filters.difficulty;
    
    const matchesCategory = selectedCategory === 'Trending' || recipe.category === selectedCategory;
    
    return matchesSearch && matchesDietary && cookingTimeInRange && matchesDifficulty && matchesCategory;
  });

  const categories = [
    { label: 'Trending', icon: <TrendingUp /> },
    { label: 'Breakfast', icon: <FreeBreakfast /> },
    { label: 'Lunch', icon: <Restaurant /> },
    { label: 'Dinner', icon: <RestaurantMenu /> },
    { label: 'Fast Food', icon: <Fastfood /> },
    { label: 'Pizza', icon: <LocalPizza /> }
  ];

  const activeFiltersCount = [
    filters.dietary.length > 0,
    filters.difficulty !== '',
    (filters.cookingTime[0] > 0 || filters.cookingTime[1] < 120)
  ].filter(Boolean).length;

  return (
    <Container maxWidth="lg" sx={{ py: 0 }}>
      {/* Hero section - Fixed for dark mode */}
      <Box 
        sx={{ 
          mb: 2, 
          p: 4, 
          borderRadius: 4,
          background: darkMode 
            ? 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)'
            : 'linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%)',
          boxShadow: darkMode
            ? '0px 10px 30px rgba(0, 0, 0, 0.3)'
            : '0px 10px 30px rgba(0, 0, 0, 0.05)'
        }}
      >
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontWeight: 800,
            mb: 2,
            background: darkMode
              ? 'linear-gradient(90deg, #90caf9 0%, #42a5f5 100%)'
              : 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Discover Delicious Recipes
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, fontWeight: 400 }}>
          Find and explore thousands of tasty recipes for any meal, occasion, or dietary preference.
        </Typography>

        {/* Search bar */}
        <Paper 
          elevation={0} 
          sx={{ 
            display: 'flex',
            p: 0.5,
            pl: 2,
            borderRadius: 8,
            boxShadow: darkMode
              ? '0 8px 20px rgba(0, 0, 0, 0.3)'
              : '0 8px 20px rgba(0, 0, 0, 0.08)',
            bgcolor: 'background.paper'
          }}
        >
          <TextField
            fullWidth
            placeholder="Search recipes or ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="standard"
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <SearchIcon color="action" sx={{ mr: 1 }} />
              ),
              endAdornment: searchTerm && (
                <IconButton size="small" onClick={handleClearSearch}>
                  <Clear fontSize="small" />
                </IconButton>
              )
            }}
          />
          <Button 
            variant="contained" 
            color="primary"
            onClick={toggleFilterDrawer}
            startIcon={<FilterList />}
            sx={{ 
              borderRadius: 6,
              px: 3,
              py: 1.5
            }}
          >
            {activeFiltersCount > 0 ? `Filters (${activeFiltersCount})` : 'Filters'}
          </Button>
        </Paper>
      </Box>

      {/* Categories section - Fixed for dark mode */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          Categories
        </Typography>
        <Grid container spacing={1}>
          {categories.map((category) => (
            <Grid item xs={4} sm={3} key={category.label}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 2,
                  transition: 'all 0.2s ease',
                  border: selectedCategory === category.label 
                    ? `1px solid ${theme.palette.primary.main}` 
                    : `1px solid ${theme.palette.divider}`,
                  backgroundColor: selectedCategory === category.label 
                    ? (darkMode ? alpha(theme.palette.primary.main, 0.2) : '#e3f2fd')
                    : theme.palette.background.paper,
                }}
              >
                <CardActionArea 
                  sx={{ 
                    py: 1.5, 
                    px: 1, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    minHeight: '60px'
                  }}
                  onClick={() => handleCategorySelect(category.label)}
                >
                  <Box sx={{ 
                    fontSize: '18px', 
                    mb: 0.5, 
                    color: selectedCategory === category.label 
                      ? 'primary.main' 
                      : 'text.secondary' 
                  }}>
                    {category.icon}
                  </Box>
                  <Typography 
                    variant="body2" 
                    component="span"
                    sx={{ 
                      fontWeight: selectedCategory === category.label ? 600 : 400,
                      color: selectedCategory === category.label ? 'primary.main' : 'text.primary',
                      textAlign: 'center',
                      lineHeight: 1.2
                    }}
                  >
                    {category.label}
                  </Typography>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Active filters */}
      {(filters.dietary.length > 0 || filters.difficulty || filters.cookingTime[0] > 0 || filters.cookingTime[1] < 120) && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
            Active Filters
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {filters.dietary.map(diet => (
              <Chip 
                key={diet} 
                label={diet.charAt(0).toUpperCase() + diet.slice(1)} 
                onDelete={() => {
                  setFilters(prev => ({
                    ...prev,
                    dietary: prev.dietary.filter(d => d !== diet)
                  }));
                }}
                color="primary"
                size="medium"
                icon={<EggAlt />}
                sx={{ borderRadius: 3, px: 0.5 }}
              />
            ))}
            {filters.difficulty && (
              <Chip 
                label={`Difficulty: ${filters.difficulty}`} 
                onDelete={() => {
                  setFilters(prev => ({
                    ...prev,
                    difficulty: ''
                  }));
                }}
                color="primary"
                size="medium"
                icon={<SoupKitchen />}
                sx={{ borderRadius: 3, px: 0.5 }}
              />
            )}
            {(filters.cookingTime[0] > 0 || filters.cookingTime[1] < 120) && (
              <Chip 
                label={`${filters.cookingTime[0]}-${filters.cookingTime[1]} min`} 
                onDelete={() => {
                  setFilters(prev => ({
                    ...prev,
                    cookingTime: [0, 120]
                  }));
                }}
                color="primary"
                size="medium"
                icon={<Timer />}
                sx={{ borderRadius: 3, px: 0.5 }}
              />
            )}
            <Chip 
              label="Clear all" 
              onClick={() => {
                setFilters({
                  dietary: [],
                  cookingTime: [0, 120],
                  difficulty: '',
                  searchTerm: ''
                });
              }}
              size="medium"
              variant="outlined"
              sx={{ borderRadius: 3 }}
            />
          </Box>
        </Box>
      )}

      {/* Recipe results */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          {selectedCategory} Recipes
          {searchTerm && ` • "${searchTerm}"`}
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress size={60} thickness={4} />
          </Box>
        ) : error ? (
          <Alert 
            severity="error" 
            sx={{ 
              my: 2, 
              borderRadius: 3,
              boxShadow: darkMode
                ? '0 4px 12px rgba(255, 0, 0, 0.2)'
                : '0 4px 12px rgba(211, 47, 47, 0.2)'
            }}
          >
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
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      textAlign: 'center', 
                      py: 8,
                      px: 4,
                      borderRadius: 4,
                      boxShadow: darkMode
                        ? '0 6px 24px rgba(0, 0, 0, 0.2)'
                        : '0 6px 24px rgba(0, 0, 0, 0.05)',
                      background: darkMode
                        ? 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)'
                        : 'linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%)'
                    }}
                  >
                    <RestaurantMenu sx={{ fontSize: 80, color: 'text.disabled', mb: 2, opacity: 0.6 }} />
                    <Typography variant="h5" color="text.secondary" gutterBottom sx={{ fontWeight: 500 }}>
                      No recipes found
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Try adjusting your search terms or filters
                    </Typography>
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      sx={{ mt: 3, borderRadius: 6, px: 3 }}
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('Trending');
                        setFilters({
                          dietary: [],
                          cookingTime: [0, 120],
                          difficulty: '',
                          searchTerm: ''
                        });
                      }}
                    >
                      Clear all filters
                    </Button>
                  </Paper>
                </Grid>
              )}
            </Grid>

            {filteredRecipes.length > 0 && (
              <Box sx={{ mt: 6, textAlign: 'center' }}>
                <Divider sx={{ mb: 4 }} />
                <Typography variant="body1" color="text.secondary">
                  Showing {filteredRecipes.length} of {recipes.length} recipes
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Filter drawer */}
      <Drawer
        anchor="right"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
            width: { xs: 300, sm: 400 },
          }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
            Filter Recipes
          </Typography>
          <FilterPanel
            currentFilters={filters}
            onFilterChange={handleFilterChange}
          />
          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            <Button 
              variant="outlined" 
              fullWidth
              onClick={() => setFilterDrawerOpen(false)}
              sx={{ borderRadius: 6, py: 1.5 }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              fullWidth
              onClick={() => handleFilterChange(filters)}
              sx={{ borderRadius: 6, py: 1.5 }}
            >
              Apply Filters
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Container>
  );
};

export default Home;