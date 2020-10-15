import React, { memo, useState, useEffect } from "react";
import axios from "../axios";
import {
  FormControl,
  InputLabel,
  Input,
  Button,
  Select,
  MenuItem,
  FormHelperText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import "./Product.css";
import { useStateValue } from "../Context";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40%",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function Product(props) {
  const [name, setName] = useState("");
  const [products, setProducts] = useState([]);
  const [id, setId] = useState("");
  const [category, setCategory] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [{ productList, categoryList }, dispatch] = useStateValue();
  const [currentPage, setCurrentPage] = useState(1);
  const [productPerPage, setProductPerPage] = useState(10);
  const [totalProduct, setTotalProduct] = useState(0);
 
useEffect(() => {
    async function handleClick() {
      
      list();
    }
    handleClick();

},[currentPage]);

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    async function getAllProducts() {
      list();
      categoryListing();
    }
    getAllProducts();
  }, []);

  const categoryListing = async function getAllCat() {
    const allCategories = await axios.get("/category/");
    dispatch({
      type: "CATEGORY_LIST",
      categoryList: allCategories.data,
    });
  };

  const list = async function getAllProducts() {
    const allProduct = await axios.get(
      `/product/?page=${currentPage}&count=${productPerPage}`
    );
    dispatch({
      type: "PRODUCT_LIST",
      productList: allProduct.data.products,
      page: currentPage,
      productPerPage,
    });
    if(allProduct.data.products){
      setProducts(allProduct.data.products);
    }
    
    if(allProduct.data.productCount[0]){
      setTotalProduct(allProduct.data.productCount[0].count);
    }
    
  };

  const addHandler = async () => {
    setId("");
    setOpen(true);
    setName("");
  };

  const addProduct = async (e) => {
    e.preventDefault();
    const productAdd = await axios.post("/product", {
      productName: name,
      categoryId: category,
    });
    if (productAdd.data.error) return alert(productAdd.data.error.message);

    dispatch({
      type: "ADD_PRODUCT",
      product: productAdd.data,
    });

    list();
    setOpen(false);
  };

  const deleteHandler = async (e, id) => {
    const deleteProduct = await axios.delete(`/product/${id}`);
    if (deleteProduct.data.error)
      return alert(deleteProduct.data.error.message);
    dispatch({
      type: "REMOVE_PRODUCT",
      id,
    });
    list();
  };

  const updateHandler = async (e, id) => {
    e.preventDefault();
    setId(id);

    const product = await axios.get(`/product/${id}`);
    if (product.data.error) return alert(product.data.error.message);
    setName(product.data.productName);
    
    setOpen(true);
  };

  const updateProduct = async (e) => {
    e.preventDefault();

    const product = await axios.put(
      `/product/${id}?productName=${name}&categoryId=${category}`
    );
    if (product.data.error) return alert(product.data.error.message);
    setOpen(false);
    list();
  };

  const handleChange = (event) => {
    setCategory(event.target.value);
  };

  const pageNumbers = [];
  
  for (let i = 1; i <= Math.ceil(totalProduct / productPerPage); i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = pageNumbers.map((number) => {
    return (
      <a key={number}  id={number} onClick={(e) => setCurrentPage(Number(e.target.id))}>
        {number}
      </a>
    );
  });
  console.log(renderPageNumbers);
  return (
    <div className="product">
      <div className="product__add">
        <Button
          className="prd__add"
          type="submit"
          variant="contained"
          color="primary"
          onClick={(e) => addHandler(e)}
        >
          ADD PRODUCT
        </Button>
      </div>
      <table>
        <thead>
          <tr>
            <th>PRODUCT ID</th>
            <th>PRODUCT NAME</th>
            <th>CATEGORY ID</th>
            <th>CATEGORY NAME</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {productList.length > 0
            ? productList.map((product) => (
                <tr key={product.productId}>
                  <td>{product.productId}</td>
                  <td>{product.productName}</td>
                  <td>{product.categoryId}</td>
                  <td>{product.categoryName}</td>
                  <td>
                    <Button
                      className="product__update"
                      type="submit"
                      variant="contained"
                      color="primary"
                      onClick={(e) => updateHandler(e, product.productId)}
                    >
                      update
                    </Button>
                    <Button
                      className="product__delete"
                      type="submit"
                      variant="contained"
                      color="secondary"
                      onClick={(e) => deleteHandler(e, product.productId)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
      <ul id="page-numbers"></ul>
      <div id="page-numbers" class="pagination">
        {renderPageNumbers}
      </div>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <section className="product__update__section">
              <form className="product__form">
                <FormControl className="product__input">
                  <InputLabel>ProductName</InputLabel>
                  <Input
                    id="my-input"
                    aria-describedby="my-helper-text"
                    autoComplete="off"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormControl>
                <FormControl required className={classes.formControl}>
                  <InputLabel id="demo-simple-select-required-label">
                    Category
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-required-label"
                    id="demo-simple-select-required"
                    value={category}
                    onChange={handleChange}
                    className={classes.selectEmpty}
                  >
                    {categoryList.length > 0 ? (
                      categoryList.map((category) => (
                        <MenuItem  value={category.categoryId}>
                          {category.categoryName}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="">
                        <em>First add Category</em>
                      </MenuItem>
                    )}
                  </Select>
                  <FormHelperText>Required</FormHelperText>
                </FormControl>
                {!id ? (
                  <Button
                    className="product__submit"
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={(e) => addProduct(e)}
                  >
                    ADD PRODUCT
                  </Button>
                ) : (
                  <Button
                    className="product__submit"
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={(e) => updateProduct(e)}
                  >
                    UPDATE PRODUCT
                  </Button>
                )}
              </form>
            </section>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

export default Product;
