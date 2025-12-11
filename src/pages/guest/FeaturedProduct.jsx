import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaHeart } from "react-icons/fa";
import productService from "../../features/guestSlice/product/productService";

const FeaturedProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        
        const params = {
            sort: "-totalRating", 
            limit: 5             
        };

        const data = await productService.getAllProducts(params);
        // -------------------------
        
        if (Array.isArray(data)) {
          setProducts(data);
        }
      } catch (error) {
        console.error("Lỗi tải sản phẩm nổi bật:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price || 0);

  if (loading) {
    return <div className="py-10 text-center text-gray-500 text-sm">Đang tải sản phẩm nổi bật...</div>;
  }

  if (!products || products.length === 0) return null;

  return (
    <div className="bg-white py-8 border-t-4 border-[#d70018]">
      <div className="container mx-auto px-4 max-w-[1200px]">
        
        {/* Header Section */}
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 uppercase flex items-center gap-2">
            <span className="text-[#d70018]">★</span> SẢN PHẨM NỔI BẬT
          </h2>
          <Link 
            to="/products" 
            className="text-sm font-medium text-gray-500 hover:text-[#d70018] transition-colors"
          >
            Xem tất cả &rarr;
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {products.map((product) => {
             const displayPrice = product.basePrice;

             return (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="group relative bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-3 flex flex-col h-full"
              >
                {/* Image */}
                <div className="relative aspect-square flex items-center justify-center overflow-hidden mb-3 rounded-lg bg-white">
                  <img
                    src={product.images?.[0]?.url || "https://via.placeholder.com/150"}
                    alt={product.title}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Badge HOT */}
                  <div className="absolute top-0 left-0 bg-[#d70018] text-white text-[10px] font-bold px-2 py-0.5 rounded-br-lg shadow-sm z-10">
                    HOT
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1">
                  <h3 
                    className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 mb-1 group-hover:text-[#d70018] transition-colors min-h-[2.5em]"
                    title={product.title}
                  >
                    {product.title}
                  </h3>

                  {/* Specs Chip */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    <span className="bg-gray-100 text-[10px] text-gray-500 px-1.5 py-0.5 rounded border border-gray-200 truncate max-w-[80px]">
                        {product.specifications?.storage || "Chính hãng"}
                    </span>
                  </div>

                  {/* Price & Rating */}
                  <div className="mt-auto">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm sm:text-base font-bold text-[#d70018]">
                        {formatPrice(displayPrice)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                      <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-400 text-[10px] sm:text-xs" />
                        <span className="text-[10px] sm:text-xs text-gray-500 font-medium">
                            {product.totalRating || 0} ({product.rating?.length || 0})
                        </span>
                      </div>
                      <button className="text-gray-300 hover:text-[#d70018] transition-colors">
                        <FaHeart className="text-xs sm:text-sm"/>
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default FeaturedProduct;