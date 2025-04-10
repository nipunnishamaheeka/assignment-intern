import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  FormControl, 
  FormGroup, 
  FormControlLabel, 
  Checkbox, 
  Slider, 
  TextField, 
  Button,
  Divider,
  Paper,
  InputAdornment,
  Chip,
  IconButton,
  Tooltip,
  Stack
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Clear as ClearIcon,
  RestartAlt as ResetIcon,
  FilterAlt as FilterIcon,
  AccessTime as TimeIcon,
  SortByAlpha as SortIcon,
  Spa as VeganIcon,
  FoodBank as DietaryIcon,
  SignalCellularAlt as DifficultyIcon
} from '@mui/icons-material';

const FilterPanel = ({ currentFilters, onFilterChange }) => {
  const [filters, setFilters] = useState({
    dietary: currentFilters.dietary || [],
    cookingTime: currentFilters.cookingTime || [0, 120],
    difficulty: currentFilters.difficulty || '',
    searchTerm: currentFilters.searchTerm || '',
    ...currentFilters
  });
  
  const [expanded, setExpanded] = useState({
    dietary: true,
    cookingTime: true,
    difficulty: true
  });
  
  const dietaryOptions = [
    { value: 'vegetarian', label: 'Vegetarian', icon: <VeganIcon fontSize="small" /> },
    { value: 'vegan', label: 'Vegan', icon: <VeganIcon fontSize="small" /> },
    { value: 'gluten-free', label: 'Gluten Free', icon: <DietaryIcon fontSize="small" /> },
    { value: 'dairy-free', label: 'Dairy Free', icon: <DietaryIcon fontSize="small" /> },
    { value: 'keto', label: 'Keto', icon: <DietaryIcon fontSize="small" /> },
    { value: 'paleo', label: 'Paleo', icon: <DietaryIcon fontSize="small" /> }
  ];
  
  const difficultyOptions = [
    { value: '', label: 'Any difficulty' },
    { value: 'Easy', label: 'Easy' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Hard', label: 'Hard' }
  ];
  
  const toggleSection = (section) => {
    setExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleDietaryChange = (value) => {
    setFilters(prev => {
      const newDietary = prev.dietary.includes(value)
        ? prev.dietary.filter(item => item !== value)
        : [...prev.dietary, value];
        
      return {
        ...prev,
        dietary: newDietary
      };
    });
  };
  
  const handleTimeChange = (event, newValue) => {
    setFilters(prev => ({
      ...prev,
      cookingTime: newValue
    }));
  };
  
  const handleDifficultyChange = (event) => {
    setFilters(prev => ({
      ...prev,
      difficulty: event.target.value
    }));
  };
  
  const handleSearchChange = (event) => {
    setFilters(prev => ({
      ...prev,
      searchTerm: event.target.value
    }));
  };

  const handleClearSearch = () => {
    setFilters(prev => ({
      ...prev,
      searchTerm: ''
    }));
  };
  
  const handleApplyFilters = () => {
    onFilterChange(filters);
  };
  
  const handleResetFilters = () => {
    const resetFilters = {
      dietary: [],
      cookingTime: [0, 120],
      difficulty: '',
      searchTerm: ''
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.dietary.length > 0) count++;
    if (filters.difficulty) count++;
    if (filters.cookingTime[0] > 0 || filters.cookingTime[1] < 120) count++;
    return count;
  };
  
  return (
    <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        bgcolor: 'primary.main', 
        color: 'primary.contrastText',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterIcon />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Recipe Filters
          </Typography>
        </Box>
        
        {getActiveFilterCount() > 0 && (
          <Chip 
            label={`${getActiveFilterCount()} active`}
            color="secondary"
            size="small"
          />
        )}
      </Box>
      
      {/* Search Box */}
      <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
        <TextField
          fullWidth
          placeholder="Search recipes or ingredients..."
          value={filters.searchTerm}
          onChange={handleSearchChange}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: filters.searchTerm && (
              <InputAdornment position="end">
                <IconButton 
                  size="small" 
                  onClick={handleClearSearch}
                  edge="end"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
            sx: { borderRadius: 4 }
          }}
        />
      </Box>
      
      <Divider />
      
      {/* Dietary Section */}
      <Box sx={{ p: 2 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            cursor: 'pointer', 
            mb: expanded.dietary ? 2 : 0
          }}
          onClick={() => toggleSection('dietary')}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DietaryIcon color="primary" />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Dietary Restrictions
            </Typography>
          </Box>
          {filters.dietary.length > 0 && (
            <Chip 
              label={filters.dietary.length}
              color="primary"
              size="small"
            />
          )}
        </Box>
        
        {expanded.dietary && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {dietaryOptions.map(option => (
              <Chip
                key={option.value}
                icon={option.icon}
                label={option.label}
                clickable
                color={filters.dietary.includes(option.value) ? "primary" : "default"}
                onClick={() => handleDietaryChange(option.value)}
                variant={filters.dietary.includes(option.value) ? "filled" : "outlined"}
              />
            ))}
          </Box>
        )}
      </Box>
      
      <Divider />
      
      {/* Cooking Time Section */}
      <Box sx={{ p: 2 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            cursor: 'pointer',
            mb: expanded.cookingTime ? 2 : 0 
          }}
          onClick={() => toggleSection('cookingTime')}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TimeIcon color="primary" />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Cooking Time
            </Typography>
          </Box>
          {(filters.cookingTime[0] > 0 || filters.cookingTime[1] < 120) && (
            <Chip 
              label={`${filters.cookingTime[0]}-${filters.cookingTime[1]} min`}
              color="primary"
              size="small"
            />
          )}
        </Box>
        
        {expanded.cookingTime && (
          <Box sx={{ px: 2, mt: 3 }}>
            <Slider
              value={filters.cookingTime}
              onChange={handleTimeChange}
              valueLabelDisplay="auto"
              min={0}
              max={120}
              step={5}
              marks={[
                { value: 0, label: '0' },
                { value: 30, label: '30' },
                { value: 60, label: '60' },
                { value: 90, label: '90' },
                { value: 120, label: '120' }
              ]}
              valueLabelFormat={(value) => `${value} min`}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption" color="text.secondary">Quick</Typography>
              <Typography variant="caption" color="text.secondary">More time</Typography>
            </Box>
          </Box>
        )}
      </Box>
      
      <Divider />
      
      {/* Difficulty Section */}
      <Box sx={{ p: 2 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            cursor: 'pointer',
            mb: expanded.difficulty ? 2 : 0 
          }}
          onClick={() => toggleSection('difficulty')}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DifficultyIcon color="primary" />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Difficulty Level
            </Typography>
          </Box>
          {filters.difficulty && (
            <Chip 
              label={filters.difficulty}
              color="primary"
              size="small"
            />
          )}
        </Box>
        
        {expanded.difficulty && (
          <Box sx={{ mt: 1 }}>
            <Stack direction="row" spacing={1}>
              {difficultyOptions.map((option) => (
                <Chip
                  key={option.value}
                  label={option.label}
                  clickable
                  color={filters.difficulty === option.value ? "primary" : "default"}
                  onClick={() => handleDifficultyChange({ target: { value: option.value } })}
                  variant={filters.difficulty === option.value ? "filled" : "outlined"}
                />
              ))}
            </Stack>
          </Box>
        )}
      </Box>
      
      {/* Action Buttons */}
      <Box sx={{ p: 2, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider' }}>
        <Stack direction="row" spacing={2}>
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth
            size="large"
            onClick={handleApplyFilters}
            startIcon={<FilterIcon />}
            sx={{ borderRadius: 2 }}
          >
            Apply Filters
          </Button>
          <Tooltip title="Reset all filters">
            <IconButton 
              color="error" 
              onClick={handleResetFilters}
              sx={{ border: 1, borderColor: 'divider' }}
            >
              <ResetIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </Paper>
  );
};

export default FilterPanel;