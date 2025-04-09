import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Tooltip, 
  IconButton, 
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Share, 
  Facebook, 
  Twitter, 
  Pinterest, 
  WhatsApp, 
  Email, 
  ContentCopy, 
  Close 
} from '@mui/icons-material';

const SocialSharing = ({ recipe }) => {
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const shareUrl = window.location.href;
  const shareTitle = `Check out this delicious recipe: ${recipe.title}`;
  const shareDescription = `${recipe.description || 'A delicious recipe from Flavor Exchange!'} #flavorexchange #recipe`;
  
  const handleOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  
  const showNotification = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        showNotification('Link copied to clipboard!');
      })
      .catch(() => {
        showNotification('Failed to copy link');
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
        shareLink = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(recipe.image)}&description=${encodeURIComponent(shareTitle)}`;
        break;
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}`;
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
    handleClose();
  };
  
  return (
    <Box>
      <Button
        variant="outlined"
        startIcon={<Share />}
        onClick={handleOpen}
        className="mb-4"
      >
        Share Recipe
      </Button>
      
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Share This Recipe
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          <DialogContentText className="mb-4">
            Share this delicious recipe with friends and family:
          </DialogContentText>
          
          <Box className="flex justify-center gap-4 mb-6">
            <Tooltip title="Share on Facebook">
              <IconButton 
                color="primary" 
                onClick={() => handleShare('facebook')}
                className="bg-blue-100 hover:bg-blue-200"
              >
                <Facebook />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Share on Twitter">
              <IconButton 
                color="primary" 
                onClick={() => handleShare('twitter')}
                className="bg-blue-100 hover:bg-blue-200"
              >
                <Twitter />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Share on Pinterest">
              <IconButton 
                color="secondary" 
                onClick={() => handleShare('pinterest')}
                className="bg-red-100 hover:bg-red-200"
              >
                <Pinterest />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Share on WhatsApp">
              <IconButton 
                style={{ color: '#25D366' }} 
                onClick={() => handleShare('whatsapp')}
                className="bg-green-100 hover:bg-green-200"
              >
                <WhatsApp />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Share via Email">
              <IconButton 
                color="default" 
                onClick={() => handleShare('email')}
                className="bg-gray-100 hover:bg-gray-200"
              >
                <Email />
              </IconButton>
            </Tooltip>
          </Box>
          
          <Box className="mt-4">
            <TextField
              fullWidth
              variant="outlined"
              value={shareUrl}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <IconButton edge="end" onClick={handleCopyLink}>
                    <ContentCopy />
                  </IconButton>
                ),
              }}
            />
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={3000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SocialSharing;