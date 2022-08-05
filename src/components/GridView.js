import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import EditMenu from "./EditMenu";
import ProductView from "./ProductView";

const GridView = ({ gridProducts, background, title, onDelete, onEdit }) => {
  return (
    <Box>
      <Box width="400px" bgcolor={background} mx="auto" p="10px" boxShadow={1}>
        <Box sx={{ textAlign: "right", bgcolor: "grey" }}>
          <EditMenu onDelete={onDelete} onEdit={onEdit} />
        </Box>
        <Typography
          variant="h5"
          ml="5px"
          sx={{ fontStyle: "bold", fontSize: "30px" }}
        >
          {title}
        </Typography>
        <Box sx={{ boxShadow: 2, bgcolor: "#f7f7f7" }}>
          <Box display="flex" justifyContent="center" p="8px">
            <ProductView product={gridProducts[0]} />
            <ProductView product={gridProducts[1]} />
          </Box>

          <Box display="flex" justifyContent="center" p="8px">
            <ProductView product={gridProducts[2]} />
            <ProductView product={gridProducts[3]} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default GridView;
