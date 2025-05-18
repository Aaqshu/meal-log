import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  TextField,
  Container,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  InputAdornment,
} from '@mui/material';
import { format } from 'date-fns';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BarChartIcon from '@mui/icons-material/BarChart';
import Collapse from '@mui/material/Collapse';
import Fade from '@mui/material/Fade';
import LinearProgress from '@mui/material/LinearProgress';
import ButtonGroup from '@mui/material/ButtonGroup';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import './App.css';

const initialMeals = {
  breakfast: { time: '08:00', items: [] },
  lunch: { time: '12:00', items: [] },
  dinner: { time: '18:00', items: [] },
  snacks: { time: '', items: [] },
};

const emptyFoodItem = {
  name: '',
  portion: '',
  calories: '',
  brand: '',
  showMacros: false,
  protein: '',
  carbs: '',
  fats: '',
};

// Color and font mappings for Tailwind-like design
const mealTypeStyles = {
  breakfast: {
    bg: '#fef3c7', // amber-100
    border: '#fcd34d', // amber-300
    text: '#92400e', // amber-800
  },
  lunch: {
    bg: '#d1fae5', // emerald-100
    border: '#6ee7b7', // emerald-300
    text: '#065f46', // emerald-800
  },
  dinner: {
    bg: '#e0e7ff', // indigo-100
    border: '#a5b4fc', // indigo-300
    text: '#3730a3', // indigo-800
  },
  snacks: {
    bg: '#ffe4e6', // rose-100
    border: '#fda4af', // rose-300
    text: '#be123c', // rose-800
  },
};
const textColors = {
  primary: '#1f2937', // gray-800
  secondary: '#4b5563', // gray-600
  muted: '#6b7280', // gray-500
};
const accent = {
  green: '#16a34a', // green-600
  purple: '#9333ea', // purple-600
  blue: '#2563eb', // blue-600
  red: '#dc2626', // red-600
  grayBg: '#f9fafb', // gray-50
  white: '#fff',
};
const fontStack = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`;

function App() {
  const [meals, setMeals] = useState(initialMeals);
  const [dailyGoal, setDailyGoal] = useState(2000);

  // New meal creation state
  const [showFoodForm, setShowFoodForm] = useState(false);
  const [mealType, setMealType] = useState('breakfast');
  const [mealTime, setMealTime] = useState('');
  const [foodItems, setFoodItems] = useState([{ ...emptyFoodItem }]);

  // Add new food item row
  const handleAddFoodItem = () => {
    setFoodItems([...foodItems, { ...emptyFoodItem }]);
  };

  // Remove food item row
  const handleRemoveFoodItem = (idx) => {
    setFoodItems(foodItems.filter((_, i) => i !== idx));
  };

  // Update food item field
  const handleFoodItemChange = (idx, field, value) => {
    setFoodItems(foodItems.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  // Toggle macros
  const handleToggleMacros = (idx) => {
    setFoodItems(foodItems.map((item, i) => i === idx ? { ...item, showMacros: !item.showMacros } : item));
  };

  // Add meal to log
  const handleAddMealToLog = () => {
    if (!mealTime || !mealType) return;
    setMeals(prev => ({
      ...prev,
      [mealType]: {
        time: mealTime,
        items: [...prev[mealType].items, ...foodItems],
      },
    }));
    // Reset form
    setShowFoodForm(false);
    setMealTime('');
    setMealType('breakfast');
    setFoodItems([{ ...emptyFoodItem }]);
  };

  // Handler to remove a food item from a meal
  const handleRemoveLoggedFoodItem = (mealKey, idx) => {
    setMeals(prev => ({
      ...prev,
      [mealKey]: {
        ...prev[mealKey],
        items: prev[mealKey].items.filter((_, i) => i !== idx),
      },
    }));
  };

  const calculateTotalCalories = () => {
    return Object.values(meals).reduce((total, meal) => {
      return total + meal.items.reduce((mealTotal, item) => mealTotal + Number(item.calories), 0);
    }, 0);
  };

  const getMealCalories = (mealType) => {
    return meals[mealType].items.reduce((total, item) => total + Number(item.calories), 0);
  };

  // Calculate macros
  const getTotalMacros = () => {
    let protein = 0, carbs = 0, fats = 0;
    Object.values(meals).forEach(meal => {
      meal.items.forEach(item => {
        protein += Number(item.protein || 0);
        carbs += Number(item.carbs || 0);
        fats += Number(item.fats || 0);
      });
    });
    return { protein, carbs, fats };
  };
  const macros = getTotalMacros();
  const totalCalories = calculateTotalCalories();
  const remainingCalories = Math.max(0, dailyGoal - totalCalories);

  // Meal section colors
  const mealColors = {
    breakfast: '#ffe9b3',
    lunch: '#d6f5d6',
    dinner: '#d6e0ff',
    snacks: '#ffd6d6',
  };
  const mealTitles = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snacks: 'Snack',
  };

  const [goalSnackbarOpen, setGoalSnackbarOpen] = useState(false);

  // Add a ref to track previous dailyGoal
  const prevDailyGoalRef = React.useRef(dailyGoal);

  // Reset all state when dailyGoal changes
  React.useEffect(() => {
    if (prevDailyGoalRef.current !== dailyGoal) {
      setMeals(initialMeals);
      setMealTime('');
      setMealType('breakfast');
      setFoodItems([{ ...emptyFoodItem }]);
      setShowFoodForm(false);
      setGoalSnackbarOpen(false);
      prevDailyGoalRef.current = dailyGoal;
    }
  }, [dailyGoal]);

  // Show snackbar when daily goal is reached/exceeded
  React.useEffect(() => {
    if (totalCalories >= dailyGoal && dailyGoal > 0) {
      setGoalSnackbarOpen(true);
    }
  }, [totalCalories, dailyGoal]);

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f7f9fa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* AppBar */}
      <AppBar position="static" sx={{ bgcolor: accent.green, mb: 4, fontFamily: fontStack }} elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <text x="7" y="25" fontSize="22" fontFamily="Arial" fill="white">ψψ</text>
              </svg>
            </Box>
            <Typography variant="h6" component="div" sx={{ fontWeight: 700, letterSpacing: 1, color: accent.white, fontFamily: fontStack, fontSize: '1.5rem' }}>
              Daily Meal Log
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: accent.white, borderRadius: 999, px: 3, py: 0.5, boxShadow: '0 2px 8px 0 #16a34a22', border: `2px solid ${accent.green}` }}>
            <LocalFireDepartmentIcon sx={{ color: accent.green, mr: 1 }} />
            <Typography sx={{ color: accent.green, fontWeight: 600, fontFamily: fontStack, mr: 1, fontSize: 16 }}>
              Daily Goal
            </Typography>
            <TextField
              value={dailyGoal}
              onChange={e => setDailyGoal(Number(e.target.value))}
              size="small"
              sx={{
                bgcolor: accent.white,
                borderRadius: 999,
                width: 130,
                fontWeight: 700,
                fontFamily: fontStack,
                mx: 1,
                '& .MuiOutlinedInput-root': {
                  fontWeight: 700,
                  fontSize: 18,
                  color: accent.green,
                  borderRadius: 999,
                  px: 1,
                  '& fieldset': {
                    borderColor: accent.green,
                  },
                  '&:hover fieldset': {
                    borderColor: accent.green,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: accent.green,
                    boxShadow: '0 0 0 2px #16a34a33',
                  },
                },
              }}
              inputProps={{
                style: { textAlign: 'center', fontWeight: 700, fontFamily: fontStack, fontSize: 18, width: 80 },
                min: 0,
                maxLength: 4,
                type: 'number',
              }}
              InputProps={{
                endAdornment: <InputAdornment position="end" sx={{ color: accent.green, fontWeight: 700 }}>kcal</InputAdornment>,
              }}
              variant="outlined"
            />
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ flex: 1, py: 4, bgcolor: accent.grayBg, fontFamily: fontStack }}>
        <Grid container spacing={3} alignItems="flex-start">
          {/* LEFT COLUMN */}
          <Grid item xs={12} md={7} lg={8}>
            {/* Meal Form */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 1, bgcolor: accent.white }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', color: accent.green, fontFamily: fontStack, fontSize: '1.25rem' }}>
                <RestaurantMenuIcon sx={{ mr: 1, color: accent.green }} /> Add New Meal
              </Typography>
              {/* Step 1: Time & Meal Type */}
              <Collapse in={!showFoodForm} timeout={500}>
                <Box>
                  <Grid container spacing={2} sx={{ mb: 2, flexWrap: 'nowrap' }}>
                    <Grid item xs="auto" sx={{ minWidth: 90, maxWidth: 110, pr: 0 }}>
                      <Tooltip title="Select meal time" arrow>
                        <TextField
                          label="Time"
                          type="time"
                          value={mealTime}
                          onChange={e => setMealTime(e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          inputProps={{ step: 300 }}
                          InputProps={{
                            startAdornment: <InputAdornment position="start"><AccessTimeIcon fontSize="small" /></InputAdornment>,
                            sx: {
                              borderRadius: 999,
                              fontSize: 18,
                              height: 48,
                              px: 0.5,
                              bgcolor: accent.white,
                            },
                          }}
                          sx={{
                            bgcolor: accent.white,
                            borderRadius: 999,
                            fontWeight: 600,
                            fontFamily: fontStack,
                            width: 130,
                            minWidth: 120,
                            maxWidth: 140,
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 999,
                              fontSize: 18,
                              height: 48,
                              px: 0.5,
                              bgcolor: accent.white,
                              '& fieldset': {
                                borderColor: accent.green,
                              },
                              '&:hover fieldset': {
                                borderColor: accent.green,
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: accent.green,
                                boxShadow: '0 0 0 2px #16a34a33',
                              },
                            },
                          }}
                          className="modern-input"
                        />
                      </Tooltip>
                    </Grid>
                    <Grid item xs sx={{ pl: 0 }}>
                      <ButtonGroup variant="outlined" sx={{ width: '100%', display: 'flex', flexWrap: 'nowrap', gap: 0 }}>
                        {Object.keys(mealTypeStyles).map((key) => (
                          <Button
                            key={key}
                            onClick={() => setMealType(key)}
                            sx={{
                              flex: 1,
                              minWidth: 0,
                              maxWidth: 'none',
                              overflow: 'hidden',
                              bgcolor: mealType === key ? mealTypeStyles[key].bg : accent.white,
                              borderColor: mealTypeStyles[key].border,
                              color: mealType === key ? mealTypeStyles[key].text : textColors.secondary,
                              fontWeight: mealType === key ? 700 : 500,
                              fontFamily: fontStack,
                              boxShadow: mealType === key ? '0 2px 8px 0 #0001' : 'none',
                              '&:hover': {
                                bgcolor: mealTypeStyles[key].bg,
                                color: mealTypeStyles[key].text,
                              },
                              textTransform: 'none',
                              fontSize: 15,
                              borderRadius: 2,
                              borderRight: key !== 'snacks' ? undefined : '1px solid #e5e7eb',
                              position: 'relative',
                              justifyContent: 'center',
                              px: 0.5,
                            }}
                            disableElevation
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', overflow: 'hidden' }}>
                              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{mealTitles[key]}</span>
                              {meals[key].items.length > 0 && (
                                <CheckCircleIcon sx={{ color: accent.green, fontSize: 20, ml: 1, flexShrink: 0 }} />
                              )}
                            </Box>
                          </Button>
                        ))}
                      </ButtonGroup>
                    </Grid>
                  </Grid>
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    onClick={() => setShowFoodForm(true)}
                    disabled={!mealTime || !mealType}
                    sx={{ borderRadius: 2, fontWeight: 600, fontSize: 16 }}
                    className="modern-btn"
                  >
                    Add Meal
                  </Button>
                </Box>
              </Collapse>
              {/* Step 2: Food Items Form */}
              <Collapse in={showFoodForm} timeout={600}>
                <Box>
                  <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                    Food Items
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{ mb: 2, bgcolor: '#22a03d', '&:hover': { bgcolor: '#1a7c2c' }, borderRadius: 2, fontWeight: 600 }}
                    onClick={handleAddFoodItem}
                    className="modern-btn"
                  >
                    Add Item
                  </Button>
                  {foodItems.map((item, idx) => (
                    <Fade in={showFoodForm} timeout={500 + idx * 100} key={idx}>
                      <Paper sx={{ p: 2, mb: 2, position: 'relative', borderRadius: 2, boxShadow: 2, transition: 'box-shadow 0.3s' }} variant="outlined" className="modern-food-item">
                        <Typography fontWeight={600} sx={{ mb: 1 }}>Item {idx + 1}</Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Food Name"
                              placeholder="e.g., Oatmeal"
                              fullWidth
                              value={item.name}
                              onChange={e => handleFoodItemChange(idx, 'name', e.target.value)}
                              variant="outlined"
                              className="modern-input"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Portion Size"
                              placeholder="e.g., 1 cup (80g)"
                              fullWidth
                              value={item.portion}
                              onChange={e => handleFoodItemChange(idx, 'portion', e.target.value)}
                              variant="outlined"
                              className="modern-input"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Calories"
                              type="number"
                              fullWidth
                              value={item.calories}
                              onChange={e => handleFoodItemChange(idx, 'calories', e.target.value)}
                              variant="outlined"
                              className="modern-input"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Brand (optional)"
                              placeholder="e.g., Quaker"
                              fullWidth
                              value={item.brand}
                              onChange={e => handleFoodItemChange(idx, 'brand', e.target.value)}
                              variant="outlined"
                              className="modern-input"
                            />
                          </Grid>
                        </Grid>
                        <Box sx={{ mt: 1 }}>
                          <Button
                            size="small"
                            sx={{ textTransform: 'none', pl: 0 }}
                            onClick={() => handleToggleMacros(idx)}
                            className="modern-link"
                          >
                            <Typography color="#1976d2" fontWeight={500}>
                              {item.showMacros ? 'Hide Macros' : 'Add Macros (optional)'}
                            </Typography>
                          </Button>
                          <Collapse in={item.showMacros} timeout={400}>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                              <Grid item xs={4}>
                                <TextField
                                  label="Protein (g)"
                                  type="number"
                                  fullWidth
                                  value={item.protein}
                                  onChange={e => handleFoodItemChange(idx, 'protein', e.target.value)}
                                  variant="outlined"
                                  className="modern-input"
                                />
                              </Grid>
                              <Grid item xs={4}>
                                <TextField
                                  label="Carbs (g)"
                                  type="number"
                                  fullWidth
                                  value={item.carbs}
                                  onChange={e => handleFoodItemChange(idx, 'carbs', e.target.value)}
                                  variant="outlined"
                                  className="modern-input"
                                />
                              </Grid>
                              <Grid item xs={4}>
                                <TextField
                                  label="Fats (g)"
                                  type="number"
                                  fullWidth
                                  value={item.fats}
                                  onChange={e => handleFoodItemChange(idx, 'fats', e.target.value)}
                                  variant="outlined"
                                  className="modern-input"
                                />
                              </Grid>
                            </Grid>
                          </Collapse>
                        </Box>
                        {foodItems.length > 1 && (
                          <Button
                            onClick={() => handleRemoveFoodItem(idx)}
                            sx={{ position: 'absolute', top: 8, right: 8, minWidth: 0, color: '#e53935' }}
                            className="modern-delete-btn"
                          >
                            <DeleteIcon />
                          </Button>
                        )}
                      </Paper>
                    </Fade>
                  ))}
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    sx={{ mt: 1, borderRadius: 2, fontWeight: 600, fontSize: 16 }}
                    onClick={handleAddMealToLog}
                    disabled={foodItems.some(item => !item.name || !item.portion || !item.calories)}
                    className="modern-btn"
                  >
                    Add Meal
                  </Button>
                </Box>
              </Collapse>
            </Paper>

            {/* Today's Meals */}
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 1, bgcolor: accent.white }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', color: accent.green, fontFamily: fontStack, fontSize: '1.25rem' }}>
                <AccessTimeIcon sx={{ mr: 1 }} /> Today's Meals
              </Typography>
              {Object.keys(mealTitles).map((key) => (
                <Box key={key} sx={{ mb: 2 }}>
                  <Box sx={{
                    bgcolor: mealTypeStyles[key].bg,
                    border: `1.5px solid ${mealTypeStyles[key].border}`,
                    px: 2, py: 1, borderRadius: 1, mb: 1, display: 'flex', alignItems: 'center',
                  }}>
                    <Typography fontWeight={700} sx={{ color: mealTypeStyles[key].text, fontSize: 16, fontFamily: fontStack }}>
                      {mealTitles[key]}
                    </Typography>
                  </Box>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: accent.white, minHeight: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1.5px solid ${mealTypeStyles[key].border}` }}>
                    {meals[key].items.length === 0 ? (
                      <Typography sx={{ color: textColors.muted, fontStyle: 'italic', fontFamily: fontStack, fontSize: 15 }}>
                        No {mealTitles[key].toLowerCase()} entries yet
                      </Typography>
                    ) : (
                      <List sx={{ width: '100%' }}>
                        {meals[key].items.map((item, idx) => (
                          <ListItem key={idx} sx={{ px: 0, position: 'relative', alignItems: 'flex-start' }}
                            secondaryAction={
                              <Button
                                onClick={() => handleRemoveLoggedFoodItem(key, idx)}
                                sx={{ minWidth: 0, color: accent.red, ml: 1, fontWeight: 700 }}
                                className="modern-delete-btn"
                              >
                                <DeleteIcon />
                              </Button>
                            }
                          >
                            <ListItemText
                              primary={<>
                                <b style={{ color: textColors.primary, fontFamily: fontStack }}>{item.name}</b> <span style={{ color: textColors.muted }}>({item.portion})</span>
                                {item.brand && <span style={{ color: textColors.muted, marginLeft: 8 }}>• {item.brand}</span>}
                              </>}
                              secondary={<span style={{ color: textColors.secondary, fontSize: 13, fontFamily: fontStack }}>
                                {item.calories} cal
                                {item.protein && <> | P: {item.protein}g</>}
                                {item.carbs && <> | C: {item.carbs}g</>}
                                {item.fats && <> | F: {item.fats}g</>}
                              </span>}
                            />
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </Paper>
                </Box>
              ))}
              {/* Empty state for no meals at all */}
              {Object.values(meals).every(m => m.items.length === 0) && (
                <Paper variant="outlined" sx={{ p: 2, mt: 2, bgcolor: accent.grayBg, border: '1.5px solid #b3d8ff', display: 'flex', alignItems: 'center' }}>
                  <InfoOutlinedIcon sx={{ color: accent.blue, mr: 1 }} />
                  <Typography sx={{ color: accent.blue, fontWeight: 500, fontFamily: fontStack }}>
                    No meals logged yet
                  </Typography>
                  <Typography sx={{ color: textColors.muted, ml: 1, fontFamily: fontStack }}>
                    Use the form above to add your first meal. Track everything you eat and drink to get accurate nutrition data.
                  </Typography>
                </Paper>
              )}
            </Paper>
          </Grid>

          {/* RIGHT COLUMN */}
          <Grid item xs={12} md={5} lg={4}>
            {/* Daily Summary */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 1, bgcolor: accent.white }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', color: accent.green, fontFamily: fontStack, fontSize: '1.25rem' }}>
                <BarChartIcon sx={{ mr: 1, color: accent.green }} /> Daily Summary
              </Typography>
              <Grid container alignItems="center" sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography fontWeight={500} sx={{ color: textColors.secondary, fontFamily: fontStack, fontSize: 15 }}>Daily Goal</Typography>
                  <Typography fontWeight={700} sx={{ fontSize: 20, color: textColors.primary, fontFamily: fontStack }}>{totalCalories} / {dailyGoal} <span style={{ fontSize: 14, color: textColors.muted }}>cal</span></Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                  <Typography fontWeight={500} sx={{ color: textColors.secondary, fontFamily: fontStack, fontSize: 15 }}>Remaining</Typography>
                  <Typography fontWeight={700} sx={{ fontSize: 20, color: accent.green, fontFamily: fontStack }}>{remainingCalories} <span style={{ fontSize: 14, color: textColors.muted }}>cal</span></Typography>
                </Grid>
                <Grid item xs={12} sx={{ mt: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, (totalCalories / dailyGoal) * 100)}
                    sx={{ height: 10, borderRadius: 5, background: '#e0e0e0',
                      '& .MuiLinearProgress-bar': {
                        background: totalCalories < dailyGoal ? accent.green : accent.red,
                        transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1) 0ms',
                      }
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={4}>
                  <Typography fontWeight={500} sx={{ color: accent.blue, fontFamily: fontStack, fontSize: 15 }}>Protein</Typography>
                  <Typography fontWeight={700} sx={{ color: textColors.primary, fontFamily: fontStack }}>{macros.protein} <span style={{ fontSize: 14, color: textColors.muted }}>g</span></Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography fontWeight={500} sx={{ color: accent.green, fontFamily: fontStack, fontSize: 15 }}>Carbs</Typography>
                  <Typography fontWeight={700} sx={{ color: textColors.primary, fontFamily: fontStack }}>{macros.carbs} <span style={{ fontSize: 14, color: textColors.muted }}>g</span></Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography fontWeight={500} sx={{ color: accent.red, fontFamily: fontStack, fontSize: 15 }}>Fats</Typography>
                  <Typography fontWeight={700} sx={{ color: textColors.primary, fontFamily: fontStack }}>{macros.fats} <span style={{ fontSize: 14, color: textColors.muted }}>g</span></Typography>
                </Grid>
              </Grid>
              <Typography fontWeight={600} sx={{ mt: 2, mb: 1, color: textColors.primary, fontFamily: fontStack, fontSize: 16 }}>
                Meal Breakdown
              </Typography>
              <List dense>
                {Object.keys(mealTitles).map(key => (
                  <ListItem key={key} sx={{ px: 0, py: 0.5 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: mealTypeStyles[key].bg, border: `1.5px solid ${mealTypeStyles[key].border}`, mr: 1 }} />
                    <Typography sx={{ flex: 1, color: mealTypeStyles[key].text, fontWeight: 600, fontFamily: fontStack }}>{mealTitles[key]}</Typography>
                    <Typography fontWeight={600} sx={{ color: textColors.primary, fontFamily: fontStack }}>{getMealCalories(key)} cal</Typography>
                  </ListItem>
                ))}
              </List>
            </Paper>
            {/* Nutrition Tips */}
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 1, bgcolor: accent.white }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', color: accent.purple, fontFamily: fontStack, fontSize: '1.25rem' }}>
                <InfoOutlinedIcon sx={{ mr: 1, color: accent.purple }} /> Nutrition Tips
              </Typography>
              <Typography fontSize={15} sx={{ mb: 1, color: textColors.primary, fontFamily: fontStack }}>
                <b>Protein:</b> Aim for 0.8-1g of protein per pound of body weight for muscle maintenance.
              </Typography>
              <Typography fontSize={15} sx={{ mb: 1, color: textColors.primary, fontFamily: fontStack }}>
                <b>Balanced Meals:</b> Include protein, complex carbs, and healthy fats in each meal.
              </Typography>
              <Typography fontSize={15} sx={{ color: textColors.primary, fontFamily: fontStack }}>
                <b>Tracking Accuracy:</b> Use measuring cups, spoons, or a food scale for better portion accuracy.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      {/* Footer */}
      <Box sx={{ textAlign: 'center', py: 2, color: textColors.muted, fontSize: 15, borderTop: '1px solid #eee', mt: 4, fontFamily: fontStack }}>
        Daily Meal Log © {new Date().getFullYear()} - Track your nutrition with confidence
      </Box>
      {/* Snackbar for reaching daily goal */}
      <Snackbar
        open={goalSnackbarOpen}
        autoHideDuration={4000}
        onClose={() => setGoalSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setGoalSnackbarOpen(false)}
          iconMapping={{ success: <EmojiEventsIcon fontSize="large" sx={{ color: '#fbbf24', animation: 'tada 1s' }} /> }}
          severity="success"
          sx={{ fontWeight: 600, fontSize: 18, alignItems: 'center', bgcolor: '#fef3c7', color: '#92400e', border: '2px solid #fcd34d', boxShadow: 3 }}
        >
          You reached your daily Calorie Goal!
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}

export default App; 