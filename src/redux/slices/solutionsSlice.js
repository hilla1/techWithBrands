// src/slices/solutionsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  solutions: [], // Initialize solutions state
};

const solutionsSlice = createSlice({
  name: 'solutions',
  initialState,
  reducers: {
    setSolutions(state, action) {
      state.solutions = action.payload; // Set solutions data
    },
    addSolution(state, action) {
      state.solutions.push(action.payload); // Add a new solution
    },
    editSolution(state, action) {
      const index = state.solutions.findIndex(sol => sol._id === action.payload._id);
      if (index >= 0) {
        state.solutions[index] = action.payload; // Update the existing solution
      }
    },
    deleteSolution(state, action) {
      state.solutions = state.solutions.filter(sol => sol._id !== action.payload); // Remove solution by ID
    },
  },
});

// Export actions
export const {
  setSolutions,
  addSolution,
  editSolution,
  deleteSolution,
} = solutionsSlice.actions;

// Export reducer
export default solutionsSlice.reducer;
