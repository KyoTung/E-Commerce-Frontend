import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

// Icons
import { LiaCartPlusSolid } from "react-icons/lia";
import { FaStar, FaTimes, FaHeart, FaCheck } from "react-icons/fa";
import { IoTimeOutline } from "react-icons/io5";

// Redux Actions & Components
import Loading from "../../components/Loading";
import {
  getProduct,
  commentProduct,
} from "../../features/guestSlice/product/productSlice";
import { addToCart, getCart } from "../../features/guestSlice/cart/cartSlice";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 1. Redux State
  const { product, isLoading, isError } = useSelector(
    (state) => state.productClient
  );
  const { user } = useSelector((state) => state.auth); // Lấy user để check login khi comment

  // 2. Local State
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Logic Variants
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const [allStorages, setAllStorages] = useState([]);
  const [allColors, setAllColors] = useState([]);

  // Modal Review State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { rating: 5, comment: "" },
  });
  const currentRating = watch("rating");

  useEffect(() => {
    if (id) {
      dispatch(getProduct(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --- EFFECT 2: Init Data khi có Product ---
  useEffect(() => {
    if (product) {
      // Set ảnh chính
      if (product.images?.length > 0) setSelectedImage(product.images[0].url);

      // Set Variant mặc định (Variant đầu tiên)
      if (product.variants?.length > 0) {
        const firstVar = product.variants[0];
        setSelectedStorage(firstVar.storage);
        setSelectedVariant(firstVar);
      }
    }
  }, [product]);

  useEffect(() => {
    if (product && product.variants?.length > 0) {
      // 1. Lấy danh sách Storage duy nhất
      const storages = [
        ...new Set(product.variants.map((v) => v.storage)),
      ].sort();
      setAllStorages(storages);

      // 2. Lấy danh sách Color duy nhất
      const colors = [...new Set(product.variants.map((v) => v.color))].sort();
      setAllColors(colors);

      // 3. Chọn variant mặc định (ưu tiên variant đầu tiên hoặc rẻ nhất)
      const defaultVariant = product.variants[0];
      setSelectedVariant(defaultVariant);

      // 4. Set ảnh
      if (defaultVariant.images?.length > 0) {
        setSelectedImage(defaultVariant.images[0].url);
      } else if (product.images?.length > 0) {
        setSelectedImage(product.images[0].url);
      }
    }
  }, [product]);

  // --- HELPER FUNCTIONS ---

  const checkVariantExists = (storage, color) => {
    return product.variants.find(
      (v) => v.storage === storage && v.color === color
    );
  };

  // Xử lý khi chọn Storage
  const handleStorageClick = (storage) => {
    // 1. Tìm xem có variant nào khớp với (Storage Mới + Màu Hiện Tại) không?
    let nextVariant = checkVariantExists(storage, selectedVariant.color);

    // 2. Nếu không có (Ví dụ: 128GB ko có màu Đen), tìm variant đầu tiên của Storage mới
    if (!nextVariant) {
      nextVariant = product.variants.find((v) => v.storage === storage);
    }

    if (nextVariant) {
      setSelectedVariant(nextVariant);
      // Nếu variant mới có ảnh riêng thì đổi ảnh
      if (nextVariant.images?.[0]?.url)
        setSelectedImage(nextVariant.images[0].url);
    }
  };

  // Xử lý khi chọn Color
  const handleColorClick = (color) => {
    // 1. Tìm xem có variant nào khớp với (Màu Mới + Storage Hiện Tại) không?
    let nextVariant = checkVariantExists(selectedVariant.storage, color);

    // 2. Nếu không có (Ví dụ: Màu Xanh ko có bản 256GB), tìm variant đầu tiên của Màu mới
    if (!nextVariant) {
      nextVariant = product.variants.find((v) => v.color === color);
    }

    if (nextVariant) {
      setSelectedVariant(nextVariant);
      if (nextVariant.images?.[0]?.url)
        setSelectedImage(nextVariant.images[0].url);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);

  // Handle Add to Cart
  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.warning("Vui lòng chọn Phiên bản và Màu sắc!");
      return;
    }

    // Payload gửi đi
    const cartItemData = {
      cart: [
        {
          _id: product._id,
          count: quantity,
          color: selectedVariant.color,
          storage: selectedVariant.storage, // Backend cần cái này để tìm giá
        },
      ],
    };

    dispatch(addToCart(cartItemData));
  };

  // --- REVIEW HANDLER ---
  const onSubmitReview = async (data) => {
    if (!user) {
      toast.info("Vui lòng đăng nhập để đánh giá");
      navigate("/login", { state: { from: `/product/${id}` } });
      return;
    }

    const commentData = {
      star: data.rating,
      comment: data.comment,
      prdId: id,
    };

    console.log("Submitting review:", commentData);

    const result = await dispatch(commentProduct({ data: commentData }));

    if (commentProduct.fulfilled.match(result)) {
      dispatch(getProduct(id));
      setIsReviewModalOpen(false);
      reset();
    }
  };

  // --- RENDER ---
  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  if (isError || !product)
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        Sản phẩm không tồn tại
      </div>
    );

  const specs = product.specifications || {};

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="container mx-auto px-4 max-w-[1200px]">
        {/* Title Header */}
        <div className="border-b border-gray-200 pb-3 mb-4">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            {product.title}
            <span className="text-sm font-normal text-gray-500 mt-1">
              ({product.variants?.length > 0 ? "Nhiều phiên bản" : "Tiêu chuẩn"}
              )
            </span>
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex text-yellow-400 text-sm">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={
                    i < Math.floor(product.totalRating || 0)
                      ? "fill-current"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
            <span className="text-xs text-blue-600 cursor-pointer">
              {product.rating?.length || 0} đánh giá
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="relative aspect-[4/3] flex items-center justify-center overflow-hidden rounded-lg mb-4">
              <img
                src={selectedImage || "https://via.placeholder.com/500"}
                alt={product.title}
                className="h-full w-full object-contain hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Thumbnails */}
            {/* <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
              {product.images?.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img.url)}
                  className={`w-8 h-8 flex-shrink-0 rounded-lg border-2 p-1 ${
                    selectedImage === img.url
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={img.url}
                    className="w-full h-full object-contain"
                    alt=""
                  />
                </button>
              ))}
            </div> */}
          </div>

          <div className="lg:col-span-5 space-y-4">
            {/* Price Box */}
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-[#d70018]">
                {formatPrice(selectedVariant?.price || product.basePrice)}
              </span>
              {/* <span className="text-sm text-gray-400 line-through mb-1.5">30.000.000₫</span> */}
            </div>

            {allStorages.length > 0 && (
              <div>
                <p className="font-bold text-sm mb-2 text-gray-700">
                  Chọn phiên bản bộ nhớ:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {allStorages.map((storage, idx) => {
                    // Kiểm tra xem Storage này có hàng với Màu đang chọn không?
                    const isSelected = selectedVariant?.storage === storage;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleStorageClick(storage)}
                        className={`py-2 px-1 text-sm border rounded-lg transition-all ${
                          isSelected
                            ? "border-[#d70018] text-[#d70018] bg-red-50 font-bold"
                            : "border-gray-300 text-gray-600 hover:border-gray-400"
                        }`}
                      >
                        {storage}
                        {/* Hiển thị giá thấp nhất của bản này */}
                        <span className="block text-[10px] font-normal text-gray-500 mt-1">
                          {/* Logic tìm giá demo */}
                          {formatPrice(
                            product.variants.find((v) => v.storage === storage)
                              ?.price
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. Chọn Màu sắc (Color) */}
            {allColors.length > 0 && (
              <div>
                <p className="font-bold text-sm mb-2 text-gray-700">
                  Chọn màu sắc:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {allColors.map((color, idx) => {
                    const isSelected = selectedVariant?.color === color;
                    const exactVariant = checkVariantExists(
                      selectedVariant?.storage,
                      color
                    );

                    return (
                      <button
                        key={idx}
                        onClick={() => handleColorClick(color)}
                        className={`py-2 px-2 border rounded-lg flex items-center gap-2 transition-all relative ${
                          isSelected
                            ? "border-[#d70018] bg-white ring-1 ring-[#d70018]"
                            : "border-gray-300 bg-white hover:border-gray-400"
                        }`}
                      >
                        <div className="flex flex-col items-start overflow-hidden w-full">
                          <span className="text-xs font-bold text-gray-700 truncate w-full">
                            {color}
                          </span>
                          <span className="text-[10px] text-gray-500">
                            {
                              exactVariant
                                ? formatPrice(exactVariant.price)
                                : formatPrice(
                                    product.variants.find(
                                      (v) => v.color === color
                                    )?.price
                                  ) 
                            }
                          </span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-0 right-0">
                            <FaCheck
                              size={10}
                              className="text-white bg-[#d70018] p-0.5 rounded-bl-md"
                            />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="border border-[#d70018] rounded-lg overflow-hidden">
              <div className="bg-[#d70018] text-white py-1.5 px-3 text-sm font-bold flex items-center gap-2">
                <FaStar /> Khuyến mãi đặc biệt
              </div>
              <div className="p-3 text-sm space-y-2 bg-white">
                <p className="flex gap-2">
                  <span className="bg-[#d70018] text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] mt-0.5">
                    1
                  </span>{" "}
                  <span>Trả góp 0% lãi suất</span>
                </p>
                <p className="flex gap-2">
                  <span className="bg-[#d70018] text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] mt-0.5">
                    2
                  </span>{" "}
                  <span>Miễn phí giao hàng</span>
                </p>
                <p className="flex gap-2">
                  <span className="bg-[#d70018] text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] mt-0.5">
                    3
                  </span>{" "}
                  <span>Thu cũ đổi mới trợ giá 2 triệu</span>
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-b from-[#d70018] to-[#b30014] text-white py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex flex-col items-center justify-center"
              >
                <LiaCartPlusSolid size={24} />
                <span className="text-base font-bold uppercase">
                  Thêm vào giỏ hàng
                </span>
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Specifications Table (Mini) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-lg border border-gray-200 overflow-hidden bg-white mt-4">
              <h3 className="bg-gray-100 p-2 font-bold text-gray-700 text-center text-sm">
                Thông số kỹ thuật
              </h3>
              <div className="text-sm">
                {[
                  { l: "Màn hình", v: specs.screen },
                  { l: "Hệ điều hành", v: specs.os },
                  { l: "Camera sau", v: specs.rearCamera },
                  { l: "Camera trước", v: specs.frontCamera },
                  { l: "Chipset", v: specs.processor },
                  { l: "RAM", v: specs.ram },
                  { l: "Bộ nhớ", v: specs.storage },
                  { l: "Pin", v: specs.battery },
                  { l: "SIM", v: specs.sim },
                  { l: "Thiết kế", v: specs.design },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex p-2 ${idx % 2 !== 0 ? "bg-gray-50" : ""}`}
                  >
                    <span className="w-1/3 text-gray-500">{item.l}</span>
                    <span className="w-2/3 text-gray-800">{item.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Description */}
          <div className="lg:col-span-7 bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="">
              <h3 className="bg-gray-100 p-3 rounded-t-lg font-bold text-gray-700 uppercase text-sm">
                Đặc điểm nổi bật
              </h3>
              <div
                className=" min-w-0 truncate p-4 border border-gray-100 rounded-b-lg text-gray-700 text-sm leading-relaxed prose max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          </div>
        </div>

        {/* --- REVIEW SECTION --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-6 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Đánh giá & Nhận xét {product.title}
              </h2>
              <div className="text-sm text-gray-500 mt-1">
                {product.rating?.length || 0} đánh giá
              </div>
            </div>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="bg-[#d70018] text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-[#b00117] transition shadow-sm w-full sm:w-auto"
            >
              Viết đánh giá
            </button>
          </div>

          {/* Comments List */}
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {product.rating && product.rating.length > 0 ? (
              product.rating.map((comment, index) => (
                <div
                  key={index}
                  className="border-b border-gray-100 pb-4 last:border-0"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500 text-xs">
                      {(
                        comment.posteby?.fullName?.charAt(0) || "U"
                      ).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-800">
                        {comment.posteby?.fullName || "Người dùng ẩn danh"}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex text-yellow-400 text-xs">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={
                                i < comment.star
                                  ? "fill-current"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <IoTimeOutline />{" "}
                          {new Date(comment.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg ml-11">
                    {comment.comment}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 text-sm">
                Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm
                này!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- MODAL REVIEW FORM --- */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800">Đánh giá sản phẩm</h3>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmitReview)} className="p-6">
              {/* Star Rating Input */}
              <div className="flex flex-col items-center mb-6">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setValue("rating", star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <FaStar
                        size={32}
                        className={
                          star <= currentRating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {currentRating === 5
                    ? "Tuyệt vời"
                    : currentRating === 4
                    ? "Hài lòng"
                    : currentRating === 3
                    ? "Bình thường"
                    : "Tệ"}
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nội dung đánh giá
                </label>
                <textarea
                  {...register("comment", { required: true })}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-1 focus:ring-[#d70018] focus:border-[#d70018] outline-none"
                  placeholder="Mời bạn chia sẻ cảm nhận về sản phẩm..."
                ></textarea>
                {errors.comment && (
                  <span className="text-red-500 text-xs">
                    Vui lòng nhập nội dung
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-[#d70018] text-white py-3 rounded-lg font-bold hover:bg-[#b00117] transition-colors shadow-md"
              >
                Gửi đánh giá
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
