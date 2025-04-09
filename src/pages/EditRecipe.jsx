import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  IconButton,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Divider,
  CircularProgress,
  Alert,
  Box,
  Chip,
  Stack,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import {
  Add as AddIcon,
  Close as DeleteIcon,
  ArrowBack,
  Save,
  Restaurant,
  AccessTime,
  Image,
  Spa,
  ShoppingBasket,
  FormatListNumbered,
  CheckCircle
} from '@mui/icons-material';
import { fetchRecipeById, updateRecipe } from '../store/recipeSlice';

const dietaryOptions = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Keto',
  'Paleo',
  'Low-Carb'
];

const initialIngredient = { name: '', amount: '', unit: 'g', substitutes: '' };
const initialInstruction = '';

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentRecipe, loading, error } = useSelector((state) => state.recipes);
  const { user } = useSelector((state) => state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [recipeData, setRecipeData] = useState(null);
  const [loadingRecipe, setLoadingRecipe] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // Steps for the stepper interface
  const steps = [
    {
      label: "Basic Information",
      icon: <Restaurant />
    },
    {
      label: "Ingredients",
      icon: <ShoppingBasket />
    },
    {
      label: "Instructions",
      icon: <FormatListNumbered />
    }
  ];

  useEffect(() => {
    if (id) {
      dispatch(fetchRecipeById(id)).then((result) => {
        if (!result.error) {
          setLoadingRecipe(false);
          
          // Check if user is the owner of the recipe
          if (result.payload.userId !== user?.id) {
            setUnauthorized(true);
            return;
          }
          
          setRecipeData(result.payload);
        }
      });
    }
  }, [dispatch, id, user]);

  if (loadingRecipe) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      </Container>
    );
  }

  if (unauthorized) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          You are not authorized to edit this recipe.
        </Alert>
        <Button 
          startIcon={<ArrowBack />}
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{ borderRadius: 28 }}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  if (!recipeData) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          Recipe not found.
        </Alert>
        <Button 
          startIcon={<ArrowBack />}
          variant="contained"
          onClick={() => navigate('/')}
          sx={{ borderRadius: 28 }}
        >
          Back to Recipes
        </Button>
      </Container>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipeData({
      ...recipeData,
      [name]: value
    });
  };

  const handleDietaryChange = (diet) => {
    const currentDietary = [...recipeData.dietaryRestrictions];
    
    if (currentDietary.includes(diet)) {
      setRecipeData({
        ...recipeData,
        dietaryRestrictions: currentDietary.filter(item => item !== diet)
      });
    } else {
      setRecipeData({
        ...recipeData,
        dietaryRestrictions: [...currentDietary, diet]
      });
    }
  };

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...recipeData.ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [field]: value
    };
    
    setRecipeData({
      ...recipeData,
      ingredients: updatedIngredients
    });
  };

  const addIngredient = () => {
    setRecipeData({
      ...recipeData,
      ingredients: [...recipeData.ingredients, { ...initialIngredient }]
    });
  };

  const removeIngredient = (index) => {
    const updatedIngredients = [...recipeData.ingredients];
    updatedIngredients.splice(index, 1);
    
    setRecipeData({
      ...recipeData,
      ingredients: updatedIngredients
    });
  };

  const handleInstructionChange = (index, value) => {
    const updatedInstructions = [...recipeData.instructions];
    updatedInstructions[index] = value;
    
    setRecipeData({
      ...recipeData,
      instructions: updatedInstructions
    });
  };

  const addInstruction = () => {
    setRecipeData({
      ...recipeData,
      instructions: [...recipeData.instructions, initialInstruction]
    });
  };

  const removeInstruction = (index) => {
    const updatedInstructions = [...recipeData.instructions];
    updatedInstructions.splice(index, 1);
    
    setRecipeData({
      ...recipeData,
      instructions: updatedInstructions
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Add updated timestamp
    const updatedRecipeData = {
      ...recipeData,
      updatedAt: new Date().toISOString()
    };
    
    dispatch(updateRecipe(updatedRecipeData)).then((result) => {
      if (!result.error) {
        navigate(`/recipes/${id}`);
      }
    });
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate(`/recipes/${id}`)}
          variant="outlined"
          sx={{ borderRadius: 28 }}
        >
          Back to recipe
        </Button>
        <Typography variant="h4" fontWeight="500" color="primary">
          Edit Recipe
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
          {error}
        </Alert>
      )}
      
      <Paper 
        elevation={3} 
        sx={{ 
          borderRadius: 3, 
          overflow: 'hidden',
          mb: 4
        }}
      >
        <Box sx={{ 
          bgcolor: theme.palette.primary.main, 
          color: 'white', 
          p: 2,
          display: 'flex',
          alignItems: 'center'
        }}>
          <Restaurant sx={{ mr: 1 }} />
          <Typography variant="h6">
            {recipeData.title || 'Editing Recipe'}
          </Typography>
        </Box>

        <Box sx={{ p: 3 }}>
          {isMobile ? (
            // Mobile view uses vertical stepper
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel StepIconComponent={() => step.icon}>
                    {step.label}
                  </StepLabel>
                  <StepContent>
                    {getStepContent(index)}
                    <Box sx={{ mb: 2, mt: 3 }}>
                      <div>
                        <Button
                          variant="contained"
                          onClick={index === steps.length - 1 ? handleSubmit : handleNext}
                          sx={{ mt: 1, mr: 1, borderRadius: 28 }}
                        >
                          {index === steps.length - 1 ? 'Save Recipe' : 'Continue'}
                        </Button>
                        <Button
                          disabled={index === 0}
                          onClick={handleBack}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Back
                        </Button>
                      </div>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          ) : (
            // Desktop view shows all content at once
            <form onSubmit={handleSubmit}>
              <Grid container spacing={4}>
                {/* Basic Recipe Info */}
                <Grid item xs={12}>
                  <Card elevation={1} sx={{ mb: 4, borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Restaurant sx={{ mr: 1, color: theme.palette.primary.main }} />
                        Basic Information
                      </Typography>
                      
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={7}>
                          <TextField
                            label="Recipe Title"
                            name="title"
                            value={recipeData.title}
                            onChange={handleChange}
                            required
                            fullWidth
                            variant="outlined"
                            sx={{ mb: 3 }}
                          />
                          
                          <TextField
                            label="Description"
                            name="description"
                            value={recipeData.description}
                            onChange={handleChange}
                            multiline
                            rows={4}
                            fullWidth
                            variant="outlined"
                            sx={{ mb: 3 }}
                          />
                        </Grid>
                        
                        <Grid item xs={12} md={5}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <AccessTime sx={{ mr: 1, color: theme.palette.text.secondary }} />
                            <TextField
                              label="Cooking Time (minutes)"
                              name="cookingTime"
                              type="number"
                              value={recipeData.cookingTime}
                              onChange={handleChange}
                              required
                              fullWidth
                              InputProps={{ inputProps: { min: 1 } }}
                              variant="outlined"
                            />
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Image sx={{ mr: 1, color: theme.palette.text.secondary }} />
                            <TextField
                              label="Recipe Image URL"
                              name="imageUrl"
                              value={recipeData.imageUrl}
                              onChange={handleChange}
                              fullWidth
                              variant="outlined"
                            />
                          </Box>
                          
                          <Box>
                            <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Spa sx={{ mr: 1, color: theme.palette.success.main }} />
                              Dietary Options
                            </Typography>
                            
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {dietaryOptions.map((diet) => (
                                <Chip
                                  key={diet}
                                  label={diet}
                                  onClick={() => handleDietaryChange(diet)}
                                  color={recipeData.dietaryRestrictions?.includes(diet) ? "primary" : "default"}
                                  variant={recipeData.dietaryRestrictions?.includes(diet) ? "filled" : "outlined"}
                                  sx={{ m: 0.5 }}
                                />
                              ))}
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                
                {/* Ingredients Section */}
                <Grid item xs={12}>
                  <Card elevation={1} sx={{ mb: 4, borderRadius: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                          <ShoppingBasket sx={{ mr: 1, color: theme.palette.primary.main }} />
                          Ingredients
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={addIngredient}
                          size="small"
                          sx={{ borderRadius: 28 }}
                        >
                          Add Ingredient
                        </Button>
                      </Box>
                      
                      {recipeData.ingredients.map((ingredient, index) => (
                        <Card 
                          key={index} 
                          variant="outlined" 
                          sx={{ 
                            mb: 2, 
                            borderRadius: 2,
                            borderColor: theme.palette.divider,
                            '&:hover': {
                              borderColor: theme.palette.primary.light,
                              boxShadow: 1
                            }
                          }}
                        >
                          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              <Typography variant="subtitle1" fontWeight="medium">
                                Ingredient #{index + 1}
                              </Typography>
                              <IconButton 
                                onClick={() => removeIngredient(index)}
                                disabled={recipeData.ingredients.length === 1}
                                size="small"
                                color="error"
                                sx={{ 
                                  bgcolor: 'rgba(255, 0, 0, 0.08)',
                                  '&:hover': {
                                    bgcolor: 'rgba(255, 0, 0, 0.15)',
                                  }
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                            
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={6}>
                                <TextField
                                  label="Ingredient Name"
                                  value={ingredient.name}
                                  onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                                  required
                                  fullWidth
                                  variant="outlined"
                                  size="small"
                                />
                              </Grid>
                              <Grid item xs={6} md={3}>
                                <TextField
                                  label="Amount"
                                  type="number"
                                  value={ingredient.amount}
                                  onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                                  required
                                  fullWidth
                                  variant="outlined"
                                  size="small"
                                  InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                                />
                              </Grid>
                              <Grid item xs={6} md={3}>
                                <TextField
                                  select
                                  label="Unit"
                                  value={ingredient.unit}
                                  onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                                  fullWidth
                                  variant="outlined"
                                  size="small"
                                >
                                  <MenuItem value="g">g</MenuItem>
                                  <MenuItem value="kg">kg</MenuItem>
                                  <MenuItem value="ml">ml</MenuItem>
                                  <MenuItem value="l">l</MenuItem>
                                  <MenuItem value="tsp">tsp</MenuItem>
                                  <MenuItem value="tbsp">tbsp</MenuItem>
                                  <MenuItem value="cup">cup</MenuItem>
                                  <MenuItem value="piece">piece</MenuItem>
                                </TextField>
                              </Grid>
                              <Grid item xs={12}>
                                <TextField
                                  label="Possible Substitutes"
                                  value={ingredient.substitutes}
                                  onChange={(e) => handleIngredientChange(index, 'substitutes', e.target.value)}
                                  fullWidth
                                  variant="outlined"
                                  size="small"
                                  placeholder="e.g., Use honey instead of sugar"
                                />
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
                
                {/* Instructions Section */}
                <Grid item xs={12}>
                  <Card elevation={1} sx={{ mb: 4, borderRadius: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                          <FormatListNumbered sx={{ mr: 1, color: theme.palette.primary.main }} />
                          Instructions
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={addInstruction}
                          size="small"
                          sx={{ borderRadius: 28 }}
                        >
                          Add Step
                        </Button>
                      </Box>
                      
                      {recipeData.instructions.map((instruction, index) => (
                        <Box 
                          key={index} 
                          sx={{ 
                            display: 'flex', 
                            mb: 2,
                            p: 2,
                            borderRadius: 2,
                            bgcolor: 'background.paper',
                            border: `1px solid ${theme.palette.divider}`,
                            '&:hover': {
                              borderColor: theme.palette.primary.light,
                              boxShadow: 1
                            }
                          }}
                        >
                          <Box 
                            sx={{ 
                              bgcolor: theme.palette.primary.main, 
                              color: 'white', 
                              borderRadius: '50%', 
                              width: 36, 
                              height: 36, 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              mr: 2,
                              flexShrink: 0
                            }}
                          >
                            {index + 1}
                          </Box>
                          <TextField
                            label={`Step ${index + 1}`}
                            value={instruction}
                            onChange={(e) => handleInstructionChange(index, e.target.value)}
                            required
                            fullWidth
                            multiline
                            rows={2}
                            variant="outlined"
                            size="small"
                          />
                          <IconButton
                            onClick={() => removeInstruction(index)}
                            disabled={recipeData.instructions.length === 1}
                            sx={{ 
                              ml: 1,
                              color: theme.palette.error.main,
                              bgcolor: 'rgba(255, 0, 0, 0.08)',
                              height: 36,
                              width: 36,
                              '&:hover': {
                                bgcolor: 'rgba(255, 0, 0, 0.15)',
                              }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/recipes/${id}`)}
                  sx={{ mr: 2, borderRadius: 28 }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<Save />}
                  disabled={loading}
                  sx={{ borderRadius: 28, px: 3 }}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </form>
          )}
          
          {isMobile && activeStep === steps.length && (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <CheckCircle sx={{ color: theme.palette.success.main, fontSize: 60, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Your changes are ready to be saved!
              </Typography>
              <Button 
                variant="contained" 
                onClick={handleSubmit} 
                sx={{ mt: 2, borderRadius: 28 }}
                startIcon={<Save />}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Recipe'}
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
  
  // Function to return content for each step in the stepper
  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <Box>
            <TextField
              label="Recipe Title"
              name="title"
              value={recipeData.title}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              sx={{ mb: 3 }}
            />
            
            <TextField
              label="Description"
              name="description"
              value={recipeData.description}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
              variant="outlined"
              sx={{ mb: 3 }}
            />
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <AccessTime sx={{ mr: 1, color: theme.palette.text.secondary }} />
              <TextField
                label="Cooking Time (minutes)"
                name="cookingTime"
                type="number"
                value={recipeData.cookingTime}
                onChange={handleChange}
                required
                fullWidth
                InputProps={{ inputProps: { min: 1 } }}
                variant="outlined"
              />
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Image sx={{ mr: 1, color: theme.palette.text.secondary }} />
              <TextField
                label="Recipe Image URL"
                name="imageUrl"
                value={recipeData.imageUrl}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Box>
            
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Dietary Restrictions (Tap to select)
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {dietaryOptions.map((diet) => (
                <Chip
                  key={diet}
                  label={diet}
                  onClick={() => handleDietaryChange(diet)}
                  color={recipeData.dietaryRestrictions?.includes(diet) ? "primary" : "default"}
                  variant={recipeData.dietaryRestrictions?.includes(diet) ? "filled" : "outlined"}
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1">Ingredients List</Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addIngredient}
                size="small"
                sx={{ borderRadius: 28 }}
              >
                Add
              </Button>
            </Box>
            
            {recipeData.ingredients.map((ingredient, index) => (
              <Card 
                key={index} 
                variant="outlined" 
                sx={{ 
                  mb: 2, 
                  borderRadius: 2,
                  borderColor: theme.palette.divider
                }}
              >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" fontWeight="medium">
                      Ingredient #{index + 1}
                    </Typography>
                    <IconButton 
                      onClick={() => removeIngredient(index)}
                      disabled={recipeData.ingredients.length === 1}
                      size="small"
                      color="error"
                      sx={{ p: 0.5 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  
                  <TextField
                    label="Name"
                    value={ingredient.name}
                    onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                    required
                    fullWidth
                    variant="outlined"
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  
                  <Grid container spacing={1} sx={{ mb: 1 }}>
                    <Grid item xs={7}>
                      <TextField
                        label="Amount"
                        type="number"
                        value={ingredient.amount}
                        onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                        required
                        fullWidth
                        variant="outlined"
                        size="small"
                        InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        select
                        label="Unit"
                        value={ingredient.unit}
                        onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                        fullWidth
                        variant="outlined"
                        size="small"
                      >
                        <MenuItem value="g">g</MenuItem>
                        <MenuItem value="kg">kg</MenuItem>
                        <MenuItem value="ml">ml</MenuItem>
                        <MenuItem value="l">l</MenuItem>
                        <MenuItem value="tsp">tsp</MenuItem>
                        <MenuItem value="tbsp">tbsp</MenuItem>
                        <MenuItem value="cup">cup</MenuItem>
                        <MenuItem value="piece">piece</MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>
                  
                  <TextField
                    label="Substitutes"
                    value={ingredient.substitutes}
                    onChange={(e) => handleIngredientChange(index, 'substitutes', e.target.value)}
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="e.g., Use honey instead of sugar"
                  />
                </CardContent>
              </Card>
            ))}
          </Box>
        );
      case 2:
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1">Step-by-Step Instructions</Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addInstruction}
                size="small"
                sx={{ borderRadius: 28 }}
              >
                Add Step
              </Button>
            </Box>
            
            {recipeData.instructions.map((instruction, index) => (
              <Box 
                key={index} 
                sx={{ 
                  display: 'flex', 
                  mb: 2,
                  p: 1,
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  border: `1px solid ${theme.palette.divider}`
                }}
              >
                <Box 
                  sx={{ 
                    bgcolor: theme.palette.primary.main, 
                    color: 'white', 
                    borderRadius: '50%', 
                    width: 28, 
                    height: 28, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    mr: 1,
                    flexShrink: 0,
                    fontSize: '0.875rem'
                  }}
                >
                  {index + 1}
                </Box>
                <TextField
                  value={instruction}
                  onChange={(e) => handleInstructionChange(index, e.target.value)}
                  required
                  fullWidth
                  multiline
                  rows={2}
                  variant="outlined"
                  size="small"
                  placeholder={`Describe step ${index + 1}...`}
                />
                <IconButton
                  onClick={() => removeInstruction(index)}
                  disabled={recipeData.instructions.length === 1}
                  sx={{ 
                    ml: 0.5,
                    color: theme.palette.error.main,
                    height: 28,
                    width: 28,
                    p: 0.5
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        );
      default:
        return "Unknown step";
    }
  }
};

export default EditRecipe;