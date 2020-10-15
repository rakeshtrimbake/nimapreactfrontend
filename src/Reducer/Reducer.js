export const initState = {
  user: null,
  userList: [],
  product: null,
  productList: [],
  category: null,
  categoryList: [],
};

export const removeCategory = (state, id) =>
  state.categoryList.filter((category) => id !== category.categoryId);

export const removeProduct = (state, id) =>
  state.productList.filter((product) => id !== product.productId);

export const reducer = (state = initState, action) => {
  switch (action.type) {
    case "ADD_USER":
      return {
        ...state,
        user: action.user,
      };
    case "ADD_CATEGORY":
      return {
        ...state,
        categoryList: [...state.categoryList,action.category],
      };
    case "REMOVE_CATEGORY":
      return {
        ...state,
        categoryList: removeCategory(state, action.id),
      };
    case "ADD_PRODUCT":
      return {
        ...state,
        product: [...state.productList,action.product]
      };
    case "REMOVE_PRODUCT":
      return {
        ...state,
        productList: removeProduct(state, action.id),
      };

    case "CATEGORY_LIST":
      return {
        ...state,
        categoryList: action.categoryList,
      };

    case "PRODUCT_LIST":
      return {
        ...state,
        productList: action.productList,
      };

    default:
      return state;
  }
};
