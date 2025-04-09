import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Avatar,
  Button,
  Grid,
  Tab,
  Tabs,
  Divider,
  TextField,
  CircularProgress,
  Alert,
  Box,
  Card,
  CardContent,
  Snackbar,
  IconButton,
  useTheme,
  useMediaQuery,
  Chip
} from '@mui/material';
import {
  Edit,
  Save,
  Restaurant,
  PhotoCamera,
  Favorite,
  LocalDining,
  Close,
  Add
} from '@mui/icons-material';
import RecipeCard from '../components/recipes/RecipeCard';
import { fetchUserRecipes } from '../store/recipeSlice';
import { updateUserProfile } from '../store/authSlice';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const Profile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const { userRecipes, loading: recipesLoading } = useSelector((state) => state.recipes);
  
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    avatarUrl: ''
  });
  const [notification, setNotification] = useState({ 
    show: false, 
    type: 'success', 
    message: '' 
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setProfileData({
      name: user.name || '',
      email: user.email || '',
      bio: user.bio || '',
      avatarUrl: user.avatarUrl || ''
    });

    dispatch(fetchUserRecipes(user.id));
  }, [user, dispatch, navigate]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    
    dispatch(updateUserProfile({ 
      id: user.id, 
      ...profileData 
    })).then((result) => {
      if (!result.error) {
        setIsEditing(false);
        setNotification({
          show: true,
          type: 'success',
          message: 'Profile updated successfully!'
        });
        
        // Hide notification after 3 seconds
        setTimeout(() => {
          setNotification({ ...notification, show: false });
        }, 3000);
      } else {
        setNotification({
          show: true,
          type: 'error',
          message: 'Failed to update profile'
        });
      }
    });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, show: false });
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Snackbar
        open={notification.show}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          severity={notification.type} 
          onClose={handleCloseNotification}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
      
      <Card elevation={2} sx={{ mb: 4, overflow: 'visible' }}>
        <form onSubmit={handleProfileSubmit}>
          <Box sx={{ 
            position: 'relative', 
            height: '160px', 
            bgcolor: theme.palette.primary.main,
            backgroundImage: 'linear-gradient(to right, #4568dc, #b06ab3)',
            borderRadius: '4px 4px 0 0'
          }}>
            <Box 
              sx={{ 
                position: 'absolute', 
                bottom: '-50px', 
                left: isMobile ? '50%' : '32px', 
                transform: isMobile ? 'translateX(-50%)' : 'none' 
              }}
            >
              <Avatar
                src={profileData.avatarUrl}
                alt={profileData.name}
                sx={{ 
                  width: 100, 
                  height: 100, 
                  border: '4px solid white',
                  boxShadow: theme.shadows[3]
                }}
              />
              {isEditing && (
                <IconButton 
                  color="primary" 
                  aria-label="upload picture"
                  sx={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    right: 0, 
                    bgcolor: 'white',
                    '&:hover': { bgcolor: theme.palette.grey[200] }
                  }}
                >
                  <PhotoCamera />
                </IconButton>
              )}
            </Box>
          </Box>
          
          <CardContent sx={{ pt: isMobile ? 7 : 2, pb: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={7} sx={{ pt: !isMobile ? 7 : 0 }}>
                {isEditing ? (
                  <>
                    <TextField
                      name="name"
                      label="Name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      fullWidth
                      required
                      margin="normal"
                      variant="outlined"
                    />
                    
                    <TextField
                      name="email"
                      label="Email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      fullWidth
                      required
                      disabled
                      margin="normal"
                      variant="outlined"
                    />
                    
                    <TextField
                      name="bio"
                      label="Bio"
                      value={profileData.bio}
                      onChange={handleProfileChange}
                      fullWidth
                      multiline
                      rows={4}
                      margin="normal"
                      variant="outlined"
                      placeholder="Tell us about yourself and your cooking style..."
                    />
                    
                    {isEditing && (
                      <TextField
                        name="avatarUrl"
                        label="Avatar URL"
                        value={profileData.avatarUrl}
                        onChange={handleProfileChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        size="small"
                      />
                    )}
                  </>
                ) : (
                  <>
                    <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {user.name}
                    </Typography>
                    
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      {user.email}
                    </Typography>
                    
                    <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
                      About
                    </Typography>
                    
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {user.bio || "No bio provided yet."}
                    </Typography>
                  </>
                )}
              </Grid>
              
              <Grid item xs={12} md={5} sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: isMobile ? 'center' : 'flex-end',
                justifyContent: 'space-between'
              }}>
                {!isEditing ? (
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: isMobile ? 'center' : 'flex-end' }}>
                    <Button
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={() => setIsEditing(true)}
                      sx={{ mt: 2 }}
                    >
                      Edit Profile
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: isMobile ? 'center' : 'flex-end', mt: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={() => setIsEditing(false)}
                      sx={{ mr: 2 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={<Save />}
                      disabled={authLoading}
                    >
                      Save Changes
                    </Button>
                  </Box>
                )}
                
                {!isEditing && (
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 3,
                    justifyContent: 'center',
                    mt: isMobile ? 3 : 0
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      bgcolor: theme.palette.grey[50],
                      px: 3,
                      py: 2,
                      borderRadius: 1
                    }}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                        {userRecipes?.length || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Recipes
                      </Typography>
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      bgcolor: theme.palette.grey[50],
                      px: 3,
                      py: 2,
                      borderRadius: 1
                    }}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                        {user.favorites?.length || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Favorites
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </form>
      </Card>
      
      <Card elevation={2}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="fullWidth"
            aria-label="profile content tabs"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab 
              icon={<LocalDining />} 
              iconPosition="start" 
              label="My Recipes" 
              id="tab-0" 
              aria-controls="tabpanel-0" 
            />
            <Tab 
              icon={<Favorite />} 
              iconPosition="start" 
              label="Saved Recipes" 
              id="tab-1" 
              aria-controls="tabpanel-1" 
            />
          </Tabs>
        </Box>
        
        <CardContent sx={{ p: 3 }}>
          <TabPanel value={tabValue} index={0}>
            {recipesLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            ) : userRecipes && userRecipes.length > 0 ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">
                    My Recipes ({userRecipes.length})
                  </Typography>
                  <Button 
                    variant="contained" 
                    startIcon={<Add />}
                    onClick={() => navigate('/recipes/create')}
                  >
                    New Recipe
                  </Button>
                </Box>
                
                <Grid container spacing={3}>
                  {userRecipes.map((recipe) => (
                    <Grid item key={recipe.id} xs={12} sm={6} md={4}>
                      <RecipeCard recipe={recipe} />
                    </Grid>
                  ))}
                </Grid>
              </>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Restaurant sx={{ fontSize: 72, color: theme.palette.grey[300], mb: 2 }} />
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
                  You haven't created any recipes yet
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: '450px', mx: 'auto' }}>
                  Start sharing your culinary creations with the world by creating your first recipe.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Add />}
                  size="large"
                  onClick={() => navigate('/recipes/create')}
                >
                  Create Your First Recipe
                </Button>
              </Box>
            )}
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            {user.favorites && user.favorites.length > 0 ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">
                    My Favorites ({user.favorites.length})
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/favorites')}
                  >
                    View All
                  </Button>
                </Box>
                
                {/* Display some preview of favorites here */}
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1">
                    Your favorite recipes will appear here.
                  </Typography>
                </Box>
              </>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Favorite sx={{ fontSize: 72, color: theme.palette.grey[300], mb: 2 }} />
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
                  No favorites yet
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: '450px', mx: 'auto' }}>
                  Explore recipes and save your favorites to access them quickly.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/recipes')}
                >
                  Explore Recipes
                </Button>
              </Box>
            )}
          </TabPanel>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Profile;