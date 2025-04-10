import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  CardContent,
  Chip,
  useTheme,
  useMediaQuery,
  InputAdornment,
  Tooltip,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Close as DeleteIcon,
  ArrowBack,
  Timer,
  Image,
  Restaurant,
  MenuBook,
  Info,
  Delete,
  HelpOutline,
  Check
} from '@mui/icons-material';
import { createRecipe } from '../store/recipeSlice';

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

const CreateRecipe = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.recipes);

  const [activeStep, setActiveStep] = useState(0);
  const [recipeData, setRecipeData] = useState({
    title: '',
    description: '',
    cookingTime: 30,
    rating: 0,
    imageUrl: '',
    ingredients: [{ ...initialIngredient }],
    instructions: [''],
    dietaryRestrictions: []
  });

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

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Add user ID to recipe data
    const completeRecipeData = {
      ...recipeData,
      userId: user.id,
      createdAt: new Date().toISOString()
    };
    
    dispatch(createRecipe(completeRecipeData)).then(() => {
      navigate('/');
    });
  };

  // Check if form has required fields for current step
  const isStepComplete = (step) => {
    switch (step) {
      case 0:
        return recipeData.title.trim() !== '';
      case 1:
        return recipeData.ingredients.every(ing => ing.name.trim() !== '' && ing.amount !== '');
      case 2:
        return recipeData.instructions.every(inst => inst.trim() !== '');
      default:
        return true;
    }
  };

  const steps = [
    {
      label: 'Basic Recipe Information',
      icon: <Restaurant />,
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Alert severity="info" sx={{ mb: 2 }}>
              Start by providing the basic details of your recipe.
            </Alert>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Recipe Title"
              name="title"
              value={recipeData.title}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              placeholder="e.g., Homemade Chocolate Chip Cookies"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Restaurant color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              value={recipeData.description}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
              variant="outlined"
              placeholder="Describe your recipe in a few sentences..."
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Cooking Time"
              name="cookingTime"
              type="number"
              value={recipeData.cookingTime}
              onChange={handleChange}
              required
              fullWidth
              InputProps={{ 
                inputProps: { min: 1 },
                startAdornment: (
                  <InputAdornment position="start">
                    <Timer color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">minutes</InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Recipe Image URL"
              name="imageUrl"
              value={recipeData.imageUrl}
              onChange={handleChange}
              fullWidth
              placeholder="https://example.com/image.jpg"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Image color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              Dietary Restrictions
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {dietaryOptions.map((diet) => (
                <Chip
                  key={diet}
                  label={diet}
                  onClick={() => handleDietaryChange(diet)}
                  color={recipeData.dietaryRestrictions.includes(diet) ? "primary" : "default"}
                  variant={recipeData.dietaryRestrictions.includes(diet) ? "filled" : "outlined"}
                  sx={{ mb: 1 }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      )
    },
    {
      label: 'Ingredients',
      icon: <Restaurant />,
      content: (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              Recipe Ingredients
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={addIngredient}
              size="small"
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
                position: 'relative',
                borderColor: ingredient.name ? theme.palette.grey[300] : theme.palette.primary.light,
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  boxShadow: theme.shadows[2]
                }
              }}
            >
              <CardContent sx={{ pb: '16px !important' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight={500}>
                    Ingredient #{index + 1}
                  </Typography>
                  <IconButton 
                    onClick={() => removeIngredient(index)}
                    disabled={recipeData.ingredients.length === 1}
                    size="small"
                    color="error"
                    sx={{ 
                      bgcolor: recipeData.ingredients.length > 1 ? 'error.50' : 'transparent',
                      '&:hover': { bgcolor: recipeData.ingredients.length > 1 ? 'error.100' : 'transparent' }
                    }}
                  >
                    <Delete fontSize="small" />
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
                      placeholder="e.g., All-purpose flour"
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
                      size="small"
                      placeholder="e.g., Use honey instead of sugar"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Tooltip title="Suggest alternatives for people with dietary restrictions or preferences">
                              <HelpOutline fontSize="small" color="action" />
                            </Tooltip>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
          
          {recipeData.ingredients.length < 2 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Add all the ingredients needed for your recipe. Be precise with measurements.
            </Alert>
          )}
        </Box>
      )
    },
    {
      label: 'Instructions',
      icon: <MenuBook />,
      content: (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              Cooking Steps
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={addInstruction}
              size="small"
            >
              Add Step
            </Button>
          </Box>
          
          {recipeData.instructions.map((instruction, index) => (
            <Card 
              key={index} 
              variant="outlined" 
              sx={{ 
                mb: 2,
                position: 'relative',
                borderColor: instruction ? theme.palette.grey[300] : theme.palette.primary.light,
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  boxShadow: theme.shadows[2]
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
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
                      flexShrink: 0,
                      fontSize: '1rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {index + 1}
                  </Box>
                  <TextField
                    label={`Step ${index + 1} instructions`}
                    value={instruction}
                    onChange={(e) => handleInstructionChange(index, e.target.value)}
                    required
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Describe this cooking step in detail..."
                  />
                  <IconButton
                    onClick={() => removeInstruction(index)}
                    disabled={recipeData.instructions.length === 1}
                    color="error"
                    sx={{ 
                      ml: 1,
                      bgcolor: recipeData.instructions.length > 1 ? 'error.50' : 'transparent',
                      '&:hover': { bgcolor: recipeData.instructions.length > 1 ? 'error.100' : 'transparent' }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
          
          {recipeData.instructions.length < 2 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Break down your recipe into clear, step-by-step instructions for others to follow.
            </Alert>
          )}
        </Box>
      )
    },
    {
      label: 'Review & Publish',
      icon: <Check />,
      content: (
        <Box>
          <Alert severity="success" sx={{ mb: 3 }}>
            Great job! Review your recipe details before publishing.
          </Alert>
          
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom color="primary">
                {recipeData.title || 'Recipe Title'}
              </Typography>
              
              <Typography variant="body1" paragraph>
                {recipeData.description || 'No description provided.'}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<Timer />} 
                  label={`${recipeData.cookingTime} minutes`} 
                  variant="outlined" 
                />
                
                {recipeData.dietaryRestrictions.map(diet => (
                  <Chip key={diet} label={diet} color="primary" size="small" />
                ))}
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Ingredients
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                {recipeData.ingredients.map((ing, idx) => (
                  <Box component="li" key={idx} sx={{ mb: 1 }}>
                    <Typography>
                      {ing.name ? `${ing.name} (${ing.amount} ${ing.unit})` : 'Unnamed ingredient'}
                      {ing.substitutes && (
                        <Typography 
                          component="span" 
                          color="text.secondary" 
                          variant="body2"
                          sx={{ display: 'block', ml: 2 }}
                        >
                          Alternative: {ing.substitutes}
                        </Typography>
                      )}
                    </Typography>
                  </Box>
                ))}
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Instructions
              </Typography>
              <Box component="ol" sx={{ pl: 2 }}>
                {recipeData.instructions.map((inst, idx) => (
                  <Box component="li" key={idx} sx={{ mb: 1 }}>
                    <Typography>
                      {inst || 'Empty step'}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
      )
    }
  ];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/recipes')} sx={{ mr: 1 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" component="h1" fontWeight={500}>
          Create New Recipe
        </Typography>
      </Box>
      
      <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: '8px' }} elevation={2}>
        <Box sx={{ width: '100%' }}>
          {!isMobile ? (
            // Horizontal stepper for larger screens
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
              {steps.map((step, index) => (
                <Step key={index} completed={isStepComplete(index)}>
                  <StepLabel 
                    StepIconProps={{ 
                      icon: step.icon 
                    }}
                  >
                    {step.label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          ) : (
            // Vertical stepper for mobile
            <Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 2 }}>
              {steps.map((step, index) => (
                <Step key={index} completed={isStepComplete(index)}>
                  <StepLabel>{step.label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          )}
          
          <form onSubmit={activeStep === steps.length - 1 ? handleSubmit : undefined}>
            <Box sx={{ mt: 2 }}>
              {steps[activeStep].content}
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
              >
                Back
              </Button>
              <Box>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/recipes')}
                  sx={{ mr: 1 }}
                >
                  Cancel
                </Button>
                
                {activeStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                  >
                    {loading ? 'Publishing...' : 'Publish Recipe'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={!isStepComplete(activeStep)}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </form>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateRecipe;