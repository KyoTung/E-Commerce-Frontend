import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaTrash, FaHeart } from "react-icons/fa";
import { toast } from "react-toastify";


import { getWishlist } from "../../features/guestSlice/user/userSlice"; 
import { addwishList } from "../../features/guestSlice/product/productSlice"; 

import Loading from "../../components/Loading"; 

const Wishlist = () => {
  const dispatch = useDispatch();


  const { wishlist, isLoading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);

   useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 2. Hàm xóa (Toggle)
  const removeFromWishlist = (id) => {
    dispatch(addwishList(id))
      .unwrap()
      .then(() => {
        toast.success("Đã xóa khỏi danh sách yêu thích!");
        dispatch(getWishlist());
      })
      .catch((err) => {
        toast.error("Có lỗi xảy ra");
      });
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price || 0);

  return (
    <div className="bg-[#f5f5f7] min-h-screen py-8">
      <div className="mx-auto max-w-[1200px] px-4">
        
        <h1 className="text-2xl font-bold text-gray-800 mb-6 uppercase border-b pb-4 border-gray-300">
          Sản phẩm yêu thích của bạn
        </h1>

        {isLoading ? (
           <div className="flex justify-center h-60 items-center"><Loading /></div>
        ) : wishlist && wishlist.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {wishlist.map((item, index) => {
              if (!item) return null; 

              return (
                <div
                  key={item._id || index}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden group"
                >
                  {/* Nút Xóa */}
                  <button
                    onClick={() => removeFromWishlist(item._id)}
                    className="absolute top-2 right-2 z-10 bg-white p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 shadow-sm transition-all border border-gray-100"
                    title="Xóa khỏi yêu thích"
                  >
                    <FaTrash size={14} />
                  </button>

                  {/* Ảnh */}
                  <Link to={`/product/${item._id}`} className="block relative h-48 w-full p-4">
                    <img
                      src={item.images?.[0]?.url || "https://via.placeholder.com/300"}
                      alt={item.title}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>

                  {/* Thông tin */}
                  <div className="p-4 border-t border-gray-100">
                    <Link to={`/product/${item._id}`}>
                      <h5 className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[40px] hover:text-[#d70018] transition-colors mb-2">
                        {item.title}
                      </h5>
                    </Link>
                    <div className="text-[#d70018] font-bold text-base">
                      {formatPrice(item.basePrice)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Giao diện trống
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg shadow-sm">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FaHeart className="text-gray-300 text-4xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Danh sách yêu thích trống
            </h3>
            <p className="text-gray-500 mb-6 text-sm">
              Bạn chưa thêm sản phẩm nào vào danh sách.
            </p>
            <Link
              to="/product"
              className="bg-[#d70018] text-white px-8 py-2.5 rounded-full font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
            >
              Khám phá sản phẩm ngay
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;