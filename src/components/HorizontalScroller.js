import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import EditMenu from "./EditMenu";
import ProductView from "./ProductView";

const HorizontalScroller = ({
  products,
  title,
  background,
  onDelete,
  onEdit,
}) => {
  return (
    <Box
      bgcolor={background}
      p="16px"
      maxWidth="100vw"
      m="7px"
      boxShadow={2}
      sx={{ borderRadius: 1, overflow: "auto" }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "grey",
        }}
      >
        <Typography variant="h5">{title}</Typography>
        <EditMenu onDelete={onDelete} onEdit={onEdit} />
      </Box>

      <Box component="div" display="flex">
        {products.map((product, index) => (
          <ProductView key={index} product={product} />
        ))}
      </Box>
    </Box>
  );
};

export default HorizontalScroller;
