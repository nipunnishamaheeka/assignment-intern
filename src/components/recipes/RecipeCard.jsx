import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  IconButton,
  Box,
  Rating,
  Stack,
  Avatar,
  Tooltip,
  Skeleton,
  alpha,
  Divider,
  Paper,
  useTheme
} from '@mui/material';
import { 
  Favorite, 
  FavoriteBorderOutlined, 
  AccessTime, 
  LocalDining, 
  BookmarkBorder,
  Restaurant,
  LocalFireDepartment
} from '@mui/icons-material';
import { toggleFavorite } from '../../store/favoriteSlice';

const RecipeCard = ({ recipe, loading = false }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { favorites } = useSelector((state) => state.favorites);
  const isFavorite = favorites.includes(recipe?.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavorite(recipe.id));
  };

  // Define difficulty color
  const getDifficultyColor = (level) => {
    switch(level?.toLowerCase()) {
      case 'easy': return theme.palette.success.main;
      case 'medium': return theme.palette.warning.main;
      case 'hard': return theme.palette.error.main;
      default: return theme.palette.info.main;
    }
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    switch(category?.toLowerCase()) {
      case 'dessert': return <LocalDining fontSize="small" />;
      case 'main': return <Restaurant fontSize="small" />;
      case 'appetizer': return <LocalFireDepartment fontSize="small" />;
      default: return <BookmarkBorder fontSize="small" />;
    }
  };

  if (loading) {
    return <LoadingCard />;
  }

  return (
    <Card 
      elevation={1}
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        borderRadius: 2,
        transition: 'all 0.3s ease-in-out',
        ':hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8]
        },
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
        position: 'relative'
      }}
    >
      {/* Favorite button - positioned absolutely over the image */}
      <IconButton 
        size="small" 
        onClick={handleFavoriteClick}
        sx={{ 
          position: 'absolute', 
          top: 8, 
          right: 8, 
          backgroundColor: alpha(theme.palette.background.paper, 0.7),
          ':hover': {
            backgroundColor: alpha(theme.palette.background.paper, 0.9),
          },
          zIndex: 2,
          boxShadow: theme.shadows[2]
        }}
        color={isFavorite ? "error" : "default"}
      >
        {isFavorite ? (
          <Favorite fontSize="small" />
        ) : (
          <FavoriteBorderOutlined fontSize="small" />
        )}
      </IconButton>
      
      {/* Category badge - positioned absolutely on top left */}
      {recipe.category && (
        <Chip
          size="small"
          icon={getCategoryIcon(recipe.category)}
          label={recipe.category}
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 2,
            backgroundColor: alpha(theme.palette.background.paper, 0.85),
            fontWeight: 500,
            fontSize: '0.7rem',
            backdropFilter: 'blur(4px)'
          }}
        />
      )}

      <CardActionArea 
        component={RouterLink} 
        to={`/recipes/${recipe.id}`}
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'stretch', 
          flexGrow: 1,
          height: '100%'
        }}
      >
        {/* Image section with gradient overlay */}
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="180"
            image={recipe.imageUrl || 'https://source.unsplash.com/random/300x200/?food'}
            alt={recipe.title}
            sx={{
              height: 180,
              objectFit: 'cover',
              transition: 'transform 0.5s ease-in-out',
              ':hover': {
                transform: 'scale(1.05)'
              }
            }}
          />
          
          {/* Cooking time badge */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: alpha(theme.palette.background.paper, 0.85),
              borderRadius: 1,
              px: 1,
              py: 0.5,
              backdropFilter: 'blur(4px)'
            }}
          >
            <AccessTime fontSize="small" sx={{ mr: 0.5, fontSize: '1rem' }} />
            <Typography variant="caption" fontWeight="medium">
              {recipe.cookingTime} mins
            </Typography>
          </Box>
        </Box>

        <CardContent sx={{ flexGrow: 1, pt: 2, pb: 1.5 }}>
          {/* Title */}
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 600, 
              mb: 1, 
              lineHeight: 1.3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: 48
            }}
          >
            {recipe.title}
          </Typography>
          
          {/* Rating section */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <Rating 
              value={recipe.rating} 
              readOnly 
              size="small" 
              precision={0.5} 
            />
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ ml: 1, fontWeight: 500 }}
            >
              {recipe.rating}
            </Typography>
            {recipe.reviewCount && (
              <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                ({recipe.reviewCount})
              </Typography>
            )}
          </Box>
          
          {/* Description */}
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{
              mb: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: 40
            }}
          >
            {recipe.description}
          </Typography>
          
          {/* Difficulty & Calories row */}
          <Stack 
            direction="row" 
            spacing={2} 
            justifyContent="flex-start" 
            sx={{ mb: 1.5 }}
          >
            {recipe.difficulty && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box 
                  sx={{ 
                    width: 10, 
                    height: 10, 
                    borderRadius: '50%',
                    backgroundColor: getDifficultyColor(recipe.difficulty),
                    mr: 1
                  }} 
                />
                <Typography variant="caption" fontWeight="medium">
                  {recipe.difficulty}
                </Typography>
              </Box>
            )}
            
            {recipe.calories && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocalFireDepartment 
                  fontSize="small" 
                  sx={{ fontSize: '0.875rem', mr: 0.5, color: 'text.secondary' }} 
                />
                <Typography variant="caption" fontWeight="medium">
                  {recipe.calories} cal
                </Typography>
              </Box>
            )}
          </Stack>
          
          {/* Chef/Author info */}
          {recipe.author && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto', pt: 1 }}>
              <Avatar 
                src={recipe.author.avatar} 
                alt={recipe.author.name}
                sx={{ width: 24, height: 24, mr: 1 }}
              />
              <Typography variant="caption" color="text.secondary">
                by <Box component="span" sx={{ fontWeight: 'medium' }}>{recipe.author.name}</Box>
              </Typography>
            </Box>
          )}
        </CardContent>
      </CardActionArea>
      
      {/* Bottom section for dietary tags */}
      {recipe.dietaryRestrictions?.length > 0 && (
        <>
          <Divider />
          <CardActions sx={{ p: 1.5, pt: 1, display: 'flex', overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'nowrap', overflow: 'hidden' }}>
              {recipe.dietaryRestrictions?.slice(0, 2).map((diet) => (
                <Tooltip key={diet} title={diet}>
                  <Chip 
                    label={diet} 
                    size="small" 
                    variant="outlined"
                    sx={{ 
                      height: 24, 
                      fontSize: '0.7rem',
                      fontWeight: 500,
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      borderColor: alpha(theme.palette.primary.main, 0.2)
                    }}
                  />
                </Tooltip>
              ))}
              {recipe.dietaryRestrictions?.length > 2 && (
                <Tooltip 
                  title={recipe.dietaryRestrictions.slice(2).join(', ')}
                  placement="top"
                >
                  <Chip 
                    label={`+${recipe.dietaryRestrictions.length - 2}`} 
                    size="small"
                    sx={{ 
                      height: 24, 
                      fontSize: '0.7rem',
                      fontWeight: 500
                    }}
                  />
                </Tooltip>
              )}
            </Box>
          </CardActions>
        </>
      )}
    </Card>
  );
};

