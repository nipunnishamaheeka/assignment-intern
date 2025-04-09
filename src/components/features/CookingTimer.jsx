import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  IconButton,
  Slider,
  Fade,
  Paper,
  useTheme,
  alpha,
  Tooltip,
  Stack,
  Divider,
  Badge,
  Chip
} from '@mui/material';
import { 
  TimerOutlined, 
  PauseCircleOutline, 
  PlayCircleOutline, 
  RestartAlt, 
  Close, 
  Alarm, 
  Add, 
  Remove, 
  NotificationsActive, 
  TimerOff
} from '@mui/icons-material';

const CookingTimer = ({ initialMinutes = 0 }) => {
  const theme = useTheme();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60);
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(initialMinutes.toString());
  const [isCompleted, setIsCompleted] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    let interval = null;
    
    if (isRunning && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds(prevSeconds => prevSeconds - 1);
      }, 1000);
    } else if (isRunning && remainingSeconds === 0) {
      setIsRunning(false);
      setIsCompleted(true);
      // Could play a sound here
    }
    
    return () => clearInterval(interval);
  }, [isRunning, remainingSeconds]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
    if (isCompleted) {
      setIsCompleted(false);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setRemainingSeconds(totalSeconds);
    setIsCompleted(false);
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleCustomTimeChange = (e) => {
    const value = e.target.value;
    if (value === '' || (!isNaN(value) && parseFloat(value) >= 0)) {
      setCustomMinutes(value);
    }
  };

  const handleAdjustTime = (amount) => {
    const newValue = Math.max(0, parseFloat(customMinutes) + amount);
    setCustomMinutes(newValue.toString());
  };

  const handleSetCustomTime = () => {
    const newTotalSeconds = Math.round(parseFloat(customMinutes) * 60);
    setTotalSeconds(newTotalSeconds);
    setRemainingSeconds(newTotalSeconds);
    setIsRunning(false);
    setIsCompleted(false);
    handleCloseDialog();
  };

  const handleSliderChange = (_, newValue) => {
    setCustomMinutes(newValue.toString());
  };

  const progress = totalSeconds > 0 ? (remainingSeconds / totalSeconds) * 100 : 0;
  
  const getTimerColor = () => {
    if (isCompleted) return theme.palette.error.main;
    if (progress < 25) return theme.palette.warning.main;
    return theme.palette.primary.main;
  };

  const timerColor = getTimerColor();
  
  // Common preset times in minutes
  const presetTimes = [1, 5, 10, 15, 30, 60];

  return (
    <Box sx={{ width: '100%' }}>
      {isCompact ? (
        <Paper
          elevation={2}
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: 2,
            bgcolor: isRunning 
              ? alpha(theme.palette.primary.main, 0.05)
              : isCompleted
                ? alpha(theme.palette.error.main, 0.05)
                : theme.palette.background.paper
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              variant="dot"
              color={isRunning ? "success" : isCompleted ? "error" : "default"}
              sx={{ mr: 2 }}
            >
              <TimerOutlined color="action" />
            </Badge>
            <Typography variant="h6" fontWeight="medium">
              {formatTime(remainingSeconds)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton 
              size="small" 
              onClick={handleStartPause}
              color={isRunning ? "secondary" : "primary"}
            >
              {isRunning ? <PauseCircleOutline /> : <PlayCircleOutline />}
            </IconButton>
            <IconButton 
              size="small" 
              onClick={handleReset}
              color="default"
              disabled={remainingSeconds === totalSeconds && !isRunning}
            >
              <RestartAlt />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={() => setIsCompact(false)}
              color="default"
            >
              <Add fontSize="small" />
            </IconButton>
          </Box>
        </Paper>
      ) : (
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 2,
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
          }}
        >
          {/* Header with title and close button */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 2 
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Alarm sx={{ mr: 1.5, color: timerColor }} />
              <Typography variant="h6">
                Cooking Timer
              </Typography>
            </Box>
            <IconButton size="small" onClick={() => setIsCompact(true)}>
              <Remove fontSize="small" />
            </IconButton>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          {/* Timer display */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            position: 'relative',
            mb: 3
          }}>
            <Box sx={{ position: 'relative', display: 'inline-flex', mb: 1 }}>
              <CircularProgress
                variant="determinate"
                value={100}
                size={140}
                thickness={4}
                sx={{ color: alpha(theme.palette.divider, 0.3) }}
              />
              <CircularProgress
                variant="determinate"
                value={progress}
                size={140}
                thickness={4}
                sx={{ 
                  color: timerColor,
                  position: 'absolute',
                  left: 0,
                }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Fade in={isCompleted} timeout={800}>
                  <Box sx={{ 
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {isCompleted && (
                      <NotificationsActive 
                        sx={{ 
                          fontSize: 40, 
                          color: theme.palette.error.main,
                          animation: 'pulse 1.5s infinite'
                        }} 
                      />
                    )}
                  </Box>
                </Fade>
                <Typography
                  variant="h3"
                  component="div"
                  fontWeight="medium"
                  sx={{ 
                    color: isCompleted ? theme.palette.error.main : 'text.primary',
                    opacity: isCompleted ? 0.7 : 1
                  }}
                >
                  {formatTime(remainingSeconds)}
                </Typography>
              </Box>
            </Box>
            
            {isCompleted && (
              <Chip 
                label="Time's up!" 
                color="error" 
                icon={<TimerOff />}
                sx={{ mb: 2 }}
              />
            )}
            
            {/* Controls */}
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Tooltip title={isRunning ? "Pause Timer" : "Start Timer"}>
                <Button
                  variant="contained"
                  color={isRunning ? "secondary" : "primary"}
                  size="large"
                  startIcon={isRunning ? <PauseCircleOutline /> : <PlayCircleOutline />}
                  onClick={handleStartPause}
                  sx={{ 
                    px: 4,
                    boxShadow: theme.shadows[3]
                  }}
                >
                  {isRunning ? "Pause" : "Start"}
                </Button>
              </Tooltip>
              
              <Tooltip title="Reset Timer">
                <span>
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="large"
                    startIcon={<RestartAlt />}
                    onClick={handleReset}
                    disabled={remainingSeconds === totalSeconds && !isRunning && !isCompleted}
                  >
                    Reset
                  </Button>
                </span>
              </Tooltip>
            </Stack>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          {/* Set custom time section */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="medium">
              Adjust Timer (minutes)
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <IconButton 
                onClick={() => handleAdjustTime(-1)}
                disabled={parseFloat(customMinutes) <= 0}
                size="small"
              >
                <Remove />
              </IconButton>
              
              <TextField
                value={customMinutes}
                onChange={handleCustomTimeChange}
                type="number"
                variant="outlined"
                size="small"
                inputProps={{ 
                  min: 0, 
                  step: 0.5,
                  style: { textAlign: 'center' }
                }}
                sx={{ 
                  width: 100,
                  mx: 1
                }}
              />
              
              <IconButton onClick={() => handleAdjustTime(1)} size="small">
                <Add />
              </IconButton>
              
              <Button
                variant="contained"
                disableElevation
                onClick={handleSetCustomTime}
                sx={{ ml: 2 }}
              >
                Set
              </Button>
            </Box>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Quick presets:
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {presetTimes.map(time => (
                <Chip
                  key={time}
                  label={time === 60 ? "1 hour" : `${time} min`}
                  onClick={() => {
                    setCustomMinutes(time.toString());
                    handleSetCustomTime();
                  }}
                  clickable
                  variant="outlined"
                  color="primary"
                  size="small"
                />
              ))}
            </Box>
          </Box>
          
          <style jsx global>{`
            @keyframes pulse {
              0% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.2); opacity: 0.7; }
              100% { transform: scale(1); opacity: 1; }
            }
          `}</style>
        </Paper>
      )}

      <Dialog 
        open={isDialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          elevation: 6,
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            Set Cooking Timer
            <IconButton onClick={handleCloseDialog} size="small">
              <Close fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent dividers>
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              Minutes:
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <IconButton onClick={() => handleAdjustTime(-1)} disabled={parseFloat(customMinutes) <= 0}>
                <Remove />
              </IconButton>
              
              <TextField
                value={customMinutes}
                onChange={handleCustomTimeChange}
                type="number"
                variant="outlined"
                inputProps={{ 
                  min: 0, 
                  step: 0.5,
                  style: { textAlign: 'center' }
                }}
                sx={{ 
                  mx: 2,
                  width: 80
                }}
              />
              
              <IconButton onClick={() => handleAdjustTime(1)}>
                <Add />
              </IconButton>
            </Box>
            
            <Typography id="timer-slider" gutterBottom>
              Drag to adjust:
            </Typography>
            
            <Box sx={{ px: 1 }}>
              <Slider
                value={parseFloat(customMinutes)}
                onChange={handleSliderChange}
                aria-labelledby="timer-slider"
                step={1}
                marks
                min={0}
                max={60}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value} min`}
              />
            </Box>
            
            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle2" gutterBottom>
                Common presets:
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {presetTimes.map(time => (
                  <Chip
                    key={time}
                    label={time === 60 ? "1 hour" : `${time} min`}
                    onClick={() => setCustomMinutes(time.toString())}
                    clickable
                    color="primary"
                    variant={parseFloat(customMinutes) === time ? "filled" : "outlined"}
                    size="small"
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleSetCustomTime} 
            variant="contained" 
            disableElevation
          >
            Set Timer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CookingTimer;