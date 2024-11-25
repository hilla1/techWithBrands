import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './slices/dashboardSlice';
import solutionsReducer from './slices/solutionsSlice';
import testimonialsReducer from './slices/testimonialsSlice';

const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    solutions: solutionsReducer, 
    testimonials: testimonialsReducer,
  },
});

// Export types for use in components
export const selectDashboard = (state) => state.dashboard;

export default store;