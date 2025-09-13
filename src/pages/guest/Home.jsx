import React from "react";
import Banner from "../../layouts/guest/Banner";
import Brands from "./Brands";
import Categories from "./Categories";
import FeaturedProduct from "./FeaturedProduct";

const Home = () => {
  return (
    <div className="">
      <div>
        <Banner />
      </div>
      <div>
        <Brands/>
      </div>
      <div>
        <Categories/>
      </div>
      <div>
        <FeaturedProduct/>
      </div>
    </div>
  );
};

export default Home;
