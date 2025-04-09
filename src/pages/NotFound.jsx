import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Paper,
  useTheme,
  useMediaQuery,
  styled
} from '@mui/material';
import { SentimentVeryDissatisfied, Home, ArrowBack } from '@mui/icons-material';

// Custom styled components
const AnimatedIcon = styled(SentimentVeryDissatisfied)(({ theme }) => ({
  fontSize: 120,
  color: theme.palette.grey[400],
  animation: 'float 3s ease-in-out infinite',
  '@keyframes float': {
    '0%': {
      transform: 'translateY(0px)'
    },
    '50%': {
      transform: 'translateY(-10px)'
    },
    '100%': {
      transform: 'translateY(0px)'
    }
  }
}));

const GlowCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  borderRadius: 16,
  textAlign: 'center',
  boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)',
  background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.grey[100]})`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -100,
    left: -100,
    width: 200,
    height: 200,
    borderRadius: '50%',
    background: `radial-gradient(circle, ${theme.palette.primary.light}20, transparent 70%)`,
    zIndex: 0
  }
}));

const NumberTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 900,
  color: theme.palette.primary.main,
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: theme.spacing(1)
}));

const NotFound = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        py: 4
      }}
    >
      <GlowCard elevation={isMobile ? 3 : 6}>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <AnimatedIcon />
          
          <NumberTypography variant={isMobile ? "h3" : "h2"}>
            404
          </NumberTypography>
          
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            fontWeight="bold" 
            sx={{ mb: 2 }}
          >
            Page Not Found
          </Typography>
          
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ mb: 5, maxWidth: "80%", mx: "auto" }}
          >
            The page you're looking for doesn't exist or has been moved to another location.
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<Home />}
              onClick={() => navigate('/')}
              sx={{ 
                px: 3, 
                py: 1.5, 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: theme.shadows[4]
              }}
            >
              Back to Home
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
              sx={{ 
                px: 3, 
                py: 1.5, 
                borderRadius: 2,
                textTransform: 'none' 
              }}
            >
              Go Back
            </Button>
          </Box>
        </Box>
      </GlowCard>
    </Container>
  );
};

export default NotFound;