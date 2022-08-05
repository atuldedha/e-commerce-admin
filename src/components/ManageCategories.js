import * as React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import {
  Avatar,
  Backdrop,
  Button,
  CircularProgress,
  Container,
  TableHead,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import { useSelector } from "react-redux";
import { selectCategories } from "../features/categories/categoriesSlice";
import { Add, Delete } from "@mui/icons-material";
import {
  Cancel,
  DisabledByDefaultRounded,
  Done,
  Edit,
  Save,
} from "@mui/icons-material";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { db, storage } from "../firebase";
import { collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { positions } from "@mui/system";

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export default function ManageCategories() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const allCategories = useSelector(selectCategories);
  const categories = Object.values(allCategories);

  const [adding, setAdding] = React.useState(false);
  const [disableAdd, setDisableAdd] = React.useState(false);

  const [rows, setRows] = React.useState(categories[0]);

  const [name, setName] = React.useState("");
  const [position, setPosition] = React.useState(0);
  const [image, setImage] = React.useState();

  const [edit, setEdit] = React.useState(Array(rows.length).fill(0));
  const [disableEdit, setDiableEdit] = React.useState(false);

  const [loading, setLoading] = React.useState(false);
  const [justOpened, setJustOpened] = React.useState(true);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setEdit(edit.fill(0));
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setEdit(edit.fill(0));
  };
  const makeImageUrl = (image) => {
    try {
      return URL.createObjectURL(image);
    } catch (error) {
      return image;
    }
  };

  const saveData = () => {
    if (name && position && image) {
      setLoading(true);
      uploadImage((url) => {
        setLoading(true);
        let data = {
          categoryName: name,
          index: parseInt(position),
          icon: url,
        };

        setDoc(doc(db, "Categories", name.toUpperCase()), data).then(() => {
          console.log(data);
          console.log("success");
          setLoading(false);
        });

        setRows([...rows, data]);
      });
      console.log(rows);
      setName("");
      setPosition(0);
      setImage("");
      setAdding(false);
      setDiableEdit(false);
    } else {
      alert("Fill Details Properly");
    }
  };

  const uploadImage = (onCompleted) => {
    let file = image;

    var ts = String(new Date().getTime()),
      i = 0,
      out = "";

    for (i = 0; i < ts.length; i += 2) {
      out += Number(ts.substr(i, 2)).toString(36);
    }

    var fileName = "category" + out;

    let storageRef = ref(storage, "categories/" + fileName + ".jpg");

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
          onCompleted(downloadURL);
        });
      }
    );
  };

  const setEditData = (categoryName, index, icon) => {
    setPosition(index);
    setImage(icon);
    setName(categoryName);

    console.log(position, name, image);
  };

  const saveChanges = (categoryName, index, icon, pos) => {
    setLoading(true);
    console.log(index, icon);
    console.log(rows[pos].index);

    if (index === position && icon === image) {
      setEdit((existingItems) => {
        return existingItems.map((item, j) => {
          return j === pos ? 0 : item;
        });
      });

      setLoading(false);
      setDisableAdd(false);
    } else if (index !== position && icon === image) {
      let data = {
        index: position,
        categoryName: categoryName,
        icon: icon,
      };

      setDoc(doc(db, "Categories", categoryName.toUpperCase()), data).then(
        () => {
          setRows((existingItems) => {
            return existingItems.map((item, j) => {
              return item.categoryName === categoryName ? data : item;
            });
          });
          setLoading(false);
        }
      );
      setEdit((existingItems) => {
        return existingItems.map((item, j) => {
          return j === pos ? 0 : item;
        });
      });

      setDisableAdd(false);
    } else {
      uploadImage((url) => {
        let data = {
          index: position,
          categoryName: categoryName,
          icon: url,
        };

        deleteImage(icon, () => {
          setDoc(doc(db, "Categories", categoryName.toUpperCase()), data).then(
            () => {
              setLoading(false);
            }
          );
        });

        setRows((existingItems) => {
          return existingItems.map((item, j) => {
            return item.categoryName === categoryName ? data : item;
          });
        });
      });

      setEdit((existingItems) => {
        return existingItems.map((item, j) => {
          return j === pos ? 0 : item;
        });
      });

      setDisableAdd(false);
    }
  };

  const deleteImage = (image, onCompleted) => {
    var splittedLink = image.split("/");
    let name = splittedLink[splittedLink.length - 1]
      .split("?")[0]
      .replace("categories%2F", "");

    console.log(name);

    let storageRef = ref(storage, "categories/" + name);

    deleteObject(storageRef)
      .then(() => {
        onCompleted();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteCategory = (categoryName, index, icon, pos) => {
    setLoading(true);

    deleteImage(icon, () => {
      const docRef = doc(db, "Categories", categoryName.toUpperCase());

      deleteDoc(docRef)
        .then(() => {
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });

      setRows((existingItems) => {
        return existingItems.filter((item, j) => {
          return item.categoryName !== categoryName;
        });
      });
    });
  };

  const closeJustOpen = () => {
    setTimeout(() => setJustOpened(false), 2000);
  };

  return (
    <Container sx={{ height: "100vh", bgcolor: "#F2F2F2" }}>
      {(loading || justOpened) && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading || justOpened}
        >
          <CircularProgress color="primary" />
          {closeJustOpen()}
        </Backdrop>
      )}
      <TableContainer
        component={Paper}
        sx={{ mx: "auto", maxWidth: "800px", mt: "12px" }}
      >
        <div style={{ textAlign: "right" }}>
          <IconButton
            disabled={disableAdd}
            onClick={() => {
              setImage("");
              setPosition(0);
              setName("");
              setAdding(!adding);
              setDiableEdit(true);
            }}
          >
            <Add />
          </IconButton>
        </div>
        <Table
          sx={{ minWidth: 500, m: "20px" }}
          aria-label="custom pagination table"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell>Category</StyledTableCell>
              <StyledTableCell>Index</StyledTableCell>
              <StyledTableCell>Icon</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : rows
            ).map((row, index) => (
              <TableRow key={row.categoryName}>
                <TableCell style={{ width: 160 }}>
                  {edit[index] === 1 ? (
                    <TextField value={name} size="small" type="text" />
                  ) : (
                    row.categoryName
                  )}
                </TableCell>
                <TableCell style={{ width: 160 }}>
                  {edit[index] === 1 ? (
                    <TextField
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      size="small"
                      type="number"
                    />
                  ) : (
                    row.index
                  )}
                </TableCell>
                <TableCell style={{ width: 160 }}>
                  {edit[index] === 1 ? (
                    <>
                      <input
                        hidden
                        style={{ type: "hidden" }}
                        accept="image/*"
                        id="contained-button-file"
                        multiple
                        type="file"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setImage(e.target.files[0]);
                          }
                          console.log(image);
                          e.target.value = null;
                        }}
                      />
                      <label htmlFor="contained-button-file">
                        {image ? (
                          <>
                            <Avatar
                              src={makeImageUrl(image)}
                              variant="square"
                            />
                            <Button
                              sx={{ mt: "7px" }}
                              variant="contained"
                              component="span"
                            >
                              Change
                            </Button>
                          </>
                        ) : (
                          <Button
                            sx={{ mt: "7px" }}
                            variant="contained"
                            component="span"
                          >
                            Upload
                          </Button>
                        )}
                      </label>
                    </>
                  ) : (
                    <Avatar src={row.icon} variant="square" />
                  )}
                </TableCell>
                <TableCell component="th" scope="row">
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

                          setEditData(row.categoryName, row.index, row.icon);
                          setDisableAdd(true);
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          deleteCategory(
                            row.categoryName,
                            row.index,
                            row.icon,
                            index
                          );
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

                      <IconButton
                        onClick={() =>
                          saveChanges(
                            row.categoryName,
                            row.index,
                            row.icon,
                            index
                          )
                        }
                      >
                        <Done />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}

            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={3}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    "aria-label": "rows per page",
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="small"
            placeholder="Enter Category Name"
            type="text"
          />
          <TextField
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            size="small"
            placeholder="Enter Index Name"
            type="number"
          />

          <input
            hidden
            style={{ type: "hidden" }}
            accept="image/*"
            id="contained-button-file"
            multiple
            type="file"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImage(e.target.files[0]);
              }
              console.log(image);
              e.target.value = null;
            }}
          />

          <label htmlFor="contained-button-file">
            {image ? (
              <Avatar src={URL.createObjectURL(image)} variant="square" />
            ) : (
              <Button sx={{ mt: "7px" }} variant="contained" component="span">
                Upload
              </Button>
            )}
          </label>

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
                setName("");
                setImage("");
                setPosition(0);
                setDiableEdit(false);
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
    </Container>
  );
}
