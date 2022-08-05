import * as React from "react";
import { useEffect } from "react";
import Box from "@mui/material/Box";
import BannerSlider from "./BannerSlider";
import HorizontalScroller from "./HorizontalScroller";
import StripAdView from "./StripAdView";
import GridView from "./GridView";
import { loadCategories } from "../features/categories/categoriesSlice";
import { useDispatch, useSelector } from "react-redux";
import { db, storage } from "../firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import LoadCategories from "./LoadCategories";
import { Backdrop, CircularProgress, Fab } from "@mui/material";
import {
  loadCategoriesPage,
  selectCategoryData,
} from "../features/categories/categoriesPageSlice";
import ActionButton from "./ActionButton";
import { deleteObject, ref } from "firebase/storage";
import AddIcon from "@mui/icons-material/Add";
import EditDialog from "./EditDialog";

const HomeFragment = () => {
  const pageData = useSelector(selectCategoryData);

  const dispatch = useDispatch();

  const loading = true;

  const [selected, setSelected] = React.useState("HOME");

  const [horizontalData, setHorizontalData] = React.useState([]);
  const [horizontalLoaded, setHorizontalLoaded] = React.useState(false);
  const [horizontalIds, setHorizontalIds] = React.useState([]);

  const [gridData, setGridData] = React.useState([]);
  const [gridLoaded, setGridLoaded] = React.useState(false);
  const [gridIds, setGridIds] = React.useState([]);

  const [changeinData, setChangeinData] = React.useState(false);

  const [open, setOpen] = React.useState(false);

  const [edit, setEdit] = React.useState(false);
  const [initialData, setInitialData] = React.useState();

  const [deleteLoding, setDeleteLoading] = React.useState(false);
  const [changeCategory, setChangeCategory] = React.useState(false);

  let productsData = [];
  let gridProductData = [];
  let loadHorizontalIds = [];
  let loadGridIds = [];

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setInitialData({});
    setEdit(false);
  };

  const handleChange = (event, newValue) => {
    setSelected(newValue.toUpperCase());
    setChangeCategory(true);

    setHorizontalLoaded(false);
    setGridLoaded(false);
  };

  useEffect(() => {
    const categoriesDb = collection(db, "Categories");
    const categoriesDbQuery = query(categoriesDb, orderBy("index"));
    getDocs(categoriesDbQuery).then((snapshot) => {
      let categories = [];

      snapshot.docs.forEach((doc) => {
        categories = [...categories, { ...doc.data() }];

        let categoryName = doc.data().categoryName.toUpperCase();

        getDocs(
          query(
            collection(db, "Categories", categoryName, "TOP_DEALS"),
            orderBy("index")
          )
        ).then((snapshot) => {
          let categoryData = [];

          snapshot.docs.forEach((doc) => {
            categoryData = [...categoryData, { ...doc.data(), id: doc.id }];
          });

          console.log(categoryData);

          dispatch(
            loadCategoriesPage({
              categoryName: categoryName,
              categoryInfo: categoryData,
            })
          );
        });
      });

      dispatch(
        loadCategories({
          categories: categories,
        })
      );
    });

    setChangeinData(false);
  }, [changeinData]);

  const onChangeInData = () => {
    setChangeinData(true);
    setHorizontalLoaded(false);
    setGridLoaded(false);
  };

  const deleteImages = (images, index, onCompleted) => {
    var splittedLink = images[index].split("/");
    let name = splittedLink[splittedLink.length - 1]
      .split("?")[0]
      .replace("banners%2F", "");

    let storageRef = ref(storage, "banners/" + name);

    deleteObject(storageRef)
      .then(() => {
        index++;
        if (index < images.length) {
          deleteImages(images, index, onCompleted);
        } else {
          onCompleted();
        }
      })
      .catch((error) => {
        console.log(error);
      });

    console.log(name);
  };

  const deleting = (item, images) => {
    deleteImages(images, 0, docDelete(item));
  };

  const docDelete = (item) => {
    const docref = doc(db, "Categories", selected, "TOP_DEALS", item.id);
    setDeleteLoading(true);

    console.log(item.id);
    deleteDoc(docref)
      .then(() => {
        setDeleteLoading(false);
        setChangeinData(true);
      })
      .catch((error) => {
        setDeleteLoading(false);
        console.log(error);
      });
  };

  const loadInitialData = (
    item,
    images,
    bgs,
    products,
    layoutTitle,
    layoutBackground
  ) => {
    setInitialData({
      id: item.id,
      index: item.index,
      images: images,
      background: bgs,
      viewType: item.viewType,
      products: products,
      layoutTitle: layoutTitle,
      layoutBackground: layoutBackground,
    });

    setEdit(true);
  };

  const closeChange = () => {
    setTimeout(() => setChangeCategory(false), 2000);
  };
  return (
    <Box sx={{ maxWidth: "full", bgcolor: "#F2F2F2" }}>
      {(deleteLoding || changeCategory) && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={deleteLoding || changeCategory}
        >
          <CircularProgress color="primary" />
          {changeCategory && closeChange()}
        </Backdrop>
      )}
      <LoadCategories selected={selected} handleChange={handleChange} />

      {pageData[selected] ? (
        pageData[selected].map((item, index) => {
          switch (item.viewType) {
            case 0:
              let bannerItem = [];
              let images = [];
              let bgs = [];
              for (let i = 1; i < item.no_of_banner + 1; i++) {
                const image = item["banner_" + i];
                const background = item["banner_" + i + "_background"];
                bannerItem.push({ image, background });
                images.push(image);
                bgs.push(background);
              }
              return (
                <BannerSlider
                  onEdit={() => {
                    loadInitialData(item, images, bgs, [], "", "");
                  }}
                  onDelete={() => {
                    deleting(item, images);
                  }}
                  images={bannerItem}
                />
              );

            case 1:
              return (
                <StripAdView
                  onEdit={() => {
                    loadInitialData(
                      item,
                      [item.strip_ad_banner],
                      [item.background],
                      [],
                      "",
                      ""
                    );
                  }}
                  onDelete={() => {
                    deleting(item, [item.strip_ad_banner]);
                  }}
                  image={item.strip_ad_banner}
                  background={item.background}
                />
              );

            case 2:
              productsData = [];
              loadHorizontalIds = [];

              if (!horizontalLoaded) {
                item.products.map((id, index) => {
                  String(id);
                  let productID = id.replace(/ /g, "");

                  loadHorizontalIds.push(productID);

                  console.log(selected);
                  console.log(item.products);

                  const docref = doc(
                    db,
                    "Products",
                    productID.replace(/ /g, "")
                  );
                  getDoc(docref)
                    .then((snapshot) => {
                      if (snapshot.exists) {
                        let product = {
                          id: id,
                          title: snapshot.data()["product_title"],
                          subtitle: "",
                          image: snapshot.data()["product_image_1"],
                          price: snapshot.data()["product_price"],
                        };

                        productsData.push(product);

                        if (index == item.products.length - 1) {
                          setHorizontalLoaded(true);
                          setHorizontalData(productsData);
                          setHorizontalIds(loadHorizontalIds);
                        }
                      }
                    })
                    .catch((err) => {});
                });
              }

              return (
                <HorizontalScroller
                  onEdit={() => {
                    loadInitialData(
                      item,
                      [],
                      [],
                      horizontalIds,
                      item.layoutTitle,
                      item.layoutBackground
                    );
                  }}
                  onDelete={() => {
                    docDelete(item);
                  }}
                  products={horizontalData}
                  title={item.layoutTitle}
                  background={item.layoutBackground}
                />
              );

            case 3:
              gridProductData = [];
              loadGridIds = [];

              if (!gridLoaded) {
                item.products.forEach((id, index) => {
                  let productID = id.replace(/ /g, "");
                  loadGridIds.push(productID);

                  if (index < 4) {
                    const docref = doc(db, "Products", productID);
                    getDoc(docref)
                      .then((snapshot) => {
                        if (snapshot.exists) {
                          let product = {
                            id: id,
                            title: snapshot.data().product_title,
                            subtitle: "",
                            image: snapshot.data()["product_image_1"],
                            price: snapshot.data()["product_price"],
                          };

                          gridProductData.push(product);

                          if (index === 3) {
                            setGridLoaded(true);
                            setGridData(gridProductData);
                            setGridIds(loadGridIds);
                          }
                        }
                      })
                      .catch((err) => {});
                  }
                });
              }

              return (
                <GridView
                  onEdit={() => {
                    loadInitialData(
                      item,
                      [],
                      [],
                      gridIds,
                      item.layoutTitle,
                      item.layoutBackground
                    );
                  }}
                  onDelete={() => {
                    docDelete(item);
                  }}
                  gridProducts={gridData}
                  title={item.layoutTitle}
                  background={item.layoutBackground}
                />
              );
          }
        })
      ) : (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="primary" />
        </Backdrop>
      )}

      <Fab
        onClick={handleClickOpen}
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: "50px", right: "50px" }}
      >
        <AddIcon />
      </Fab>

      <ActionButton
        categoryName={selected}
        changeinData={onChangeInData}
        open={open}
        handleClose={handleClose}
      />

      {edit ? (
        <EditDialog
          categoryName={selected}
          changeinData={onChangeInData}
          open={edit}
          handleClose={() => setEdit(false)}
          initialData={initialData}
          deleting={deleteImages}
        />
      ) : (
        ""
      )}
    </Box>
  );
};
export default HomeFragment;
