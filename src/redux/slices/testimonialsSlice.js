import { createSlice } from '@reduxjs/toolkit';

const testimonialsSlice = createSlice({
  name: 'testimonials',
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setTestimonials: (state, action) => {
      state.items = action.payload;
    },
    addTestimonial: (state, action) => {
      state.items.push(action.payload);
    },
    updateTestimonial: (state, action) => {
      const index = state.items.findIndex(t => t._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteTestimonials: (state, action) => {
      state.items = state.items.filter(t => !action.payload.includes(t._id));
    },
  },
});

export const { setLoading, setTestimonials, addTestimonial, updateTestimonial, deleteTestimonials } = testimonialsSlice.actions;
export default testimonialsSlice.reducer;
