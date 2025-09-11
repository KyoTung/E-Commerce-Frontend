import React from "react";
import { Link } from "react-router-dom";
import "../../index.css";

const brands = [
  { name: "iphone" },
  { name: "samsung" },
  { name: "xiaomi" },
  { name: "oppo" },
  { name: "vivo" },
  { name: "realme" },
  { name: "asus" },
];

const Brands = () => {
  return (
    <div id="brands" className="pb-6 pt-4">
      <h2 className="py-2 px-4 sm:px-2 lg:px-4 font-bold lg:text-xl">Điện thoại</h2>
      <div className="mx-auto flex max-w-7xl justify-start px-4 flex-wrap gap-4">
        {brands.map((brand, i) => (
          <Link
            key={i}
            to={`/product-brand/${brand.name.toLowerCase()}`}
            className=""
          >
            <img
              src={`/assets/${brand.name}.webp`}
              alt={brand.name}
              className="h-8 w-24 rounded border object-contain"
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Brands;
