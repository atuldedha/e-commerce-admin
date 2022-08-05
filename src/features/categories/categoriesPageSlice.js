import { createSlice } from "@reduxjs/toolkit";

let data = localStorage.getItem("pagesData");
let categoryData = {};

if (data) {
  categoryData = JSON.parse(data);
}

const initialState = {
  categoryData: categoryData,
};

export const categoryPageSlice = createSlice({
  name: "categoryPageSlice",
  initialState,
  reducers: {
    loadCategoriesPage: (state, action) => {
      state.categoryData = {
        ...state.categoryData,
        [action.payload.categoryName]: action.payload.categoryInfo,
      };

      console.log(`Reducer data: ${state.categoryData}`);
    },
  },
});

export const { loadCategoriesPage } = categoryPageSlice.actions;

export const selectCategoryData = (state) =>
  state.categoryPageSlice.categoryData;

export default categoryPageSlice.reducer;
