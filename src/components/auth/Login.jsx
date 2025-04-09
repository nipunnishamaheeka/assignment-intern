import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/authSlice';

// Material UI imports
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Link,
  Divider,
  Alert,
  InputAdornment,
  IconButton,
  Stack,
  useTheme,
  useMediaQuery
} from '@mui/material';

// Icons
import {
  Visibility,
  VisibilityOff,
  LockOutlined,
  EmailOutlined
} from '@mui/icons-material';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData)).then((result) => {
      if (!result.error) {
        navigate('/');
      }
    });
  };
  
  return (
    <Container maxWidth="sm" sx={{ py: 8, height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Card 
        elevation={6} 
        sx={{ 
          width: '100%', 
          borderRadius: 2,
          overflow: 'visible',
          position: 'relative'
        }}
      >
        <Box sx={{ 
          width: 80, 
          height: 80, 
          bgcolor: 'primary.main', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          position: 'absolute',
          top: -40,
          left: '50%',
          transform: 'translateX(-50%)',
          boxShadow: 3
        }}>
          <LockOutlined sx={{ color: 'white', fontSize: 40 }} />
        </Box>
        
        <CardContent sx={{ pt: 6, px: isMobile ? 3 : 5 }}>
          <Typography variant="h4" align="center" sx={{ mb: 1, fontWeight: 700, mt: 2 }}>
            Welcome Back
          </Typography>
          
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Sign in to continue to your account
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
              {error}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Link component={RouterLink} to="/forgot-password" variant="body2" underline="hover">
                  Forgot Password?
                </Link>
              </Box>
              
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{ 
                  py: 1.5, 
                  textTransform: 'none', 
                  borderRadius: 2,
                  boxShadow: 2,
                  fontSize: 16
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Stack>
          </form>
          
          <Divider sx={{ my: 4 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Don't have an account?{' '}
              <Link component={RouterLink} to="/signup" fontWeight="medium" underline="hover">
                Sign Up
              </Link>
            </Typography>
            
            <Button
              variant="outlined"
              fullWidth
              size="large"
              sx={{ 
                textTransform: 'none', 
                borderRadius: 2,
                py: 1.2,
                fontSize: 15
              }}
              onClick={() => {
                dispatch(login({ email: 'demo@example.com', password: 'demo123' }))
                  .then(() => navigate('/'));
              }}
            >
              Try with Demo Account
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;