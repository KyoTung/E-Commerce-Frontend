import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../../index.css";
import { getAllBrand } from "../../features/adminSlice/brand/brandSlice";
import { useSelector, useDispatch } from "react-redux";

const Brands = () => {
  const { brands } = useSelector((state) => state.brandAdmin);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllBrand());
  }, [dispatch]);

  return (
    <section className="py-4 bg-gray-50">
      <div className="mx-auto max-w-[1200px] px-2 sm:px-4">
        <div className="flex items-center justify-between mb-3 px-2">
          <h2 className="text-lg font-bold text-gray-800 uppercase">
            Thương hiệu nổi bật
          </h2>
          <Link
            to="/products"
            className="text-sm text-gray-500 hover:text-[#d70018] transition-colors"
          >
            Xem tất cả &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2 sm:gap-3">
          {brands.map((brand, i) => (
            <Link
              key={i}
              to={`/products?brand=${brand.title}`} 
              // -----------------
              className="group flex items-center justify-center bg-white border border-gray-200 rounded-lg p-3 hover:border-[#d70018] hover:shadow-md transition-all duration-300"
              title={brand.title}
            >
              <div className="h-6 sm:h-8 w-full flex items-center justify-center">
                <img
                  src={brand.images?.[0]?.url || `/assets/${brand.title}.webp`} 
                  alt={brand.title}
                  className="max-h-full max-w-full object-contain filter group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Brands;