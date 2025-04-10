import React, { useState } from 'react';
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
  Divider,
  useTheme,
  alpha,
  useMediaQuery
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
  const isFavorite = favorites?.includes(recipe?.id);
  const [imageError, setImageError] = useState(false);
  
  // Media queries for specific viewport sizes
  const isXs = useMediaQuery('(max-width:374px)');
  const isSm = useMediaQuery('(min-width:375px) and (max-width:424px)');
  const isMobile = useMediaQuery('(min-width:425px) and (max-width:767px)');
  const isMd = useMediaQuery('(min-width:768px) and (max-width:1023px)');
  const isLg = useMediaQuery('(min-width:1024px) and (max-width:1439px)');
  const isXl = useMediaQuery('(min-width:1440px)');
  
  // Calculate card width based on viewport
  const getCardWidth = () => {
    if (isXl) return '360px'; // Large desktop
    if (isLg) return '300px'; // Small desktop/laptop
    if (isMd) return '330px'; // Tablet
    if (isMobile) return '380px'; // Mobile
    if (isSm) return '330px'; // Small mobile
    if (isXs) return '100%'; // Very small mobile
    return '100%'; // Default fallback
  };
  
  // Calculate card height based on viewport
  const getCardHeight = () => {
    if (isXl || isLg) return '380px'; // Desktop sizes
    if (isMd) return '360px'; // Tablet
    return '340px'; // Mobile sizes
  };

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
        width: getCardWidth(),
        height: getCardHeight(),
        maxWidth: '100%', // Ensure card doesn't overflow container
        borderRadius: 2,
        transition: 'all 0.3s ease-in-out',
        ':hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8]
        },
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        mx: 'auto' // Center the card in its container
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
          zIndex: 10,
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
            zIndex: 10,
            backgroundColor: alpha(theme.palette.background.paper, 0.85),
            fontWeight: 500,
            fontSize: { 
              xs: '0.65rem', 
              sm: '0.65rem', 
              md: '0.7rem',
              lg: '0.7rem' 
            },
            backdropFilter: 'blur(4px)'
          }}
        />
      )}

      {/* Image container with aspect ratio */}
      <Box 
        sx={{ 
          position: 'relative',
          width: '100%',
          paddingTop: '56.25%', // 16:9 aspect ratio
          overflow: 'hidden'
        }}
      >
        <CardMedia
          component="img"
          image={
            imageError 
              ? 'https://placehold.co/320x160/f0f0f0/cccccc?text=Recipe+Image'
              : recipe.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=320&h=160&fit=crop'
          }
          alt={recipe.title}
          onError={() => setImageError(true)}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            transition: 'transform 0.4s ease',
            '&:hover': {
              transform: 'scale(1.08)'
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
            backdropFilter: 'blur(4px)',
            zIndex: 5
          }}
        >
          <AccessTime fontSize="small" sx={{ 
            mr: 0.5, 
            fontSize: { 
              xs: '0.75rem', 
              sm: '0.8rem', 
              md: '0.875rem',
              lg: '1rem' 
            } 
          }} />
          <Typography variant="caption" fontWeight="medium">
            {recipe.cookingTime} mins
          </Typography>
        </Box>
        
        {/* Optional: Dark gradient overlay for better text visibility */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '30%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 100%)',
            zIndex: 1
          }}
        />
      </Box>

      {/* Content area with flexible height */}
      <CardActionArea 
        component={RouterLink} 
        to={`/recipes/${recipe.id}`}
        sx={{ 
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <CardContent sx={{ 
          p: { xs: 1.5, sm: 1.5, md: 2 }, 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column' 
        }}>
          {/* Title */}
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 600, 
              mb: 1, 
              lineHeight: 1.3,
              fontSize: { 
                xs: '0.95rem', 
                sm: '0.95rem', 
                md: '1.1rem',
                lg: '1.25rem' 
              },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: { xs: 38, sm: 38, md: 42, lg: 46 }
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
          
          {/* Description - responsive line clamp */}
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{
              mb: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: { xs: 2, sm: 2, md: 2, lg: 3 },
              WebkitBoxOrient: 'vertical',
              fontSize: { 
                xs: '0.75rem', 
                sm: '0.75rem', 
                md: '0.8rem',
                lg: '0.875rem' 
              },
              minHeight: { xs: 32, sm: 32, md: 36, lg: 38 }
            }}
          >
            {recipe.description}
          </Typography>
          
          {/* Difficulty & Calories row */}
          <Stack 
            direction="row" 
            spacing={{ xs: 1, sm: 1, md: 1.5, lg: 2 }} 
            justifyContent="flex-start" 
            sx={{ mb: 1.5 }}
          >
            {recipe.difficulty && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box 
                  sx={{ 
                    width: { xs: 8, sm: 8, md: 9, lg: 10 }, 
                    height: { xs: 8, sm: 8, md: 9, lg: 10 }, 
                    borderRadius: '50%',
                    backgroundColor: getDifficultyColor(recipe.difficulty),
                    mr: 1
                  }} 
                />
                <Typography 
                  variant="caption" 
                  fontWeight="medium" 
                  fontSize={{ 
                    xs: '0.65rem', 
                    sm: '0.65rem', 
                    md: '0.7rem',
                    lg: '0.75rem' 
                  }}
                >
                  {recipe.difficulty}
                </Typography>
              </Box>
            )}
            
            {recipe.calories && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocalFireDepartment 
                  fontSize="small" 
                  sx={{ 
                    fontSize: { 
                      xs: '0.75rem', 
                      sm: '0.75rem', 
                      md: '0.8rem',
                      lg: '0.875rem' 
                    }, 
                    mr: 0.5, 
                    color: 'text.secondary' 
                  }} 
                />
                <Typography 
                  variant="caption" 
                  fontWeight="medium" 
                  fontSize={{ 
                    xs: '0.65rem', 
                    sm: '0.65rem', 
                    md: '0.7rem',
                    lg: '0.75rem' 
                  }}
                >
                  {recipe.calories} cal
                </Typography>
              </Box>
            )}
          </Stack>
          
          {/* Chef/Author info */}
          {recipe.author && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
              <Avatar 
                src={recipe.author.avatar} 
                alt={recipe.author.name}
                sx={{ 
                  width: { xs: 20, sm: 20, md: 22, lg: 24 }, 
                  height: { xs: 20, sm: 20, md: 22, lg: 24 }, 
                  mr: 1 
                }}
              />
              <Typography 
                variant="caption" 
                color="text.secondary" 
                fontSize={{ 
                  xs: '0.65rem', 
                  sm: '0.65rem', 
                  md: '0.7rem',
                  lg: '0.75rem' 
                }}
              >
                by <Box component="span" sx={{ fontWeight: 'medium' }}>{recipe.author.name}</Box>
              </Typography>
            </Box>
          )}
        </CardContent>
      </CardActionArea>
      
      {/* Bottom section for dietary tags with flexible height */}
      <Box sx={{ mt: 'auto' }}>
        {recipe.dietaryRestrictions?.length > 0 && (
          <>
            <Divider />
            <CardActions sx={{ 
              p: { xs: 1, sm: 1, md: 1.25, lg: 1.5 }, 
              pt: 1, 
              display: 'flex', 
              overflow: 'hidden', 
              height: { xs: 40, sm: 42, md: 46, lg: 49 }
            }}>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'nowrap', overflow: 'hidden' }}>
                {recipe.dietaryRestrictions?.slice(0, 2).map((diet) => (
                  <Tooltip key={diet} title={diet}>
                    <Chip 
                      label={diet} 
                      size="small" 
                      variant="outlined"
                      sx={{ 
                        height: { xs: 20, sm: 20, md: 22, lg: 24 }, 
                        fontSize: { 
                          xs: '0.65rem', 
                          sm: '0.65rem', 
                          md: '0.675rem',
                          lg: '0.7rem' 
                        },
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
                        height: { xs: 20, sm: 20, md: 22, lg: 24 }, 
                        fontSize: { 
                          xs: '0.65rem', 
                          sm: '0.65rem', 
                          md: '0.675rem',
                          lg: '0.7rem' 
                        },
                        fontWeight: 500
                      }}
                    />
                  </Tooltip>
                )}
              </Box>
            </CardActions>
          </>
        )}
      </Box>
    </Card>
  );
};

