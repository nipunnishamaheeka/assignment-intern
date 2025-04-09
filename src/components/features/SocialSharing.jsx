import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Tooltip, 
  IconButton, 
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Snackbar,
  Alert,
  Typography,
  Slide,
  Divider,
  Paper,
  InputAdornment,
  Fade,
  useTheme,
  alpha,
  Chip,
  Stack,
  useMediaQuery
} from '@mui/material';
import { 
  Share,
  ShareOutlined, 
  Facebook, 
  Twitter, 
  Pinterest, 
  WhatsApp, 
  Email, 
  ContentCopy, 
  Close, 
  Link as LinkIcon,
  Instagram,
  Telegram,
  Reddit,
  QrCode2,
  CheckCircleOutline
} from '@mui/icons-material';

// Create a transition for the dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const SocialSharing = ({ recipe }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('social');
  
  const shareUrl = window.location.href;
  const shareTitle = `Check out this delicious recipe: ${recipe.title}`;
  const shareDescription = `${recipe.description || 'A delicious recipe from Flavor Exchange!'} #flavorexchange #recipe`;
  
  const handleOpen = () => {
    setOpen(true);
    setCopySuccess(false);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  
  const showNotification = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopySuccess(true);
        showNotification('Link copied to clipboard!');
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(() => {
        showNotification('Failed to copy link', 'error');
      });
  };
  
  const handleShare = (platform) => {
    // In a real app, these would use the actual sharing APIs
    let shareLink = '';
    
    switch(platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
        break;
      case 'pinterest':
        shareLink = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(recipe.imageUrl)}&description=${encodeURIComponent(shareTitle)}`;
        break;
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}`;
        break;
      case 'telegram':
        shareLink = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
        break;
      case 'reddit':
        shareLink = `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`;
        break;
      case 'email':
        shareLink = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareDescription}\n\n${shareUrl}`)}`;
        break;
      default:
        break;
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank');
    }
    
    showNotification(`Shared on ${platform}!`);
  };

  // Social platforms data with colors
  const socialPlatforms = [
    { 
      name: 'Facebook', 
      icon: <Facebook />, 
      color: '#1877F2',
      platform: 'facebook'
    },
    { 
      name: 'Twitter', 
      icon: <Twitter />, 
      color: '#1DA1F2',
      platform: 'twitter'
    },
    { 
      name: 'Pinterest', 
      icon: <Pinterest />, 
      color: '#E60023',
      platform: 'pinterest'
    },
    { 
      name: 'WhatsApp', 
      icon: <WhatsApp />, 
      color: '#25D366',
      platform: 'whatsapp'
    },
    { 
      name: 'Instagram', 
      icon: <Instagram />, 
      color: '#C13584',
      platform: 'instagram'
    },
    { 
      name: 'Telegram', 
      icon: <Telegram />, 
      color: '#0088cc',
      platform: 'telegram'
    },
    { 
      name: 'Reddit', 
      icon: <Reddit />, 
      color: '#FF4500',
      platform: 'reddit'
    },
    { 
      name: 'Email', 
      icon: <Email />, 
      color: '#EA4335',
      platform: 'email'
    },
  ];
  
  return (
    <Box>
      {/* Share Button */}
      <Button
        variant="outlined"
        startIcon={<ShareOutlined />}
        onClick={handleOpen}
        sx={{
          borderRadius: 8,
          px: 2,
          py: 1,
          borderColor: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.04),
          }
        }}
      >
        Share Recipe
      </Button>
      
      {/* Share Dialog */}
      <Dialog 
        open={open} 
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        TransitionComponent={Transition}
        PaperProps={{
          elevation: 5,
          sx: { 
            borderRadius: 2,
            overflow: 'hidden'
          }
        }}
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ 
          pb: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Share sx={{ mr: 1.5, color: theme.palette.primary.main }} />
            <Typography variant="h6" component="div">
              Share This Recipe
            </Typography>
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            sx={{ 
              color: 'text.secondary'
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        
        <Divider />
        
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          {/* Recipe Info Preview */}
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 2, 
              mb: 3, 
              borderRadius: 1,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 2,
              backgroundColor: alpha(theme.palette.background.default, 0.6)
            }}
          >
            {recipe.imageUrl && (
              <Box 
                component="img"
                src={recipe.imageUrl}
                alt={recipe.title}
                sx={{ 
                  width: 60,
                  height: 60,
                  borderRadius: 1,
                  objectFit: 'cover',
                  flexShrink: 0
                }}
              />
            )}
            <Box sx={{ overflow: 'hidden' }}>
              <Typography 
                variant="subtitle1" 
                component="div" 
                fontWeight="medium"
                noWrap
              >
                {recipe.title}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}
              >
                {recipe.description || 'Delicious recipe from Flavor Exchange'}
              </Typography>
            </Box>
          </Paper>
          
          {/* Tab options */}
          <Stack 
            direction="row" 
            spacing={1} 
            sx={{ mb: 3 }}
          >
            <Chip 
              label="Social Media" 
              icon={<Share fontSize="small" />}
              onClick={() => setActiveTab('social')}
              color={activeTab === 'social' ? 'primary' : 'default'}
              variant={activeTab === 'social' ? 'filled' : 'outlined'}
            />
            <Chip 
              label="Direct Link" 
              icon={<LinkIcon fontSize="small" />}
              onClick={() => setActiveTab('link')}
              color={activeTab === 'link' ? 'primary' : 'default'}
              variant={activeTab === 'link' ? 'filled' : 'outlined'}
            />
            <Chip 
              label="QR Code" 
              icon={<QrCode2 fontSize="small" />}
              onClick={() => setActiveTab('qr')}
              color={activeTab === 'qr' ? 'primary' : 'default'}
              variant={activeTab === 'qr' ? 'filled' : 'outlined'}
            />
          </Stack>

          {/* Social Media Tab */}
          <Fade in={activeTab === 'social'}>
            <Box sx={{ display: activeTab === 'social' ? 'block' : 'none' }}>
              <Typography variant="subtitle2" gutterBottom color="text.secondary">
                Share with your friends on:
              </Typography>
              
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: isMobile ? 'repeat(4, 1fr)' : 'repeat(4, 1fr)',
                gap: 2,
                mb: 2
              }}>
                {socialPlatforms.map((platform) => (
                  <Button
                    key={platform.name}
                    variant="outlined"
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      p: 1.5,
                      borderRadius: 2,
                      borderColor: alpha(platform.color, 0.5),
                      color: platform.color,
                      '&:hover': {
                        backgroundColor: alpha(platform.color, 0.1),
                        borderColor: platform.color
                      }
                    }}
                    onClick={() => handleShare(platform.platform)}
                  >
                    <Box sx={{ 
                      backgroundColor: alpha(platform.color, 0.15),
                      borderRadius: '50%',
                      p: 1,
                      display: 'flex'
                    }}>
                      {platform.icon}
                    </Box>
                    <Typography 
                      variant="caption" 
                      component="span"
                      sx={{
                        fontWeight: 500,
                        display: isMobile ? 'none' : 'block'
                      }}
                    >
                      {platform.name}
                    </Typography>
                  </Button>
                ))}
              </Box>
            </Box>
          </Fade>

          {/* Direct Link Tab */}
          <Fade in={activeTab === 'link'}>
            <Box sx={{ display: activeTab === 'link' ? 'block' : 'none' }}>
              <Typography variant="subtitle2" gutterBottom color="text.secondary">
                Copy the direct link to share:
              </Typography>
              
              <TextField
                fullWidth
                variant="outlined"
                value={shareUrl}
                InputProps={{
                  sx: { pr: 1, borderRadius: 2 },
                  startAdornment: (
                    <InputAdornment position="start">
                      <LinkIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {copySuccess ? (
                        <Fade in={copySuccess}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                            <CheckCircleOutline color="success" fontSize="small" sx={{ mr: 0.5 }} />
                            <Typography variant="caption" color="success.main">
                              Copied
                            </Typography>
                          </Box>
                        </Fade>
                      ) : null}
                      <Button 
                        onClick={handleCopyLink}
                        variant="contained"
                        disableElevation
                        size="small"
                        sx={{ 
                          borderRadius: 1,
                          minWidth: 'unset'
                        }}
                        startIcon={<ContentCopy fontSize="small" />}
                      >
                        {isMobile ? '' : 'Copy'}
                      </Button>
                    </Box>
                  ),
                  readOnly: true
                }}
              />
              
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                You can paste this link in messages, emails, or any platform to share this recipe.
              </Typography>
            </Box>
          </Fade>

          {/* QR Code Tab */}
          <Fade in={activeTab === 'qr'}>
            <Box 
              sx={{ 
                display: activeTab === 'qr' ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 2
              }}
            >
              <Typography variant="subtitle2" gutterBottom color="text.secondary" sx={{ alignSelf: 'flex-start' }}>
                Scan this QR code to share:
              </Typography>
              
              <Box 
                sx={{ 
                  width: 200, 
                  height: 200, 
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  p: 2,
                  mb: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {/* This would be replaced with an actual QR code in a real app */}
                <QrCode2 sx={{ fontSize: 160, color: theme.palette.text.secondary }} />
              </Box>
              
              <Button
                variant="outlined"
                size="small"
                startIcon={<ContentCopy fontSize="small" />}
                onClick={() => showNotification('QR Code saved to your device')}
              >
                Save QR Code
              </Button>
            </Box>
          </Fade>
        </DialogContent>
        
        <Divider />
        
        <DialogActions sx={{ px: 3, py: 1.5 }}>
          <Button 
            onClick={handleClose} 
            color="inherit"
            variant="text"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notification */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={3000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionComponent={Slide}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity} 
          variant="filled"
          sx={{ width: '100%', boxShadow: theme.shadows[3] }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SocialSharing;