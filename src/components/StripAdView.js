import { Box } from "@mui/material";
import React from "react";
import EditMenu from "./EditMenu";

const StripAdView = ({ image, background, onDelete, onEdit }) => {
  return (
    <Box bgcolor={background} m="7px" p="8px" boxShadow={1}>
      <Box sx={{ textAlign: "right", bgcolor: "grey" }}>
        <EditMenu onDelete={onDelete} onEdit={onEdit} />
      </Box>

      <img
        src={image}
        alt=""
        style={{ height: "100px", width: "100%", objectFit: "scale-down" }}
      />
    </Box>
  );
};

export default StripAdView;
