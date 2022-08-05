import React, { useEffect, useState } from "react";
import { Box } from "@mui/system";
import {
  Backdrop,
  CircularProgress,
  Fab,
  IconButton,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddProduct from "./AddProduct";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Delete, Edit } from "@mui/icons-material";
import EditProduct from "./EditProduct";

const ManageProduct = () => {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(false);

  const [products, setProducts] = useState([]);

  const [productToEdit, setProductToEdit] = useState({});

  const [showSpecs, setShowSpecs] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);
  const [rowsTitle, setRowsTitle] = useState([]);
  const [rowsData, setRowsData] = useState([]);
  const [images, setImages] = useState([]);
  let rows = [];

  const [justOpened, setJustOpened] = React.useState(true);

  const [deleteLoding, setDeleteLoading] = React.useState(false);
  const [changeInProduct, setChangeInProduct] = React.useState(false);

  const handleAdd = () => {
    setAdding(!adding);
    setChangeInProduct(false);
  };

  const handleClose = () => {
    setAdding(!adding);
    setChangeInProduct(true);
  };

  const handleEdit = () => {
    setEditing(!editing);
    setRowsData([]);
    setRowsTitle([]);
    setImages([]);
    rows = [];
  };

  useEffect(() => {
    getDocs(collection(db, "Products")).then((snapshot) => {
      let data = [];
      snapshot.docs.forEach((doc) => {
        let tempData = doc.data();
        tempData["id"] = doc.id;
        data.push(tempData);
      });

      setProducts(data);
    });
  }, [changeInProduct]);

  const deleteProduct = (index) => {
    console.log(products[index].id);
    setDeleteLoading(true);
    const deleteId = products[index].id;

    const docRef = doc(db, "Products", deleteId);

    deleteDoc(docRef).then(() => {
      setProducts(products.filter((product, j) => j !== index));
      setDeleteLoading(false);
    });
  };

  const setData = (initialProduct) => {
    if (initialProduct.freeCoupons > 0) {
      setShowCoupon(true);
    }

    if (initialProduct.total_spec_titles > 0) {
      setShowSpecs(true);
    }

    for (let i = 0; i < initialProduct.total_spec_titles; i++) {
      let data = {
        key: "title",
        value: initialProduct["spec_title_" + (i + 1)],
      };
      setRowsTitle([...rowsTitle, data]);

      for (
        let j = 0;
        j < initialProduct["spec_title_" + (i + 1) + "_total_fields"];
        j++
      ) {
        let data = {
          key: initialProduct[
            "spec_title_" + (j + 1) + "_field_" + (j + 1) + "_name"
          ],
          value:
            initialProduct[
              "spec_title_" + (j + 1) + "_field_" + (j + 1) + "_value"
            ],
        };
        setRowsData([...rowsData, data]);
      }
    }
    let image = [];

    for (let i = 0; i < initialProduct.no_of_images; i++) {
      let temp = initialProduct["product_image_" + (i + 1)];

      image.push(temp);
    }

    rowsTitle.map((title) => {
      let data = {
        key: title.key,
        value: title.value,
      };
      rows.push(data);
    });

    rowsData.map((ele) => {
      let data = {
        key: ele.key,
        value: ele.value,
      };
      rows.push(data);
    });

    setImages(image);

    setEditing(true);
  };

  const closeJustOpen = () => {
    setTimeout(() => setJustOpened(false), 2000);
  };

  return (
    <Box sx={{ maxWidth: "full", bgcolor: "#F2F2F2", height: "100%" }}>
      {(justOpened || deleteLoding) && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={justOpened || deleteLoding}
        >
          <CircularProgress color="primary" />
          {justOpened && closeJustOpen()}
        </Backdrop>
      )}
      {!adding && !editing && (
        <Box sx={{ display: "flex", cursor: "pointer", mt: "12px" }}>
          {products?.map((product, index) => (
            <Box
              key={product.id}
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
                <IconButton
                  onClick={() => {
                    setProductToEdit(products[index]);
                    setData(products[index]);
                  }}
                >
                  <Edit />
                </IconButton>

                <IconButton onClick={() => deleteProduct(index)}>
                  <Delete />
                </IconButton>
              </Box>
            </Box>
          ))}

          <Fab
            onClick={handleAdd}
            color="primary"
            aria-label="add"
            sx={{ position: "fixed", bottom: "50px", right: "50px" }}
          >
            <AddIcon />
          </Fab>
        </Box>
      )}

      {adding && <AddProduct handleClose={handleClose} />}
      {editing && (
        <EditProduct
          handleClose={handleEdit}
          product={productToEdit}
          showCouponsField={showCoupon}
          showSpecsField={showSpecs}
          rowsTitle={rowsTitle}
          rowsData={rowsData}
          initialImages={images}
        />
      )}
    </Box>
  );
};

export default ManageProduct;
