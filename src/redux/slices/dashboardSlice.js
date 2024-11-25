import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeItem: 'Dashboard',
  role: 'client',
  userId: null,
  searchQuery: '',
  profile: {
    fullName: '',
    phoneNumber: '',
    email: '',
    username: '',
    bio: '',
    profilePhotoUrl: '',
    coverPhotoUrl: '',
  },
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setActiveItem: (state, action) => {
      state.activeItem = action.payload;
    },
    setUserDetails: (state, action) => {
      state.role = action.payload.role;
      state.userId = action.payload.id;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setProfile: (state, action) => {
      state.profile = {
        ...state.profile,
        ...action.payload,
      };
    },
    resetProfile: (state) => {
      state.profile = initialState.profile;
    },
  },
});

export const { setActiveItem, setUserDetails, setSearchQuery, setProfile, resetProfile } = dashboardSlice.actions;
export default dashboardSlice.reducer;
