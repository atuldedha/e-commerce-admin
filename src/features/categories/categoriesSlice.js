import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categories: []
};

export const categorySlice = createSlice({
  name: 'categorySlice',
  initialState,
  reducers: {
    loadCategories: (state, action) => {
      state.categories = action.payload
    },
  },
});

export const { loadCategories } = categorySlice.actions;

export const selectCategories= (state) => state.categorySlice.categories;

export default categorySlice.reducer;
