import React, {memo, useState, useEffect } from "react";
import axios from "../axios";
import {
  FormControl,
  InputLabel,
  Input,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import './Category.css';
import { useStateValue } from "../Context";


const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function Category(props) {
  const [name, setName] = useState('');
   const [categories, setCategories] = useState([]);
  const [id,setId] = useState("");
  const [{categoryList},dispatch] = useStateValue();

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  
  useEffect(() => {
      async function getAllCategories() {
          categoryListing();
      }
      getAllCategories();
  },[]);

  const categoryListing = async function getAllCat(){
    const allCategories = await axios.get('/category/');
     setCategories(allCategories.data);
    dispatch({
        type:"CATEGORY_LIST",
        categoryList:allCategories.data
    })
}

  const addHandler = async () => {
    setId("");
    setOpen(true)
    setName('');
  };

  const addCategory = async (e) => {
    e.preventDefault();
    const categoryAdd = await axios.post("/category", {
      categoryName: name,
    });
    if(categoryAdd.data.error) return alert(categoryAdd.data.error.message);
    dispatch({
        type:"ADD_CATEGORY",
        category:categoryAdd.data
    })
    categoryListing();
    setOpen(false);

  };

  const deleteHandler = async (e, id) => {
    const deleteCategory = await axios.delete(`/category/${id}`);
    if(deleteCategory.data.error) return alert(deleteCategory.data.error.message);
    dispatch({
        type:"REMOVE_CATEGORY",
        id
    })
    categoryListing();
  };

  const updateHandler = async (e, id) => {
    e.preventDefault();
    setId(id);
   
   const category = await axios.get(`/category/${id}`);
    if(category.data.error) return alert(category.data.error.message);
    setName(category.data.categoryName);
    setOpen(true)
  };

  const updateCategory = async (e) => {
    e.preventDefault();
   
    const category = await axios.put(`/category/${id}?categoryName=${name}`);
    if(category.data.error) return alert(category.data.error.message);
    setOpen(false);
    categoryListing();

  };
 
  return (
    <div className="category">
      <div className="category__add">
        <Button
          className="cat__add"
          type="submit"
          variant="contained"
          color="primary"
          onClick={(e) => addHandler(e)}
        >
          ADD CATEGORY
        </Button>
      </div>
      <table>
        <thead>
        <tr>
            <th>CATEGORY ID</th>
          <th>CATEGORY NAME</th>
          <th>ACTION</th>
        </tr>
        </thead>
        <tbody>
        {categoryList.length > 0 ? categoryList.map((category) => (
          <tr key={category.categoryId}>
              <td>{category.categoryId}</td>
            <td>{category.categoryName}</td>
            <td>
              <Button
                className="category__update"
                type="submit"
                variant="contained"
                color="primary"
                onClick={(e) => updateHandler(e, category.categoryId)}
              >
                update
              </Button>
              <Button
                className="category__delete"
                type="submit"
                variant="contained"
                color="secondary"
                onClick={(e) => deleteHandler(e, category.categoryId)}
              >
                Delete
              </Button>
            </td>
          </tr>
        )):null}
        </tbody>
      </table>
      
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
              <section className="category__update__section">
              <form className="category__form">
        <FormControl className="category__input">
          <InputLabel>CategoryName</InputLabel>
          <Input
            id="my-input"
            aria-describedby="my-helper-text"
            autoComplete="off"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
        {!id ? <Button
          className="category__submit"
          type="submit"
          variant="contained"
          color="primary"
          onClick={(e) => addCategory(e)}
        >
          ADD CATEGORY
        </Button> : 
        <Button
        className="category__submit"
        type="submit"
        variant="contained"
        color="primary"
        onClick={(e) => updateCategory(e)}
      >
        UPDATE CATEGORY
      </Button>
        }
      </form>
              </section>
            </div>
          </Fade>
        </Modal>
    </div>
  );
};

export default Category;
