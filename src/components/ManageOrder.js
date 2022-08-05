import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../firebase";

function ManageOrder({ handleClose, product, orderedItems }) {
  console.log(product);
  console.log(orderedItems);

  const [isPacked, setIsPacked] = useState(false);
  const [isShipped, setIsShipped] = useState(false);
  const [isDispatched, setIsDispatched] = useState(false);

  const [images, setImages] = useState(orderedItems?.product_image_1);

  const [loading, setLoading] = useState(false);

  const changeOrderInfo = () => {
    if (!isPacked && !isShipped && !isDispatched) {
      handleClose();
    }
    setLoading(true);
    if (isDispatched) {
      const docRef = doc(db, "ORDERS", orderedItems.document_id);
      updateDoc(docRef, {
        order_status: "dispatched",
      }).then((e) => {
        console.log("success");
        setLoading(false);
        handleClose();
      });
    }

    if (isShipped) {
      const docRef = doc(db, "ORDERS", orderedItems.document_id);
      updateDoc(docRef, {
        order_status: "shipped",
      }).then((e) => {
        console.log("success");
        setLoading(false);
        handleClose();
      });
    }

    if (isPacked) {
      const docRef = doc(db, "ORDERS", orderedItems.document_id);
      updateDoc(docRef, {
        order_status: "packed",
      }).then((e) => {
        console.log("success");
        setLoading(false);
        handleClose();
      });
    }
  };
  return (
    <Box sx={{ width: "100%", bgcolor: "#F2F2F2" }}>
      {loading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 5 }}
          open={loading}
        >
          <CircularProgress color="primary" />
        </Backdrop>
      )}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h5" gutterBottom mt="16px">
          Edit order
        </Typography>

        <Button
          sx={{ border: 1, padding: "5px", mt: "16px" }}
          onClick={handleClose}
        >
          Cancel
        </Button>
      </Box>

      <Box sx={{ p: "20px" }}>
        <Typography variant="subtitle">
          Product Name: {orderedItems.product_title}
        </Typography>
        <Typography>Product Price: Rs. {orderedItems.product_price}</Typography>
      </Box>

      <Box display="flex" flexWrap="true">
        <Box m="10px" border={1} borderColor="#000000">
          <img
            src={images}
            style={{
              height: "90px",
              width: "160px",
              objectFit: "contain",
            }}
          />
        </Box>
      </Box>
      <Box sx={{ p: "20px" }}>
        <Typography>
          Order Status: {String(orderedItems.order_status).toLocaleUpperCase()}
        </Typography>
        <Typography>Address to deliver: {orderedItems.address}</Typography>
        <Typography>Change Order status: </Typography>
        <FormGroup sx={{ p: "10px" }}>
          <FormControlLabel
            disabled
            control={<Checkbox defaultChecked />}
            label="Ordered"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isPacked}
                onChange={() => setIsPacked(!isPacked)}
              />
            }
            label="Packed"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isShipped}
                onChange={() => setIsShipped(!isShipped)}
              />
            }
            label="Shipped"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isDispatched}
                onChange={() => setIsDispatched(!isDispatched)}
              />
            }
            label="Dispatched"
          />
        </FormGroup>
      </Box>
      <Button
        sx={{ mt: "7px" }}
        fullWidth
        variant="contained"
        component="span"
        onClick={changeOrderInfo}
      >
        Submit
      </Button>
    </Box>
  );
}

export default ManageOrder;
