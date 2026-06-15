import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";

// Icons
import { LiaCartPlusSolid } from "react-icons/lia";
import {
  FaStar,
  FaTimes,
  FaCheck,
  FaChevronDown,
  FaChevronUp,
  FaHeart,
} from "react-icons/fa";
import { IoTimeOutline } from "react-icons/io5";
import { FiHeart, FiMessageSquare, FiCpu, FiPlusCircle } from "react-icons/fi";

// Redux Actions & Components
import Loading from "../../components/Loading";
import {
  getProduct,
  commentProduct,
} from "../../features/guestSlice/product/productSlice";
import { addToCart, getCart } from "../../features/guestSlice/cart/cartSlice";
import { getWishlist } from "../../features/guestSlice/user/userSlice";
import { addwishList } from "../../features/guestSlice/product/productSlice";
import { getUser } from "../../features/guestSlice/user/userSlice";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // --- REFS FOR SCROLLING ---
  const specsRef = useRef(null);
  const reviewsRef = useRef(null);

  // 1. Redux State
  const { product, isLoading, isError } = useSelector(
    (state) => state.productClient,
  );
  const { user } = useSelector((state) => state.auth);
  // Lấy wishlist từ userSlice (bổ sung an toàn tránh undefined)
  const userState = useSelector((state) => state.user);
  const wishlist = userState?.wishlist || [];

  const { user: userProfile } = useSelector((state) => state.user);

  // 2. Local State
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);

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
    dispatch(getUser(user._id || user.id));
  }, [dispatch]);


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (user) {
      dispatch(getWishlist());
    }
  }, [dispatch, user]);

  // --- EFFECT 2: Init Data khi có Product ---
  useEffect(() => {
    if (product) {
      if (product.images?.length > 0) setSelectedImage(product.images[0].url);
      if (product.variants?.length > 0) {
        const firstVar = product.variants[0];
        setSelectedStorage(firstVar.storage);
        setSelectedVariant(firstVar);
      }
    }
  }, [product]);

  useEffect(() => {
    if (product && product.variants?.length > 0) {
      const storages = [
        ...new Set(product.variants.map((v) => v.storage)),
      ].sort();
      setAllStorages(storages);

      const colors = [...new Set(product.variants.map((v) => v.color))].sort();
      setAllColors(colors);

      const defaultVariant = product.variants[0];
      setSelectedVariant(defaultVariant);

      if (defaultVariant.images?.length > 0) {
        setSelectedImage(defaultVariant.images[0].url);
      } else if (product.images?.length > 0) {
        setSelectedImage(product.images[0].url);
      }
    }
  }, [product]);

  // --- WISHLIST HANDLERS ---
  const addToWish = (productId) => {
    if (!user) {
      toast.warn("Vui lòng đăng nhập để thêm vào yêu thích!", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }
    dispatch(addwishList(productId))
      .unwrap()
      .then(() => {
        toast.success("Đã cập nhật danh sách yêu thích!");
        dispatch(getWishlist());
      })
      .catch((err) => {
        toast.error(err.message || "Có lỗi xảy ra");
      });
  };

  const checkIsLiked = (productId) => {
    if (!wishlist || wishlist.length === 0) return false;
    return wishlist.some((item) => {
      const itemId = typeof item === "string" ? item : item?._id;
      return itemId === productId;
    });
  };

  const isLiked = product ? checkIsLiked(product._id) : false;

  // --- SCROLL HANDLER ---
  const scrollToSection = (elementRef) => {
    if (elementRef && elementRef.current) {
      const offset = 80; // Bù trừ khoảng cách (nếu có header fixed)
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = elementRef.current.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;

      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    }
  };

  // --- HELPER FUNCTIONS ---
  const checkVariantExists = (storage, color) => {
    return product.variants.find(
      (v) => v.storage === storage && v.color === color,
    );
  };

  const handleStorageClick = (storage) => {
    let nextVariant = checkVariantExists(storage, selectedVariant.color);
    if (!nextVariant) {
      nextVariant = product.variants.find((v) => v.storage === storage);
    }
    if (nextVariant) {
      setSelectedVariant(nextVariant);
      if (nextVariant.images?.[0]?.url)
        setSelectedImage(nextVariant.images[0].url);
    }
  };

  const handleColorClick = (color) => {
    let nextVariant = checkVariantExists(selectedVariant.storage, color);
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

 
  // 1. Thêm async/await vào handleAddToCart
  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.warning("Vui lòng chọn Phiên bản và Màu sắc!");
      return false;
    }
    if (!user) {
      toast.warning("Vui lòng đăng nhập!");
      return false;
    }
    if (userProfile?.isBlock === true) {
      toast.warning("Tài khoản đã bị khóa. Vui lòng liên hệ bộ phận CSKH để mở khóa");
      return false;
    }

    const cartItemData = {
      cart: [
        {
          _id: product._id,
          count: quantity,
          color: selectedVariant.color,
          storage: selectedVariant.storage,
        },
      ],
    };

    try {
      // Dùng .unwrap() của Redux Toolkit để đợi API chạy xong
      await dispatch(addToCart(cartItemData)).unwrap();

      // CHUẨN BỊ DỮ LIỆU ĐẦY ĐỦ: Gọi getCart ngay tại đây để cập nhật Redux store hoàn chỉnh
      await dispatch(getCart()).unwrap();

      return true; // Trả về true khi mọi thứ đã xong xuôi
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  // 2. Thêm async/await vào handleBuyNow
  const handleBuyNow = async () => {
    // Chờ quá trình thêm và cập nhật giỏ hàng hoàn thành
    const added = await handleAddToCart();

    if (added) {
      const autoSelectKey = `${product._id}-${selectedVariant.color}-${selectedVariant.storage}`;
      // Lúc này Redux store đã có dữ liệu hoàn chỉnh, chuyển trang sẽ render chuẩn 100%
      navigate("/cart", {
        state: { autoSelectKey },
      });
    }
  };

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

    try {
      const result = await dispatch(commentProduct({ data: commentData }));

      // Thành công
      if (commentProduct.fulfilled.match(result)) {
        toast.success("Cảm ơn bạn đã đánh giá sản phẩm!");
        dispatch(getProduct(id)); // Lấy lại dữ liệu mới nhất
        setIsReviewModalOpen(false);
        reset();
      }
      // Lỗi từ phía API Backend
      else if (commentProduct.rejected.match(result)) {
        // Tùy thuộc vào cách bạn setup rejectWithValue ở backend, result.payload có thể chứa message lỗi
        const errorMessage =
          result.payload?.message ||
          result.error?.message ||
          "Không thể gửi đánh giá, vui lòng thử lại!";
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi hệ thống!");
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
      <ToastContainer />
      <div className="container mx-auto px-4 max-w-[1200px]">
        {/* Title Header & Tools */}
        <div className="border-b border-gray-200 pb-4 mb-4">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            {product.title}
            <span className="text-sm font-normal text-gray-500 mt-1">
              ({product.variants?.length > 0 ? "Nhiều phiên bản" : "Tiêu chuẩn"}
              )
            </span>
          </h1>

          <div className="flex items-center gap-2 mt-2">
            <div className="flex text-yellow-400 text-sm">
              <span className="font-bold text-gray-800 mr-1.5">
                {Math.floor(product.totalRating || 5)}
              </span>
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
            <span
              className="text-sm text-gray-500 cursor-pointer hover:text-blue-500"
              onClick={() => scrollToSection(reviewsRef)}
            >
              ({product.rating?.length || 0} đánh giá)
            </span>
          </div>

          {/* New Tools Row */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 text-[14px] text-[#2f80ed]">
            {/* Nút Yêu thích có render logic Icon đỏ/thường */}
            <button
              onClick={() => addToWish(product._id)}
              className="flex items-center gap-1.5 hover:text-blue-700 transition-colors"
            >
              {isLiked ? (
                <FaHeart size={16} className="text-red-500" />
              ) : (
                <FiHeart size={16} />
              )}
              {isLiked ? "Đã thích" : "Yêu thích"}
            </button>
            <span className="text-gray-300">|</span>

            {/* Scroll đến phần Đánh giá/Hỏi đáp */}
            <button
              onClick={() => scrollToSection(reviewsRef)}
              className="flex items-center gap-1.5 hover:text-blue-700 transition-colors"
            >
              <FiMessageSquare size={16} /> Hỏi đáp
            </button>
            <span className="text-gray-300">|</span>

            {/* Scroll đến phần Thông số */}
            <button
              onClick={() => scrollToSection(specsRef)}
              className="flex items-center gap-1.5 hover:text-blue-700 transition-colors"
            >
              <FiCpu size={16} /> Thông số
            </button>
            <span className="text-gray-300">|</span>

            <button className="flex items-center gap-1.5 hover:text-blue-700 transition-colors">
              <FiPlusCircle size={16} /> So sánh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Images */}
          <div className="lg:col-span-7 bg-white rounded-xl shadow-sm p-3 sm:p-4 border border-gray-100 flex flex-col">
            <div className="relative w-full aspect-video flex items-center justify-center overflow-hidden rounded-lg mb-4 bg-white">
              <img
                src={selectedImage || "https://via.placeholder.com/500"}
                alt={product.title}
                className="h-full w-full object-contain  transition-transform duration-500"
              />
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 0 && (
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 custom-scrollbar items-center">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img.url)}
                    className={`w-14 h-14 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg border p-1 transition-all ${
                      selectedImage === img.url
                        ? "border-[#d70018] shadow-sm bg-red-50/20"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={img.url}
                      className="w-full h-full object-contain rounded-md"
                      alt={`thumbnail-${idx}`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Info & Actions */}
          <div className="lg:col-span-5 space-y-5">
            {/* Price Box */}
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-[#d70018]">
                {formatPrice(selectedVariant?.price || product.basePrice)}
              </span>
            </div>

            {/* Chọn phiên bản bộ nhớ */}
            {allStorages.length > 0 && (
              <div>
                <p className="font-bold text-sm mb-2 text-gray-700">
                  Chọn phiên bản bộ nhớ:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {allStorages.map((storage, idx) => {
                    const isSelected = selectedVariant?.storage === storage;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleStorageClick(storage)}
                        className={`py-1.5 px-2 text-sm border rounded-lg transition-all flex flex-col items-center justify-center ${
                          isSelected
                            ? "border-[#d70018] text-[#d70018] bg-red-50 font-bold"
                            : "border-gray-300 text-gray-600 hover:border-gray-400"
                        }`}
                      >
                        <span className="leading-tight">{storage}</span>
                        <span className="block text-[10px] font-normal text-gray-500 mt-0.5">
                          {formatPrice(
                            product.variants.find((v) => v.storage === storage)
                              ?.price,
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Chọn Màu sắc */}
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
                      color,
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
                          <span className="text-[10px] text-gray-500 mt-0.5"></span>
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

            {/* Khuyến mãi */}
            <div className="border border-[#d70018] rounded-lg overflow-hidden">
              <div className="bg-[#d70018] text-white py-1.5 px-3 text-sm font-bold flex items-center gap-2">
                <FaStar /> Khuyến mãi đặc biệt
              </div>
              <div className="p-3 text-sm space-y-2 bg-white">
                <p className="flex gap-2">
                  <span className="bg-[#d70018] text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] mt-0.5 shrink-0">
                    1
                  </span>{" "}
                  <span>Miễn phí giao hàng toàn quốc</span>
                </p>
                <p className="flex gap-2">
                  <span className="bg-[#d70018] text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] mt-0.5 shrink-0">
                    2
                  </span>{" "}
                  <span>Thu cũ đổi mới trợ giá lên đến 2 triệu</span>
                </p>
              </div>
            </div>

            {/* Nút Hành động */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className="w-full sm:w-1/2 border-2 border-[#d70018] text-[#d70018] bg-white py-3 px-2 rounded-xl shadow-sm hover:bg-red-50 transition-all flex flex-col items-center justify-center group"
              >
                <div className="flex items-center gap-2">
                  <LiaCartPlusSolid
                    size={26}
                    className="group-hover:scale-110 transition-transform"
                  />
                  <span className="text-[15px] font-bold">Thêm vào giỏ</span>
                </div>
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full sm:w-1/2 bg-[#d70018] text-white py-3 px-2 rounded-xl shadow-sm hover:bg-[#c50015] hover:shadow-md transition-all flex items-center justify-center group"
              >
                <div className="flex flex-col items-center">
                  <span className="text-[15px] font-bold uppercase">
                    Mua ngay
                  </span>
                  <span className="text-[11px] font-normal text-red-100 mt-0.5 text-center">
                    Giao tận nơi hoặc nhận tại siêu thị
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Phần nội dung dưới: Thông số & Mô tả */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Thông số kỹ thuật (Gắn REF vào đây) */}
          <div
            ref={specsRef}
            className="lg:col-span-5 space-y-4 order-2 lg:order-1"
          >
            <div className="rounded-xl border border-gray-100 overflow-hidden bg-white shadow-sm">
              <h3 className="bg-gray-50 p-3 font-bold text-gray-700 uppercase text-sm sm:text-base border-b border-gray-100">
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
                    className={`flex p-3 ${idx % 2 !== 0 ? "bg-gray-50/50" : ""}`}
                  >
                    <span className="w-1/3 text-gray-500 font-medium">
                      {item.l}
                    </span>
                    <span className="w-2/3 text-gray-800">
                      {item.v || "Đang cập nhật"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mô tả sản phẩm */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
              <h3 className="bg-gray-50 p-3 rounded-t-xl font-bold text-gray-700 uppercase text-sm sm:text-base border-b border-gray-100">
                Đặc điểm nổi bật
              </h3>

              <div className="relative">
                <div
                  className={`p-4 sm:p-5 overflow-hidden transition-all duration-500 ease-in-out ${
                    isExpanded
                      ? "max-h-[5000px]"
                      : "max-h-[300px] sm:max-h-[400px] lg:max-h-[500px]"
                  }`}
                >
                  <div
                    className="text-gray-700 text-sm sm:text-base leading-relaxed prose prose-sm sm:prose-base max-w-none break-words"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>

                {!isExpanded && (
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-white/0 pointer-events-none"></div>
                )}
              </div>

              <div className="p-4 flex justify-center border-t border-gray-50 mt-auto">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center gap-2 px-6 py-2 bg-white border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 hover:shadow-sm transition-all text-sm font-semibold w-full sm:w-auto justify-center"
                >
                  {isExpanded ? (
                    <>
                      Thu gọn <FaChevronUp size={12} />
                    </>
                  ) : (
                    <>
                      Xem thêm <FaChevronDown size={12} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- REVIEW SECTION (Gắn REF vào đây) --- */}
        <div
          ref={reviewsRef}
          className="bg-white rounded-xl shadow-sm border border-gray-100 mt-6 p-4 sm:p-6 mb-10"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Hỏi đáp & Đánh giá {product.title}
              </h2>
              <div className="text-sm text-gray-500 mt-1">
                {product.rating?.length || 0} đánh giá
              </div>
            </div>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="bg-[#d70018] text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-[#b00117] transition shadow-sm w-full sm:w-auto"
            >
              Viết đánh giá
            </button>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {product.rating && product.rating.length > 0 ? (
              product.rating.map((comment, index) => (
                <div
                  key={index}
                  className="border-b border-gray-100 pb-4 last:border-0"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500 text-xs shrink-0">
                      {(
                        comment.posteby?.fullName?.charAt(0) || "U"
                      ).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-800">
                        {comment.posteby?.fullName || "Người dùng ẩn danh"}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
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
                            "vi-VN",
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
                Chưa có đánh giá nào. Hãy là người đầu tiên đặt câu hỏi hoặc
                đánh giá sản phẩm này!
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
                  <span className="text-red-500 text-xs mt-1 block">
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
