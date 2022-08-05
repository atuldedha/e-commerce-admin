import { Edit } from "@mui/icons-material";
import {
  Backdrop,
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { collection, getDoc, getDocs, doc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import ManageOrder from "./ManageOrder";

function Orders() {
  const [orderedItems, setOrderedItems] = useState([]);
  const [orderedProducts, setOrderedProducts] = useState([]);

  const [editOrder, setEditOrder] = useState(false);

  const [orderToEdit, setOrderToEdit] = useState();
  const [itemToEdit, setItemToEdit] = useState();

  const [justOpened, setJustOpened] = React.useState(true);

  useEffect(() => {
    const ordersDb = collection(db, "ORDERS");
    getDocs(ordersDb).then((snapshot) => {
      let data = [];

      snapshot.docs.forEach((document) => {
        let tempData = document.data();
        tempData["document_id"] = document.id;
        console.log(document.id);

        getDocs(collection(db, "ORDERS", document.id, "OrderItems")).then(
          (s) => {
            let productIds = [];
            s.docs.forEach((d) => {
              let obj = d.data();
              obj["product_id"] = d.id;
              productIds.push(obj);
            });
            setOrderedProducts(productIds);
          }
        );

        data.push(tempData);
      });
      setOrderedItems(data);
    });
  }, []);

  const handleClose = () => {
    setEditOrder(!editOrder);
  };

  const closeJustOpen = () => {
    setTimeout(() => setJustOpened(false), 2000);
  };
  return (
    <Box
      sx={{
        maxWidth: "full",
        bgcolor: "background.paper",
        mt: "18px",
        bgcolor: "#F2F2F2",
        height: "100vh",
      }}
    >
      {justOpened && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={justOpened}
        >
          <CircularProgress color="primary" />
          {closeJustOpen()}
        </Backdrop>
      )}
      <Box sx={{ display: "flex", cursor: "pointer" }}>
        {!editOrder && (
          <Box sx={{ display: "flex" }}>
            {orderedItems.map((product, index) => (
              <Box
                key={index}
                sx={{
                  width: "250px",
                  p: "7px",
                  boxShadow: 1,
                  m: "15px",
                  bgcolor: "white",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <img
                    src={product.product_image_1}
                    height="150px"
                    width="150px"
                  />
                </div>
                <Typography sx={{ p: "2px" }} variant="subtitle2">
                  {product.product_title}
                </Typography>

                <Typography sx={{ p: "2px" }} variant="subtitle2">
                  {"Price: " + product.product_price}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    onClick={() => {
                      handleClose();
                      setOrderToEdit(orderedProducts[index]);
                      setItemToEdit(orderedItems[index]);
                    }}
                  >
                    Open Order
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {editOrder && (
          <ManageOrder
            handleClose={handleClose}
            product={orderToEdit}
            orderedItems={itemToEdit}
          />
        )}
      </Box>
    </Box>
  );
}

export default Orders;
