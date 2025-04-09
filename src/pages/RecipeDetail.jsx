import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  Rating,
  Box,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Tooltip,
  alpha,
  useTheme,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  AccessTime,
  Edit,
  Delete,
  ArrowBack,
  ExpandMore,
  ExpandLess,
  Timer,
  Print,
  Share,
  NavigateBefore,
  NavigateNext,
  CheckCircle
} from '@mui/icons-material';
import { fetchRecipeById } from '../store/recipeSlice';
import { toggleFavorite } from '../store/favoriteSlice';
import CookingTimer from '../components/features/CookingTimer';
import SocialSharing from '../components/features/SocialSharing';
const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentRecipe, loading, error } = useSelector((state) => state.recipes);
  const { favorites } = useSelector((state) => state.favorites);
  const { user } = useSelector((state) => state.auth);
  const [showTimer, setShowTimer] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    if (id) {
      dispatch(fetchRecipeById(id));
      window.scrollTo(0, 0);
    }
  }, [dispatch, id]);

  const isInFavorites = favorites.some(favId => favId === currentRecipe?.id);
  const isOwner = user?.id === currentRecipe?.userId;

  const handleFavoriteToggle = () => {
    if (currentRecipe) {
      dispatch(toggleFavorite(currentRecipe.id));
    }
  };

  const handleEdit = () => {
    navigate(`/recipes/edit/${currentRecipe.id}`);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // Dispatch delete action and redirect
    setDeleteDialogOpen(false);
    navigate('/');
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleNextStep = () => {
    if (currentRecipe && activeStep < currentRecipe.instructions.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '80vh' 
      }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            borderRadius: 2, 
            textAlign: 'center',
            bgcolor: alpha(theme.palette.error.main, 0.1)
          }}
        >
          <Typography variant="h5" color="error" gutterBottom>
            Something went wrong
          </Typography>
          <Typography color="error.main">
            {error}
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<ArrowBack />} 
            onClick={() => navigate('/')}
            sx={{ mt: 3 }}
          >
            Go back to recipes
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!currentRecipe) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Recipe not found
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<ArrowBack />} 
            onClick={() => navigate('/')}
            sx={{ mt: 3 }}
          >
            Browse recipes
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <>
      <Box 
        sx={{
          position: 'relative',
          height: '40vh',
          overflow: 'hidden',
          mb: 6
        }}
      >
        <Box
          component="img"
          src={currentRecipe.imageUrl}
          alt={currentRecipe.title}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(70%)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)'
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <IconButton 
            aria-label="back"
            onClick={() => navigate('/')}
            sx={{ 
              position: 'absolute', 
              top: 16, 
              left: 16, 
              bgcolor: 'rgba(255,255,255,0.8)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
            }}
          >
            <ArrowBack />
          </IconButton>
          
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              color: 'white',
              pb: 4,
              width: 'calc(100% - 48px)'
            }}
          >
            <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
              {currentRecipe.title}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Rating value={currentRecipe.rating} readOnly precision={0.5} sx={{ color: 'white' }} />
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 3 }}>
                <AccessTime sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="body1">
                  {currentRecipe.cookingTime} mins
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {currentRecipe.dietaryRestrictions?.map((diet) => (
                <Chip 
                  key={diet} 
                  label={diet} 
                  size="small"
                  sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.8),
                    color: 'white', 
                    fontWeight: 'medium' 
                  }} 
                />
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Box sx={{ 
          display: 'flex', 
          gap: 4, 
          flexDirection: { xs: 'column', md: 'row' }
        }}>
          <Box sx={{ flex: 2 }}>
            {/* Description Card */}
            <Card elevation={2} sx={{ mb: 4, borderRadius: 2, overflow: 'visible' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 2,
                  mb: 2 
                }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      About this recipe
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {isOwner && (
                      <>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Edit />}
                          onClick={handleEdit}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          startIcon={<Delete />}
                          onClick={handleDelete}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                    <Tooltip title={isInFavorites ? "Remove from favorites" : "Add to favorites"}>
                      <IconButton
                        color={isInFavorites ? "primary" : "default"}
                        onClick={handleFavoriteToggle}
                        sx={{ 
                          bgcolor: isInFavorites ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                          '&:hover': {
                            bgcolor: isInFavorites 
                              ? alpha(theme.palette.primary.main, 0.2) 
                              : alpha(theme.palette.action.hover, 0.8)
                          }
                        }}
                      >
                        {isInFavorites ? <Favorite /> : <FavoriteBorder />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Print recipe">
                      <IconButton>
                        <Print />
                      </IconButton>
                    </Tooltip>
                    <SocialSharing recipe={currentRecipe} />
                    {/* <Tooltip title="Share recipe">
                      <IconButton>
                        <Share />
                      </IconButton>
                    </Tooltip> */}
                  </Box>
                </Box>
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                  {currentRecipe.description}
                </Typography>
              </CardContent>
            </Card>

            {/* Ingredients Card */}
            <Card elevation={2} sx={{ mb: 4, borderRadius: 2 }}>
              <CardContent sx={{ p: 0 }}>
                <Box 
                  sx={{ 
                    p: 3, 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    bgcolor: expandedSection === 'ingredients' 
                      ? alpha(theme.palette.primary.main, 0.08) 
                      : 'transparent',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.04)
                    }
                  }}
                  onClick={() => toggleSection('ingredients')}
                >
                  <Typography variant="h6">
                    Ingredients
                  </Typography>
                  {expandedSection === 'ingredients' ? <ExpandLess /> : <ExpandMore />}
                </Box>
                <Collapse in={expandedSection === 'ingredients' || expandedSection === null}>
                  <Divider />
                  <Box sx={{ p: 3 }}>
                    <List disablePadding>
                      {currentRecipe.ingredients.map((ingredient, index) => (
                        <ListItem 
                          key={index} 
                          disableGutters
                          disablePadding
                          sx={{ 
                            py: 1.5,
                            borderBottom: index < currentRecipe.ingredients.length - 1 
                              ? `1px solid ${alpha(theme.palette.divider, 0.5)}` 
                              : 'none'
                          }}
                        >
                          <ListItemText 
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                <Typography 
                                  component="span" 
                                  variant="body1" 
                                  fontWeight="medium"
                                  sx={{ minWidth: 100 }}
                                >
                                  {ingredient.amount} {ingredient.unit}
                                </Typography>
                                <Typography variant="body1">
                                  {ingredient.name}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              ingredient.substitutes && (
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    mt: 0.5, 
                                    color: 'text.secondary',
                                    fontStyle: 'italic',
                                    ml: 1
                                  }}
                                >
                                  Substitute: {ingredient.substitutes}
                                </Typography>
                              )
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Collapse>
              </CardContent>
            </Card>

            {/* Instructions Card */}
            <Card elevation={2} sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: 0 }}>
                <Box 
                  sx={{ 
                    p: 3, 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    bgcolor: expandedSection === 'instructions' 
                      ? alpha(theme.palette.primary.main, 0.08) 
                      : 'transparent',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.04)
                    }
                  }}
                  onClick={() => toggleSection('instructions')}
                >
                  <Typography variant="h6">
                    Instructions
                  </Typography>
                  {expandedSection === 'instructions' ? <ExpandLess /> : <ExpandMore />}
                </Box>
                <Collapse in={expandedSection === 'instructions' || expandedSection === null}>
                  <Divider />
                  <Box sx={{ p: 3 }}>
                    <List disablePadding>
                      {currentRecipe.instructions.map((step, index) => (
                        <ListItem 
                          key={index} 
                          disableGutters
                          alignItems="flex-start" 
                          sx={{ 
                            pb: 3,
                            mb: index < currentRecipe.instructions.length - 1 ? 3 : 0,
                            borderBottom: index < currentRecipe.instructions.length - 1 
                              ? `1px solid ${alpha(theme.palette.divider, 0.5)}` 
                              : 'none'
                          }}
                        >
                          <Box sx={{ display: 'flex' }}>
                            <Box
                              sx={{
                                width: 36,
                                height: 36,
                                borderRadius: '50%',
                                bgcolor: theme.palette.primary.main,
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mr: 2,
                                flexShrink: 0,
                                fontWeight: 'bold'
                              }}
                            >
                              {index + 1}
                            </Box>
                            <Typography variant="body1" sx={{ pt: 0.5, lineHeight: 1.7 }}>
                              {step}
                            </Typography>
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Collapse>
              </CardContent>
            </Card>
          </Box>

          {/* Sidebar */}
          <Box sx={{ flex: 1 }}>
            {/* Cooking Mode Card */}
            <Card elevation={2} sx={{ mb: 4, borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Cooking Mode
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Follow step-by-step instructions with a built-in timer
                </Typography>
                <Box sx={{ 
                  p: 3, 
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                  bgcolor: theme.palette.background.default,
                  mb: 2
                }}>
                  <Typography variant="body1" fontWeight="medium" gutterBottom>
                    Step {activeStep + 1} of {currentRecipe.instructions.length}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {currentRecipe.instructions[activeStep]}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                      size="small"
                      startIcon={<NavigateBefore />}
                      onClick={handlePrevStep}
                      disabled={activeStep === 0}
                    >
                      Previous
                    </Button>
                    <Button
                      size="small"
                      endIcon={<NavigateNext />}
                      onClick={handleNextStep}
                      disabled={activeStep === currentRecipe.instructions.length - 1}
                    >
                      Next
                    </Button>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Timer />}
                  onClick={() => setShowTimer(!showTimer)}
                  sx={{ mb: showTimer ? 2 : 0 }}
                >
                  {showTimer ? 'Hide Timer' : 'Start Timer'}
                </Button>
                
                {showTimer && (
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      bgcolor: theme.palette.background.default,
                      borderRadius: 1
                    }}
                  >
                    <CookingTimer initialTime={currentRecipe.cookingTime} />
                  </Paper>
                )}
              </CardContent>
            </Card>

            {/* Dietary Info Card */}
            <Card elevation={2} sx={{ mb: 4, borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Dietary Information
                </Typography>
                {currentRecipe.dietaryRestrictions?.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {currentRecipe.dietaryRestrictions.map((diet) => (
                      <Chip 
                        key={diet} 
                        label={diet} 
                        icon={<CheckCircle fontSize="small" />}
                        variant="outlined"
                        color="primary"
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No dietary information available
                  </Typography>
                )}
              </CardContent>
            </Card>

            {/* Additional recipe recommendations would go here */}
            <Card elevation={2} sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  You might also like
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Similar recipes based on your preferences
                </Typography>
                {/* Recipe suggestions would go here */}
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>

      {/* Cooking Mode Fab */}
      <Fab
        color="primary"
        aria-label="cooking mode"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: { xs: 'flex', md: 'none' }
        }}
        onClick={() => toggleSection('instructions')}
      >
        <Timer />
      </Fab>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Recipe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{currentRecipe.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RecipeDetail;