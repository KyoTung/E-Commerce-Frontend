import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Axios from "../../Axios";
import { FaAngleRight } from "react-icons/fa";

const categories = [
  {
    name: "Tin cong nghe",
  },
  {
    name: "Thu thuat",
  },
  {
    name: "Tin cong nghe",
  },
  {
    name: "Tin cong nghe",
  },
  {
    name: "Tin cong nghe",
  },
  {
    name: "Tin cong nghe",
  },
];
const BlogCategories = ({ show, onClose }) => {
  // const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //     if (show) {
  //         setLoading(true);
  //         Axios
  //             .get("/all-categories")
  //             .then(({ data }) => {
  //                 setCategories(data.data);
  //                 setLoading(false);
  //             })
  //             .catch(() => setLoading(false));
  //     }
  // }, [show]);

  // if (!show) return null;

  return (
    <div className=" rounded">
      <div className=" inset-0 bg-black opacity-40"  />
      <div className="animate-slideInLeft relative z-10 mt-8 max-h-[80vh] w-56 max-w-full self-start overflow-y-auto rounded-r-lg bg-white p-2 shadow-lg">
        <h2 className="mb-4 mt-2 text-lg font-bold">Danh mục bài viết</h2>
        <ul className="space-y-2">
          {loading ? (
            <span>Loading...</span>
          ) : (
            categories.map((c) => (
              <li key={c.id}>
                <Link
                  to={`/product-category/${c.id}`}
                  className=" p-2 flex  text-gray-700 rounded-md justify-between  hover:bg-gray-200 hover:text-red-600"
                  onClick={onClose}
                >
                  <span className="flex justify-center items-center ">{c.name}</span>

                  <FaAngleRight className="mt-1"/>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default BlogCategories;
