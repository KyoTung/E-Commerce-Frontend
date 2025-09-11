import React from "react";
import Banner from "../../layouts/guest/Banner";
import Brands from "./Brands";
import Categories from "./Categories";

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
    </div>
  );
};

export default Home;
