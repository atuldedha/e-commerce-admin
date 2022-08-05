import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import { blueGrey } from "@mui/material/colors";
import EditMenu from "./EditMenu";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const BannerSlider = ({ images, onDelete, onEdit }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <Box
      sx={{
        mt: "5px",
        bgcolor: "#f5f5f5",
        boxShadow: 2,
        p: "16px",
        mx: "4px",
        borderRight: "16px",
      }}
    >
      <Box sx={{ bgcolor: "grey", textAlign: "right" }}>
        <EditMenu onDelete={onDelete} onEdit={onEdit} />
      </Box>

      <AutoPlaySwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {images.map((element, index) => (
          <div key={index}>
            {Math.abs(activeStep - index) <= 2 ? (
              <Box
                component="img"
                sx={{
                  objectFit: "contain",
                  height: 255,
                  display: "block",
                  overflow: "hidden",
                  width: "100%",
                  bgcolor: "#f5f5f5",
                }}
                src={element.image}
                alt=""
              />
            ) : null}
          </div>
        ))}
      </AutoPlaySwipeableViews>
    </Box>
  );
};

export default BannerSlider;