// Loading state card
const LoadingCard = () => {
  return (
    <Paper
      elevation={1}
      sx={{ 
        height: '100%', 
        borderRadius: 2,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Skeleton variant="rectangular" height={180} animation="wave" />
      <Box sx={{ p: 2 }}>
        <Skeleton variant="text" height={32} width="80%" animation="wave" />
        <Box sx={{ display: 'flex', alignItems: 'center', my: 1.5 }}>
          <Skeleton variant="text" height={24} width={120} animation="wave" />
        </Box>
        <Skeleton variant="text" height={20} animation="wave" />
        <Skeleton variant="text" height={20} width="90%" animation="wave" />
        
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Skeleton variant="rectangular" height={24} width={60} animation="wave" sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" height={24} width={60} animation="wave" sx={{ borderRadius: 1 }} />
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <Skeleton variant="circular" height={24} width={24} animation="wave" />
          <Skeleton variant="text" height={20} width={100} animation="wave" sx={{ ml: 1 }} />
        </Box>
      </Box>
      <Box sx={{ p: 1.5, mt: 'auto' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Skeleton variant="rectangular" height={24} width={60} animation="wave" sx={{ borderRadius: 12 }} />
          <Skeleton variant="rectangular" height={24} width={60} animation="wave" sx={{ borderRadius: 12 }} />
        </Box>
      </Box>
    </Paper>
  );
};

export default RecipeCard;