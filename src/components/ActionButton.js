import * as React from "react";
import AddIcon from "@mui/icons-material/Add";
import {
  Backdrop,
  Box,
  Checkbox,
  CircularProgress,
  Fab,
  FormControl,
  FormControlLabel,
  Input,
  InputLabel,
  MenuItem,
  NativeSelect,
  Select,
  Snackbar,
  TextField,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import ProductView from "./ProductView";
import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Delete } from "@mui/icons-material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ActionButton = ({ categoryName, changeinData, open, handleClose }) => {
  const [position, setPosition] = React.useState(0);

  const [images, setImages] = React.useState([]);
  const [background, setBackground] = React.useState([]);

  // const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(0);

  const [title, setTitle] = React.useState("");
  const [layoutBackground, setLayoutBackground] = React.useState("");

  const [latestProducts, setLatestProducts] = React.useState();

  const [searchText, setSearchText] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);

  const [selectedProducts, setSelectedProducts] = React.useState([]);

  const [positionError, setPositionError] = React.useState(false);
  const [titleError, setTitleError] = React.useState(false);

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  const [message, setMessage] = React.useState("");

  const [loading, setLoading] = React.useState(false);

  const findWidth = () => {
    console.log(selected);
    if (selected == 0) {
      return "160px";
    } else if (selected == 1) {
      return "210px";
    } else {
      return 0;
    }
  };

  const loadLatestProducts = () => {
    const q = query(
      collection(db, "Products"),
      orderBy("created_at", "desc"),
      limit(8)
    );

    getDocs(q).then((snapshot) => {
      let productList = [];
      if (!snapshot.empty) {
        snapshot.docs.forEach((doc) => {
          let data = {
            id: doc.id,
            image: doc.data().product_image_1,
            title: doc.data().product_title,
            price: doc.data().product_price,
          };

          console.log(data);
          productList.push(data);
        });
      }

      setLatestProducts(productList);
    });
  };

  const searchItem = () => {
    setIsSearching(true);

    if (!searchText) {
      loadLatestProducts();
      setIsSearching(false);
      return;
    }

    let keywords = searchText.split(" ");
    const q = query(
      collection(db, "Products"),
      where("tags", "array-contains-any", keywords)
    );

    getDocs(q).then((snapshot) => {
      let productList = [];
      if (!snapshot.empty) {
        snapshot.docs.forEach((doc) => {
          let data = {
            id: doc.id,
            image: doc.data().product_image_1,
            title: doc.data().product_title,
            price: doc.data().product_price,
          };

          console.log(data);
          productList.push(data);
        });
      }

      setLatestProducts(productList);
      setIsSearching(false);
    });
  };

  const saveData = (e) => {
    if (!position) {
      setPositionError(true);
      return;
    }

    setLoading(true);

    if (selected == 0) {
      if (images.length < 3) {
        setSnackbarOpen(true);
        setMessage("Images Should be 3 or more");
        setLoading(false);
        return;
      }

      let index = 0;
      let urls = [];

      uploadImages(index, urls, () => {
        console.log(urls);

        let data = {
          viewType: 0,
          index: parseInt(position),
          no_of_banner: urls.length,
        };

        for (var i = 0; i < urls.length; i++) {
          data["banner_" + (i + 1)] = urls[i];
          data["banner_" + (i + 1) + "_background"] = background[i];
        }

        uploadData(data);
      });
    }

    if (selected == 1) {
      if (images.length < 1) {
        setSnackbarOpen(true);
        setMessage("Image Required!");
        setLoading(false);
        return;
      }

      let index = 0;
      let urls = [];

      uploadImages(index, urls, () => {
        console.log(urls);

        let data = {
          viewType: 1,
          index: parseInt(position),
          background: background[0],
          strip_ad_banner: urls[0],
        };

        uploadData(data);
      });
    }

    if (selected == 2) {
      if (title === "") {
        setTitleError(true);
        setLoading(false);
        return;
      }

      if (selectedProducts.length < 1) {
        setSnackbarOpen(true);
        setMessage("Select At least One Image");
        setLoading(false);
        return;
      }

      let data = {
        viewType: 2,
        index: parseInt(position),
        layoutBackground: layoutBackground,
        layoutTitle: title,
        products: selectedProducts,
      };

      uploadData(data);
    }

    if (selected == 3) {
      if (title === "") {
        setTitleError(true);
        setLoading(false);
        return;
      }

      if (selectedProducts.length < 4) {
        setSnackbarOpen(true);
        setMessage("Select At least Four Image");
        setLoading(false);
        return;
      }

      let data = {
        viewType: 3,
        index: parseInt(position),
        layoutBackground: layoutBackground,
        layoutTitle: title,
        products: selectedProducts,
      };

      uploadData(data);
    }
  };

  const uploadData = (data) => {
    const docref = doc(collection(db, "Categories", categoryName, "TOP_DEALS"));

    setDoc(docref, data)
      .then(() => {
        setLoading(false);
        console.log("success");

        changeinData();

        setPosition(0);
        setImages([]);
        setBackground([]);

        setSelectedProducts([]);
        setTitle("");
        setLayoutBackground("");
        handleClose();
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const closeSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  const uploadImages = (index, urls, onCompleted) => {
    let file = images[index];

    var ts = String(new Date().getTime()),
      i = 0,
      out = "";

    for (i = 0; i < ts.length; i += 2) {
      out += Number(ts.substr(i, 2)).toString(36);
    }

    var fileName = "banner" + out;

    let storageRef = ref(storage, "banners/" + fileName + ".jpg");

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

      (error) => {},
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
  };

  return (
    <>
      <div>
        <Dialog
          fullScreen
          open={open}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          {loading && (
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={loading}
            >
              <CircularProgress color="primary" />
            </Backdrop>
          )}
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Add Product
              </Typography>
              <Button autoFocus color="inherit" onClick={saveData}>
                Save
              </Button>
            </Toolbar>
          </AppBar>
          <FormControl sx={{ m: "15px", maxWidth: "250px" }}>
            <InputLabel id="screen-select-label">View Type</InputLabel>
            <NativeSelect
              sx={{ m: "5px" }}
              id="simple-select"
              defaultValue={selected}
              label="Screen Type"
              onChange={(e) => (
                setSelected(e.target.value), setImages([]), setBackground([])
              )}
            >
              <option value={0}>Banner Slider</option>
              <option value={1}>Strip Ad</option>
              <option value={2}>Horizontal View</option>
              <option value={3}>Grid View</option>
            </NativeSelect>

            <TextField
              sx={{ m: "5px" }}
              label="Position"
              id="outlined-size-small"
              size="small"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              error={positionError}
              helperText="Required!!"
              type="number"
            />
          </FormControl>

          <Box display="flex" flexWrap="true">
            {images.map((image, index) => (
              <Box
                key={index}
                m="10px"
                border={1}
                borderColor="#000000"
                backgroundColor={background[index]}
              >
                <div style={{ textAlign: "right" }}>
                  <IconButton
                    onClick={(e) => (
                      setImages(images.filter((image, id) => id !== index)),
                      setBackground(
                        background.filter((item, id) => id !== index)
                      )
                    )}
                  >
                    <Delete />
                  </IconButton>
                </div>
                <img
                  key={index}
                  src={URL.createObjectURL(image)}
                  style={{
                    height: "90px",
                    width: findWidth(),
                    objectFit: "contain",
                  }}
                />

                <input
                  id={"image-background-" + index}
                  type="color"
                  hidden
                  onChange={(e) => {
                    let color = e.target.value;
                    if (background[index]) {
                      setBackground((existingItems) => {
                        return existingItems.map((item, j) => {
                          return j === index ? color : item;
                        });
                      });
                    } else {
                      setBackground((prevState) => [...prevState, color]);
                    }
                  }}
                />
                <label htmlFor={"image-background-" + index}>
                  <div style={{ textAlign: "center" }}>
                    <IconButton
                      color="secondary"
                      variant="contained"
                      component="span"
                    >
                      <FormatColorFillIcon />
                    </IconButton>
                  </div>
                </label>
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
                setBackground([...background, "#ffffff"]);
              }
              console.log(images);
              console.log(background);
              e.target.value = null;
            }}
          />

          <Box sx={{ m: "5px" }}>
            {selected == 0 && images.length < 8 ? (
              <label htmlFor="contained-button-file">
                <Button sx={{ mt: "7px" }} variant="contained" component="span">
                  Upload
                </Button>
              </label>
            ) : null}

            {selected == 1 && images.length < 1 ? (
              <label htmlFor="contained-button-file">
                <Box sx={{ alignItems: "center" }}>
                  <Button variant="contained" component="span">
                    Upload
                  </Button>
                </Box>
              </label>
            ) : null}
          </Box>

          {(selected == 2 || selected == 3) && (
            <div>
              <Box sx={{ m: "5px", textAlign: "center" }}>
                <TextField
                  sx={{ backgroundColor: layoutBackground }}
                  id="filled-basic"
                  label="Set Title"
                  variant="filled"
                  value={title}
                  error={titleError}
                  helperText="Required!!"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Box>

              <input
                id={"layout-background"}
                type="color"
                defaultValue="#ffffff"
                hidden
                onChange={(e) => {
                  setLayoutBackground(e.target.value);
                }}
              />

              <label htmlFor={"layout-background"}>
                <div style={{ textAlign: "center" }}>
                  <Button
                    size="small"
                    color="secondary"
                    variant="contained"
                    component="span"
                  >
                    Layout Background
                  </Button>
                </div>
              </label>

              <h4>Select Product: {selectedProducts.length}</h4>
              <Box sx={{ display: "flex", width: "100%" }}>
                <TextField
                  sx={{ m: "5px", flexGrow: 1 }}
                  id="outlined-basic"
                  label="Serch"
                  variant="outlined"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <Button variant="contained" onClick={searchItem}>
                  Search
                </Button>
              </Box>
              {isSearching ? (
                <CircularProgress />
              ) : (
                <Box display="flex" flexWrap={true}>
                  {latestProducts
                    ? latestProducts.map((product, index) => (
                        <FormControlLabel
                          sx={{
                            backgroundColor: "#00000010",
                            borderRadius: "10%",
                            p: "10px",
                          }}
                          key={index}
                          control={
                            <Checkbox
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedProducts([
                                    ...selectedProducts,
                                    product.id,
                                  ]);
                                } else {
                                  let i = selectedProducts.indexOf(product.id);
                                  setSelectedProducts(
                                    selectedProducts.filter(
                                      (item, index) => index !== i
                                    )
                                  );
                                }
                                console.log(selectedProducts);
                              }}
                            />
                          }
                          label={<ProductView product={product} />}
                          labelPlacement="bottom"
                        />
                      ))
                    : loadLatestProducts()}
                </Box>
              )}
            </div>
          )}
        </Dialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={closeSnackbar}
          message={message}
        />
      </div>
    </>
  );
};

export default ActionButton;
