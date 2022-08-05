import { configureStore } from '@reduxjs/toolkit';
import categorySlice from '../features/categories/categoriesSlice';
import categoryPageSlice from '../features/categories/categoriesPageSlice';

export const store = configureStore({
  reducer: {
    categorySlice: categorySlice,
    categoryPageSlice: categoryPageSlice,
  },
});
