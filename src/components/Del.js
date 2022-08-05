import React, { forwardRef, useState } from "react";

import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import MaterialTable from "material-table";

import { useSelector } from "react-redux";
import { selectCategories } from "../features/categories/categoriesSlice";
import { Button, Container } from "@mui/material";

const [productTitleError, setProductTitleError] = useState(false);
const [productPriceError, setProductPriceError] = useState(false);
const [productCuttedPriceError, setProductCuttedPriceError] = useState(false);
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
const [otherDetailsError, setOtherDetailsError] = useState(false);
const [tagsError, setTagsError] = useState("");

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

const ManageCategories = () => {
  const allCategories = useSelector(selectCategories);
  const categories = Object.values(allCategories);

  let i;

  const [image, setImage] = useState();

  const [state, setState] = useState({
    columns: [
      { title: "Category", field: "name" },

      {
        title: "Icon",
        field: "icon",
        editComponent: (props) => (
          <>
            <input
              hidden
              style={{ type: "hidden" }}
              accept="image/*"
              id="contained-button-file"
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  i = e.target.files[0];
                  console.log(i);
                  setImage(i);
                }
                console.log(image);
              }}
            />
            <label htmlFor="contained-button-file">
              {i ? (
                <img src={makeImageUrl(i)} style={{ width: 50 }} />
              ) : (
                <Button sx={{ mt: "7px" }} variant="contained" component="span">
                  Upload
                </Button>
              )}
            </label>
          </>
        ),
        render: (rowData) => <img src={rowData.icon} style={{ width: 50 }} />,
      },

      { title: "Index", field: "index", type: "numeric" },
    ],
  });

  const loadData = (item) => {
    return {
      name: "Home",
    };
    let da = {
      name: item.categoryName,
      index: item.index,
      icon: item.icon,
    };

    return da;
  };

  const makeImageUrl = (image) => {
    try {
      return URL.createObjectURL(image);
    } catch (error) {
      return image;
    }
  };

  return (
    <div style={{ maxWidth: "100%" }}>
      <Container maxWidth="md" fixed>
        <MaterialTable
          columns={state.columns}
          // data={categories[0].map((category) => loadData(category))}
          title="Add or Edit Category"
          editable={{
            onRowAdd: (newData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  /* setData([...data, newData]); */

                  resolve();
                }, 1000);
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  // const dataUpdate = [...data];
                  // const index = oldData.tableData.id;
                  // dataUpdate[index] = newData;
                  // setData([...dataUpdate]);

                  resolve();
                }, 1000);
              }),
            onRowDelete: (oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  // const dataDelete = [...data];
                  // const index = oldData.tableData.id;
                  // dataDelete.splice(index, 1);
                  // setData([...dataDelete]);

                  resolve();
                }, 1000);
              }),
          }}
        />
      </Container>
    </div>
  );
};

export default ManageCategories;