// Loading state card with responsive dimensions
const LoadingCard = () => {
  const theme = useTheme();
  const isXs = useMediaQuery('(max-width:374px)');
  const isSm = useMediaQuery('(min-width:375px) and (max-width:424px)');
  const isMobile = useMediaQuery('(min-width:425px) and (max-width:767px)');
  const isMd = useMediaQuery('(min-width:768px) and (max-width:1023px)');
  const isLg = useMediaQuery('(min-width:1024px) and (max-width:1439px)');
  const isXl = useMediaQuery('(min-width:1440px)');
  
  // Calculate loading card width based on viewport
  const getCardWidth = () => {
    if (isXl) return '360px'; // Large desktop
    if (isLg) return '300px'; // Small desktop/laptop
    if (isMd) return '330px'; // Tablet
    if (isMobile) return '380px'; // Mobile
    if (isSm) return '330px'; // Small mobile
    if (isXs) return '100%'; // Very small mobile
    return '100%';
  };
  
  // Calculate loading card height based on viewport
  const getCardHeight = () => {
    if (isXl || isLg) return '380px'; // Desktop sizes
    if (isMd) return '360px'; // Tablet
    return '340px'; // Mobile sizes
  };
  
  return (
    <Card
      elevation={1}
      sx={{ 
        width: getCardWidth(),
        height: getCardHeight(),
        maxWidth: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.background.paper,
        mx: 'auto' // Center the card
      }}
    >
      <Box sx={{ position: 'relative', paddingTop: '56.25%', width: '100%' }}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: theme.palette.action.hover
          }}
        />
      </Box>
      
      <Box sx={{ 
        p: { xs: 1.5, sm: 1.5, md: 2 }, 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        <Box sx={{ 
          height: { xs: 20, sm: 20, md: 22, lg: 24 }, 
          width: '80%', 
          bgcolor: theme.palette.action.hover, 
          mb: 2, 
          borderRadius: 0.5 
        }} />
        <Box sx={{ 
          height: { xs: 16, sm: 16, md: 18, lg: 20 }, 
          width: '60%', 
          bgcolor: theme.palette.action.hover, 
          mb: 2, 
          borderRadius: 0.5 
        }} />
        <Box sx={{ 
          height: { xs: 14, sm: 14, md: 15, lg: 16 }, 
          width: '90%', 
          bgcolor: theme.palette.action.hover, 
          mb: 1, 
          borderRadius: 0.5 
        }} />
        <Box sx={{ 
          height: { xs: 14, sm: 14, md: 15, lg: 16 }, 
          width: '70%', 
          bgcolor: theme.palette.action.hover, 
          mb: 2, 
          borderRadius: 0.5 
        }} />
        
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Box sx={{ 
            height: { xs: 20, sm: 20, md: 22, lg: 24 }, 
            width: 60, 
            bgcolor: theme.palette.action.hover, 
            borderRadius: 1 
          }} />
          <Box sx={{ 
            height: { xs: 20, sm: 20, md: 22, lg: 24 }, 
            width: 60, 
            bgcolor: theme.palette.action.hover, 
            borderRadius: 1 
          }} />
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
          <Box sx={{ 
            height: { xs: 20, sm: 20, md: 22, lg: 24 }, 
            width: { xs: 20, sm: 20, md: 22, lg: 24 }, 
            bgcolor: theme.palette.action.hover, 
            borderRadius: '50%' 
          }} />
          <Box sx={{ 
            height: { xs: 14, sm: 14, md: 15, lg: 16 }, 
            width: 100, 
            bgcolor: theme.palette.action.hover, 
            ml: 1, 
            borderRadius: 0.5 
          }} />
        </Box>
      </Box>
      
      <Box sx={{ 
        p: { xs: 1, sm: 1, md: 1.25, lg: 1.5 }, 
        height: { xs: 40, sm: 42, md: 46, lg: 49 }, 
        mt: 'auto', 
        borderTop: `1px solid ${theme.palette.divider}` 
      }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Box sx={{ 
            height: { xs: 20, sm: 20, md: 22, lg: 24 }, 
            width: 60, 
            bgcolor: theme.palette.action.hover, 
            borderRadius: 12 
          }} />
          <Box sx={{ 
            height: { xs: 20, sm: 20, md: 22, lg: 24 }, 
            width: 60, 
            bgcolor: theme.palette.action.hover, 
            borderRadius: 12 
          }} />
        </Box>
      </Box>
    </Card>
  );
};

export default RecipeCard;