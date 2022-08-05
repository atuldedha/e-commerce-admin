import { Backdrop, CircularProgress, Container } from "@mui/material";
import {
  Add,
  Cancel,
  CancelOutlined,
  Delete,
  Done,
  Edit,
} from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { addDoc, collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useState } from "react";
import { db, storage } from "../firebase";

const AddProduct = ({
  handleClose,
  product,
  showCouponsField,
  showSpecsField,
  rowsTitle,
  rowsData,
  initialImages,
}) => {
  const [initialProduct, setInitialProduct] = useState(product);

  const [images, setImages] = useState(initialImages);

  const [productTitle, setProductTitle] = useState(
    initialProduct.product_title
  );

  const [productPrice, setProductPrice] = useState(
    initialProduct.product_price
  );

  const [productCuttedPrice, setProductCuttedPrice] = useState(
    initialProduct.product_cuttedPrice
  );

  const [noOfCoupons, setNumberOfCoupons] = useState(
    initialProduct.freeCoupons
  );

  const [couponTitle, setCouponTitle] = useState(
    initialProduct.freeCouponTitle
  );

  const [validity, setValidity] = useState(initialProduct.validity);
  const [couponBody, setCouponBody] = useState(initialProduct.freeCouponBody);
  const [upperLimit, setUpperLimit] = useState(initialProduct.upper_limit);
  const [lowerLimit, setLowerLimit] = useState(initialProduct.lower_limit);
  const [percentage, setPercentage] = useState(initialProduct.percentage);
  const [maxQuantity, setMaxQuantity] = useState(initialProduct.max_quantity);
  const [offerApplicable, setOfferApplicable] = useState(
    initialProduct.offers_applied
  );
  const [description, setDescription] = useState(
    initialProduct.product_description
  );
  const [otherDetails, setOtherDetails] = useState(
    initialProduct.product_other_details
  );
  const [tags, setTags] = useState(initialProduct.tags);
  const [stockQuantity, setStockQuantity] = useState(
    initialProduct.stock_quantity
  );

  const [productTitleError, setProductTitleError] = useState(false);
  const [productPriceError, setProductPriceError] = useState(false);
  const [noOfCouponsError, setNumberOfCouponsError] = useState(false);
  const [couponTitleError, setCouponTitleError] = useState(false);
  const [validityError, setValidityError] = useState(false);
  const [couponBodyError, setCouponBodyError] = useState(false);
  const [upperLimitError, setUpperLimitError] = useState(false);
  const [lowerLimitError, setLowerLimitError] = useState(false);
  const [percentageError, setPercentageError] = useState(false);
  const [maxQuantityError, setMaxQuantityError] = useState(false);
  const [offerApplicableError, setOfferApplicableError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [tagsError, setTagsError] = useState(false);
  const [stockQuantityError, setStockQuantityError] = useState(false);

  const [showCoupon, setShowCoupon] = useState(showCouponsField);
  const [showSpecs, setShowSpecs] = useState(showSpecsField);
  const [cod, setCod] = useState(initialProduct.COD);

  const [whichOffer, setWhichOffer] = useState(initialProduct.type);

  const [key, setKey] = useState("");
  const [value, setValue] = useState("");

  const [adding, setAdding] = useState(false);

  const [disableAdd, setDisableAdd] = useState(false);
  const [disableEdit, setDisableEdit] = useState(false);

  const [edit, setEdit] = useState([]);

  let r = [];

  rowsTitle.map((title) => {
    let data = {
      key: title.key,
      value: title.value,
    };
    r.push(data);
  });

  rowsData.map((ele) => {
    let data = {
      key: ele.key,
      value: ele.value,
    };
    r.push(data);
  });

  const [rows, setRows] = useState(r);

  const [loading, setLoading] = useState(false);

  const saveData = () => {
    let data = {
      key: key,
      value: value,
    };

    setRows([...rows, data]);

    setEdit([...edit, 0]);

    console.log(edit);

    setValue("");
    setKey("");
    setAdding(false);
    setDisableAdd(false);
    setDisableEdit(false);
  };

  const saveChanges = (pos) => {
    let data = {
      key: key,
      value: value,
    };

    setRows((existingItems) => {
      return existingItems.map((item, j) => {
        return j === pos ? data : item;
      });
    });

    setEdit((existingItems) => {
      return existingItems.map((item, j) => {
        return j === pos ? 0 : item;
      });
    });
  };

  const setEditData = (key, value) => {
    setKey(key);
    setValue(value);
  };

  const deleteSpec = (pos) => {
    setRows((existingItems) => {
      return existingItems.filter((item, j) => {
        return j !== pos;
      });
    });

    setEdit((existingItems) => {
      return existingItems.map((item, j) => {
        return j === pos ? 0 : item;
      });
    });
  };

  const publishProduct = () => {
    if (images.length == 0 && images.length > 8) {
      return;
    }

    if (productTitle.length < 1) {
      setProductTitleError(true);
      return;
    }

    if (productPrice.length < 1) {
      setProductPriceError(true);
      return;
    }

    if (tags.length < 1) {
      setTagsError(true);
      return;
    }

    if (description.length < 1) {
      setDescriptionError(true);
      return;
    }

    if (showCoupon && offerApplicable <= 0) {
      setOfferApplicableError(true);
      return;
    }

    if (showCoupon && noOfCoupons == 0) {
      setNumberOfCouponsError(true);
      return;
    }

    if (showCoupon && couponTitle.length < 1) {
      setCouponTitleError(true);
      return;
    }

    if (showCoupon && validity == 0) {
      setValidityError(true);
      return;
    }

    if (showCoupon && couponBody.length < 1) {
      setCouponBodyError(true);
      return;
    }

    if (showCoupon && upperLimit == 0) {
      setUpperLimitError(true);
      return;
    }

    if (showCoupon && lowerLimit == 0) {
      setLowerLimitError(true);
      return;
    }

    if (showCoupon && percentage == 0) {
      setPercentageError(true);
      return;
    }

    if (maxQuantity <= 0) {
      setMaxQuantityError(true);
      return;
    }

    if (showSpecs && rows.length < 1) {
      alert("Add at least one Specification!");
      return;
    }

    if (stockQuantity <= 0) {
      setStockQuantityError(true);
      return;
    }

    setLoading(true);

    let index = 0;
    let urls = [];

    uploadImages(index, urls, () => {
      let data = {
        product_price: productPrice.toString(),
        product_cuttedPrice: productCuttedPrice.toString(),
        product_title: productTitle,
        no_of_images: urls.length,
        max_quantity: parseInt(maxQuantity),
        COD: cod,
        freeCouponTitle: couponTitle,
        freeCouponBody: couponBody,
        freeCoupons: parseInt(noOfCoupons),
        created_at: Timestamp.fromDate(new Date()),
        product_description: description,
        product_other_details: otherDetails,
        offers_applied: parseInt(offerApplicable),
        stock_quantity: parseInt(stockQuantity),
        use_tab_layout: showSpecs,
        lower_limit: parseInt(lowerLimit),
        upper_limit: parseInt(upperLimit),
        type: whichOffer,
        validity: parseInt(validity),
        tags: tags.split(","),
      };

      if (whichOffer == "Percentage") {
        data["percentage"] = parseInt(percentage);
      } else if (whichOffer == "Discount") {
        data["discount"] = parseInt(percentage);
      }

      if (showSpecs) {
        let sectionCount = 0;
        let index = 0;

        rows.forEach((row) => {
          if (row.key == "title") {
            if (sectionCount > 0) {
              data["spec_title_" + sectionCount + "_total_fields"] = index;
            }
            index = 0;
            sectionCount++;
            data["spec_title_" + sectionCount] = row.value;
          } else {
            index++;
            data["spec_title_" + sectionCount + "_field_" + index + "_name"] =
              row.key;
            data["spec_title_" + sectionCount + "_field_" + index + "_value"] =
              row.value;
          }
        });

        data["total_spec_titles"] = sectionCount;
      }

      for (let i = 0; i < urls.length; i++) {
        data["product_image_" + (i + 1)] = urls[i];
      }

      const newDocRef = doc(collection(db, "Products"));

      setDoc(newDocRef, data)
        .then((doc) => {
          console.log(newDocRef.id);
          for (let i = 0; i < parseInt(stockQuantity); i++) {
            let d = {
              time: Timestamp.fromDate(new Date()),
            };
            addDoc(collection(db, "Products", newDocRef.id, "Quantity"), d)
              .then(() => {
                console.log("Uploaded");
                setLoading(false);
              })
              .catch((error) => {
                console.log(error);
                setLoading(false);
              });
          }
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    });
  };

  const uploadImages = (index, urls, onCompleted) => {
    let file = images[index];

    try {
      if (file.startsWith("https")) {
        urls.push(file);
        index++;

        if (index < images.length) {
          uploadImages(index, urls, onCompleted);
        } else {
          onCompleted();
        }
      }
    } catch (error) {
      var ts = String(new Date().getTime()),
        i = 0,
        out = "";

      for (i = 0; i < ts.length; i += 2) {
        out += Number(ts.substr(i, 2)).toString(36);
      }

      var fileName = "product" + out;

      let storageRef = ref(storage, "products/" + fileName + ".jpg");

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },

        (error) => {
          console.log(error);
          setLoading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);

            urls.push(downloadURL);
            index++;

            if (index < images.length) {
              uploadImages(index, urls, onCompleted);
            } else {
              onCompleted();
            }
          });
        }
      );
    }
  };

  const makeImageUrl = (image) => {
    try {
      return URL.createObjectURL(image);
    } catch (error) {
      return image;
    }
  };

  return (
    <Box boxShadow={1} p={4}>
      <div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="primary" />
        </Backdrop>
      </div>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Edit Product
        </Typography>

        <Button sx={{ border: 1, padding: "5px" }} onClick={handleClose}>
          Cancel
        </Button>
      </Box>

      <Box display="flex" flexWrap="true">
        {images.map((image, index) => (
          <Box key={index} m="10px" border={1} borderColor="#000000">
            <div style={{ textAlign: "right" }}>
              <IconButton
                onClick={(e) =>
                  setImages(images.filter((image, id) => id !== index))
                }
              >
                <Delete />
              </IconButton>
            </div>
            <img
              key={index}
              src={makeImageUrl(image)}
              style={{
                height: "90px",
                width: "160px",
                objectFit: "contain",
              }}
            />
          </Box>
        ))}
      </Box>

      <input
        hidden
        style={{ type: "hidden" }}
        accept="image/*"
        id="contained-button-file"
        multiple
        type="file"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setImages([...images, e.target.files[0]]);
          }
          console.log(images);
          e.target.value = null;
        }}
      />

      <Box sx={{ m: "5px" }}>
        {images.length < 8 ? (
          <label htmlFor="contained-button-file">
            <Button sx={{ mt: "7px" }} variant="contained" component="span">
              Upload
            </Button>
          </label>
        ) : null}
      </Box>

      <TextField
        sx={{ m: "5px" }}
        fullWidth
        value={productTitle}
        label="Title"
        size="small"
      />
      <br />

      <TextField
        sx={{ m: "5px" }}
        value={productPrice}
        onChange={(e) => setProductPrice(e.target.value)}
        error={productPriceError}
        label="Price"
        size="small"
        type="number"
      />
      <TextField
        sx={{ m: "5px" }}
        label="Cutted Price"
        value={productCuttedPrice}
        onChange={(e) => setProductCuttedPrice(e.target.value)}
        size="small"
        type="number"
      />

      <br />
      <TextField
        sx={{ m: "5px" }}
        label="No of Coupons"
        value={noOfCoupons}
        size="small"
        type="number"
      />

      <br />

      {showCoupon && (
        <Box border={1} p={4} borderRadius={8}>
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">
              Coupon Type
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              value={whichOffer}
              name="radio-buttons-group"
            >
              <FormControlLabel
                value="Percentage"
                control={<Radio />}
                label="Discount"
              />

              <FormControlLabel
                value="Amount"
                control={<Radio />}
                label="Flat. *RS OFF"
              />
            </RadioGroup>
          </FormControl>
          <br />

          <TextField
            sx={{ m: "5px" }}
            label="Coupon Title"
            value={couponTitle}
            size="small"
            type="text"
          />

          <TextField
            sx={{ m: "5px" }}
            label="Valid for Days"
            value={validity}
            error={validityError}
            onChange={(e) => setValidity(e.target.value)}
            size="small"
            type="number"
          />
          <br />

          <TextField
            sx={{ m: "5px" }}
            label="Coupom Body"
            value={couponBody}
            error={couponBodyError}
            onChange={(e) => setCouponBody(e.target.value)}
            multiline
            rows={5}
            type="text"
          />
          <br />

          <TextField
            sx={{ m: "5px" }}
            label="Upper Limit"
            value={upperLimit}
            error={upperLimitError}
            onChange={(e) => setUpperLimit(e.target.value)}
            size="small"
            type="number"
          />
          <TextField
            sx={{ m: "5px" }}
            label="Lower Limit"
            value={lowerLimit}
            error={lowerLimitError}
            onChange={(e) => setLowerLimit(e.target.value)}
            size="small"
            type="number"
          />
          <TextField
            sx={{ m: "5px" }}
            label={whichOffer}
            value={percentage}
            error={percentageError}
            onChange={(e) => setPercentage(e.target.value)}
            size="small"
            type="number"
          />
        </Box>
      )}
      <br />
      <TextField
        sx={{ m: "5px" }}
        label="Max Quantity"
        value={maxQuantity}
        error={maxQuantityError}
        onChange={(e) => setMaxQuantity(e.target.value)}
        size="small"
        type="number"
      />
      <TextField
        sx={{ m: "5px" }}
        label="Offers Applicalble"
        value={offerApplicable}
        size="small"
        type="number"
      />
      <br />

      <TextField
        sx={{ m: "5px" }}
        fullWidth
        label="Description"
        value={description}
        error={descriptionError}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        rows={5}
        type="text"
      />

      <br />

      <FormControlLabel
        control={
          <Switch
            checked={showSpecs}
            onChange={(e) => setShowSpecs(!showSpecs)}
          />
        }
        label="Use Tab Layout"
      />

      {showSpecs && (
        <>
          <TableContainer component={Paper}>
            <div style={{ textAlign: "right" }}>
              <IconButton
                onClick={() => {
                  setKey("");
                  setValue("");
                  setAdding(!adding);
                  setDisableEdit(true);
                }}
              >
                <Add />
              </IconButton>
            </div>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              {rows.length < 1 && <caption>No Data to Show</caption>}
              <TableHead>
                <TableRow>
                  <TableCell>Key</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length > 0 &&
                  rows.map((row, index) => (
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>
                        {edit[index] === 1 ? (
                          <TextField
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            size="small"
                            placeholder="Enter Key"
                            type="text"
                          />
                        ) : (
                          row.key
                        )}
                      </TableCell>
                      <TableCell>
                        {edit[index] === 1 ? (
                          <TextField
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            size="small"
                            placeholder="Enter Value"
                            type="text"
                          />
                        ) : (
                          row.value
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {edit[index] === 0 ? (
                          <>
                            <IconButton
                              disabled={disableEdit}
                              onClick={() => {
                                if (edit[index] === 0 || edit[index] === 1) {
                                  setEdit((existingItems) => {
                                    return existingItems.map((item, j) => {
                                      return j === index
                                        ? edit[j] === 0
                                          ? 1
                                          : 0
                                        : 0;
                                    });
                                  });
                                } else {
                                  setEdit((prevState) => [...prevState, 0]);
                                }
                                setEditData(row.key, row.value);
                                setDisableAdd(true);
                              }}
                            >
                              <Edit />
                            </IconButton>

                            <IconButton
                              onClick={() => {
                                deleteSpec(index);
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </>
                        ) : (
                          <>
                            <IconButton
                              onClick={() => {
                                setEdit((existingItems) => {
                                  return existingItems.map((item, j) => {
                                    return j === index ? 0 : item;
                                  });
                                });
                                setDisableAdd(false);
                              }}
                            >
                              <Cancel />
                            </IconButton>

                            <IconButton onClick={() => saveChanges(index)}>
                              <Done />
                            </IconButton>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          {adding && (
            <Container
              style={{
                maxWidth: "800px",
                mx: "auto",
                p: "10px",
                mt: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <TextField
                value={key}
                onChange={(e) => setKey(e.target.value)}
                size="small"
                placeholder="Enter Key"
                type="text"
              />
              <TextField
                value={value}
                onChange={(e) => setValue(e.target.value)}
                size="small"
                placeholder="Enter Value"
                type="text"
              />

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  onClick={saveData}
                  sx={{ mt: "7px" }}
                  variant="contained"
                  component="span"
                >
                  <Done />
                </IconButton>

                <IconButton
                  onClick={() => {
                    setAdding(false);
                    setKey("");
                    setValue("");
                    setDisableEdit(false);
                  }}
                  sx={{ mt: "7px" }}
                  variant="contained"
                  component="span"
                >
                  <Cancel />
                </IconButton>
              </Box>
            </Container>
          )}
        </>
      )}
      <br />
      <TextField
        sx={{ m: "5px" }}
        fullWidth
        value={otherDetails}
        onChange={(e) => setOtherDetails(e.target.value)}
        label="Other Details"
        multiline
        rows={5}
        type="text"
      />
      <br />

      <TextField
        sx={{ m: "5px" }}
        value={stockQuantity}
        onChange={(e) => setStockQuantity(e.target.value)}
        label="Stock Quantity"
        error={stockQuantityError}
        required
        type="number"
      />

      <br />

      <FormGroup>
        <FormControlLabel
          control={<Switch checked={cod} onChange={() => setCod(!cod)} />}
          label="COD"
        />
      </FormGroup>

      <br />

      <TextField
        sx={{ m: "5px" }}
        fullWidth
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        error={tagsError}
        label="Tags"
        size="small"
        type="text"
      />
      <br />

      <Button
        sx={{ mt: "7px" }}
        fullWidth
        variant="contained"
        component="span"
        onClick={publishProduct}
      >
        Publish Product
      </Button>
    </Box>
  );
};

export default AddProduct;
