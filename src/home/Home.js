import React from "react";
import Product from "../product/Product";
import { Route } from "react-router-dom";
import Category from "../category/Category";
import './Home.css';

function Home() {
  return (
    <div className="home">
        
      <Route exact path="/product" component={Product} />
      <Route exact path="/category" component={Category} />
    </div>
  );
}

export default Home;
