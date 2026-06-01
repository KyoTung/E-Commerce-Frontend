import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  FiArrowLeft, FiEdit, FiImage, FiInfo, 
  FiBox, FiCpu, FiFileText, FiTag 
} from "react-icons/fi";

import Loading from "../../../components/Loading";

import { getProduct } from "../../../features/adminSlice/products/productSlice"; 

const AdminProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

 
  const { product, isLoading, isError } = useSelector((state) => state.productAdmin);


  const [selectedImage, setSelectedImage] = useState("");
  const [isExpanded, setIsExpanded] = useState(false); 

  // Fetch dữ liệu khi load trang
  useEffect(() => {
    if (id) {
      dispatch(getProduct(id));
    }
  }, [id, dispatch]);

  // Set ảnh mặc định khi có dữ liệu product
  useEffect(() => {
    if (product && product.images?.length > 0) {
      setSelectedImage(product.images[0].url);
    }
  }, [product]);

  // --- HELPER FUNCTIONS ---
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price || 0);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  const specLabels = {
    screen: "Màn hình",
    processor: "CPU (Chipset)",
    storage: "Bộ nhớ trong",
    ram: "RAM",
    battery: "Pin & Sạc",
    os: "Hệ điều hành",
    frontCamera: "Camera trước",
    rearCamera: "Camera sau",
    sim: "Thẻ SIM",
    design: "Thiết kế",
  };

  // --- RENDER STATES ---
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loading />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-red-500 bg-gray-50">
        <p className="text-lg font-bold mb-4">Sản phẩm không tồn tại hoặc có lỗi xảy ra</p>
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg">
          Quay lại
        </button>
      </div>
    );
  }

  const specs = product.specifications || {};

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      {/* --- HEADER ACTIONS --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition shadow-sm"
          >
            <FiArrowLeft className="text-gray-600 text-xl" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              {product.title}
            </h1>
            <div className="text-sm text-gray-500 mt-1 flex gap-3">
              <span>ID: <span className="font-mono">{product._id}</span></span>
              <span>•</span>
              <span>Cập nhật: {formatDate(product.updatedAt)}</span>
            </div>
          </div>
        </div>
        
        <Link 
          to={`/admin/edit-product/${product._id}`} // Đường dẫn tới trang Edit sản phẩm
          className="flex items-center gap-2 bg-[#d70018] text-white px-5 py-2.5 rounded-lg font-bold hover:bg-[#b00117] transition shadow-sm"
        >
          <FiEdit /> Chỉnh sửa
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ================= CỘT TRÁI (Hình ảnh & Thông tin cơ bản) ================= */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Box: Hình ảnh sản phẩm (Giống Client) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiImage className="text-blue-500" /> Hình ảnh ({product.images?.length || 0})
            </h2>
            
            <div className="relative w-full aspect-square flex items-center justify-center overflow-hidden rounded-lg mb-4 bg-gray-50 border border-gray-100 p-2">
              <img
                src={selectedImage || "https://via.placeholder.com/500"}
                alt={product.title}
                className="h-full w-full object-contain transition-transform duration-500"
              />
            </div>
            
            {/* Thumbnails */}
            {product.images && product.images.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar items-center">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img.url)}
                    className={`w-16 h-16 flex-shrink-0 rounded-lg border p-1 transition-all ${
                      selectedImage === img.url
                        ? "border-[#d70018] shadow-sm bg-red-50/20"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <img src={img.url} className="w-full h-full object-contain rounded-md" alt={`thumb-${idx}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Box: Thông tin chung */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiInfo className="text-blue-500" /> Phân loại chung
            </h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-gray-100 pb-3">
                <span className="text-gray-500 font-medium">Giá gốc (Base Price)</span>
                <span className="font-bold text-[#d70018] text-base">{formatPrice(product.basePrice)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-3">
                <span className="text-gray-500 font-medium">Thương hiệu</span>
                <span className="font-bold text-gray-900">{product.brand}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-3">
                <span className="text-gray-500 font-medium">Danh mục</span>
                <span className="font-bold text-gray-900">{product.category}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-3">
                <span className="text-gray-500 font-medium">Đánh giá</span>
                <span className="font-bold text-yellow-500 flex items-center gap-1">
                  {product.totalRating || 0} / 5 ⭐
                </span>
              </div>
              <div className="pt-2">
                <span className="text-gray-500 font-medium flex items-center gap-1 mb-2"><FiTag /> Từ khóa (Tags)</span>
                <div className="flex flex-wrap gap-2">
                  {product.tags?.map((tag, idx) => (
                    <span key={idx} className="bg-gray-100 px-2.5 py-1 rounded-md text-xs font-medium text-gray-700 border border-gray-200">
                      #{tag}
                    </span>
                  ))}
                  {!product.tags?.length && <span className="text-xs text-gray-400">Không có tags</span>}
                </div>
              </div>
            </div>
          </div>
          
        </div>

        {/* ================= CỘT PHẢI (Biến thể, Thông số, Bài viết) ================= */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Box: Quản lý Biến thể (Variants) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FiBox className="text-blue-500" /> Kho hàng & Phiên bản (Variants)
              </h2>
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                {product.variants?.length || 0} Phân loại
              </span>
            </div>
            
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                  <tr>
                    <th className="px-5 py-3 w-16 text-center">Ảnh</th>
                    <th className="px-5 py-3">Màu sắc</th>
                    <th className="px-5 py-3">Bộ nhớ</th>
                    <th className="px-5 py-3">Giá bán lẻ</th>
                    <th className="px-5 py-3 text-center">Tồn kho</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {product.variants?.length > 0 ? product.variants.map((variant, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-3">
                        <div className="w-10 h-10 rounded border border-gray-200 bg-white p-0.5 mx-auto">
                          {variant.images?.length > 0 ? (
                            <img src={variant.images[0].url} alt={variant.color} className="w-full h-full object-contain cursor-pointer" onClick={() => setSelectedImage(variant.images[0].url)} />
                          ) : (
                            <div className="w-full h-full bg-gray-50 flex items-center justify-center text-[10px] text-gray-400 font-medium">N/A</div>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3  text-gray-800">{variant.color}</td>
                      <td className="px-5 py-3  text-gray-800">
                        <span className="bg-gray-200 px-2 py-1 rounded text-xs">{variant.storage}</span>
                      </td>
                      <td className="px-5 py-3  text-[#d70018]">{formatPrice(variant.price)}</td>
                      <td className="px-5 py-3 text-center">
                        <span className={`px-3 py-1 rounded-md text-xs  ${variant.quantity > 0 ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                          {variant.quantity}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="px-5 py-8 text-center text-gray-500">Sản phẩm này không có phân loại biến thể.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Box: Thông số kỹ thuật */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FiCpu className="text-blue-500" /> Thông số kỹ thuật
              </h2>
            </div>
            <div className="p-0 text-sm">
              {Object.keys(specs).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2">
                  {/* Map qua mảng keys của object specifications */}
                  {Object.entries(specs).map(([key, value], idx) => (
                    <div 
                      key={key} 
                      className={`flex p-4 border-b border-gray-100 ${idx % 2 !== 0 && window.innerWidth >= 640 ? 'sm:border-l' : ''}`}
                    >
                      <div className="w-1/3 font-semibold text-gray-600">{specLabels[key] || key}</div>
                      <div className="w-2/3 text-gray-800 pr-2">{value}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="p-6 text-gray-500 text-center">Chưa có thông số kỹ thuật nào được cập nhật.</p>
              )}
            </div>
          </div>

          {/* Box: Bài viết mô tả (Tái sử dụng logic Client) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FiFileText className="text-blue-500" /> Bài viết mô tả sản phẩm
              </h2>
            </div>
            
            <div className="relative">
              <div 
                className={`p-6 overflow-hidden transition-all duration-500 ease-in-out ${
                  isExpanded ? "max-h-[5000px]" : "max-h-[400px]" 
                }`}
              >
                {/* Sử dụng class prose của TailwindCSS (cần cài @tailwindcss/typography) 
                  và dangerouslySetInnerHTML giống hệt bên UI Client 
                */}
                <div
                  className="text-gray-800 text-sm sm:text-base leading-relaxed prose prose-sm sm:prose-base max-w-none break-words"
                  dangerouslySetInnerHTML={{ __html: product.description || "<p>Chưa có mô tả.</p>" }}
                />
              </div>
              
              {!isExpanded && product.description && product.description.length > 500 && (
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
              )}
            </div>

            {/* Nút Xem thêm / Thu gọn */}
            {product.description && product.description.length > 500 && (
              <div className="p-4 flex justify-center border-t border-gray-100 bg-gray-50/30">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="px-6 py-2 bg-white border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-all text-sm font-semibold shadow-sm"
                >
                  {isExpanded ? "Thu gọn nội dung" : "Xem toàn bộ nội dung"}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminProductDetail;