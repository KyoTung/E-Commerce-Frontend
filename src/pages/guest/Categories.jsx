
import { Link } from "react-router-dom";
import "../../index.css";

const brands = [
  { name: "dien thoai chup anh dep" },
  { name: "dien thoai choi game" },
  { name: "dien thoai pin trau" },
  { name: "dien thoai gap" },
  { name: "dien thoai ai" },
  
];

const Categories = () => {
  return (
    <div id="brands" className="pb-6 pt-4">
          <h2 className="py-2 px-4 sm:px-2 lg:px-4 font-bold lg:text-xl">Chọn theo nhu cầu</h2>
          <div className="mx-auto flex max-w-7xl justify-start px-4 flex-wrap gap-4">
            {brands.map((brand, i) => (
              <Link
                key={i}
                to={`/product-brand/${brand.name.toLowerCase()}`}
                className="px-2 py-1 sm:px-4 sm:py-1 bg-gray-100 rounded-xl"
              >
                <div className="flex items-center justify-center">
                    <img
                  src={`/assets/${brand.name}.webp`}
                  alt={brand.name}
                  className=" w-16 sm:w-24 rounded object-contain"
                />
                </div>
            
                <p className="text-center text-xs mt-2 w-24 break-words line-clamp-2-center">{brand.name}</p>
              </Link>
            ))}
          </div>
        </div>
  )
}

export default Categories