import { Box, Typography } from "@mui/material";
import { green, grey } from "@mui/material/colors";
import React from "react";

const ProductView = ({ product }) => {
  return (
    <Box
      width="200px"
      bgcolor="white"
      boxShadow="8px"
      p="16px"
      mx="4px"
      borderRight="16px"
      sx={{ borderRadius: 5 }}
    >
      <img
        src={product?.image}
        alt=""
        style={{
          width: "100px",
          height: "100px",
          objectFit: "scale-down",
          backgroundColor: grey[50],
        }}
      />

      <Typography variant="subtitle2">{product?.title}</Typography>
      {/* <Typography variant='subtitle2'>
            <span style = {{backgroundColor: green[700]}}>{product.title}</span>
        </Typography> */}
      <Typography variant="h6">{product?.price}</Typography>
    </Box>
  );
};

export default ProductView;
