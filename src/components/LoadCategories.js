import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectCategories } from "../features/categories/categoriesSlice";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Avatar, Box } from "@mui/material";

const LoadCategories = ({ selected, handleChange }) => {
  const allCategories = useSelector(selectCategories);
  const cateogories = Object.values(allCategories);

  return (
    <Box
      sx={{
        maxWidth: "full",
        bgcolor: "#f5f5f5",
        boxShadow: 1,
        p: 1,
        mt: 1,
      }}
    >
      <Tabs
        value={selected}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
      >
        {cateogories &&
          cateogories.map((nested) =>
            nested.map((category) => (
              <Tab
                value={category.categoryName.toUpperCase()}
                key={category.index}
                label={category.categoryName.toUpperCase()}
                icon={<Avatar src={category.icon} alt="" variant="square" />}
              />
            ))
          )}
      </Tabs>
    </Box>
  );
};

export default LoadCategories;
