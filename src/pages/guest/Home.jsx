import React from "react";
import Banner from "../../layouts/guest/Banner";
import Brands from "./Brands";
import Categories from "./Categories";
import FeaturedProduct from "./FeaturedProduct";
import AllProducts from "./AllProducts";
import BlogSession from "./BlogSession";

const Home = () => {
  return (
    <div className="">
      <div>
        <Banner />
      </div>
      <div>
        {/*<Brands/>*/}
      </div>
      <div>
        <Categories/>
      </div>
      <div>
        <FeaturedProduct/>
      </div>
      <div>
        <AllProducts/>
      </div>
      <div>
        <BlogSession/>
      </div>
    </div>
  );
};

export default Home;
