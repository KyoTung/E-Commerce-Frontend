import React, { useState } from "react";
import { LiaCartPlusSolid } from "react-icons/lia";
import { FaStar, FaRegUserCircle , FaTimes} from "react-icons/fa";
import { IoTimeOutline } from "react-icons/io5";


const product = {
  id: 1,
  name: "iPhone 15 128GB | Chính hãng VN/A",
  img_url:
    "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-plus_1__1.png",
  price: 20000000,
  rating: 4.7,
  discount: 10,
  screen_size: "6.7 inches",
  ram: "8GB",
  rom: "256GB",
  camera: "48MP + 12MP",
  battery: "4385 mAh",
  chipset: "Apple A17 Pro",
  operating_system: "iOS 17",
  description:
    "<p>iPhone 15 là sản phẩm mới nhất của Apple với thiết kế hiện đại, hiệu năng mạnh mẽ và camera cải tiến. Sản phẩm chính hãng VN/A, bảo hành 12 tháng.</p><p>Màn hình Super Retina XDR 6.7 inch, công nghệ Dynamic Island độc đáo. Chip A17 Pro cho hiệu năng vượt trội, chơi game mượt mà.</p>",
  versions: [
    { id: 1, name: "128GB", price: 20000000 },
    { id: 2, name: "256GB", price: 22500000 },
    { id: 3, name: "512GB", price: 26000000 },
  ],
  colors: [
    { id: 1, name: "Xanh dương", value: "blue-600" },
    { id: 2, name: "Đen", value: "black" },
    { id: 3, name: "Hồng", value: "pink-300" },
    { id: 4, name: "Vàng", value: "yellow-300" },
    { id: 5, name: "Tím", value: "purple-500" },
  ],
};

const comments = [
  {
    id: 1,
    title: "Sản phẩm rất tốt",
    category: "Đánh giá sản phẩm",
    date: "2025-09-15",
    content:
      "Tôi đã sử dụng chiếc loa này được một tuần và chất lượng âm thanh vượt ngoài mong đợi. Âm bass mạnh, âm treble rõ ràng. Rất đáng tiền!",
    rating: 5,
    user: "Nguyễn Văn A",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    title: "Giao hàng nhanh, đóng gói cẩn thận",
    category: "Dịch vụ giao hàng",
    date: "2025-09-14",
    content:
      "Đặt hàng hôm trước, hôm sau đã nhận được. Hộp được bọc chống sốc kỹ càng, không bị móp méo gì. Rất hài lòng với dịch vụ.",
    rating: 4,
    user: "Trần Thị B",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: 3,
    title: "Hỗ trợ khách hàng nhiệt tình",
    category: "Chăm sóc khách hàng",
    date: "2025-09-13",
    content:
      "Tôi gặp vấn đề khi kết nối tai nghe với điện thoại, nhân viên hỗ trợ đã hướng dẫn rất chi tiết và kiên nhẫn. Giải quyết được ngay.",
    rating: 5,
    user: "Lê Văn C",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: 4,
    title: "Giá cả hợp lý, chất lượng ổn",
    category: "Giá cả",
    date: "2025-09-12",
    content:
      "So với các sản phẩm cùng phân khúc thì giá ở đây mềm hơn, nhưng chất lượng không hề thua kém. Rất phù hợp với túi tiền sinh viên.",
    rating: 4,
    user: "Phạm Thị D",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    id: 5,
    title: "Sẽ quay lại mua lần sau",
    category: "Trải nghiệm mua sắm",
    date: "2025-09-11",
    content:
      "Trang web dễ sử dụng, thông tin rõ ràng, thanh toán nhanh chóng. Mình sẽ giới thiệu cho bạn bè và quay lại mua thêm.",
    rating: 5,
    user: "Hoàng Văn E",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
  },
];

const ProductDetail = () => {
   const [selectedImage, setSelectedImage] = useState(product.img_url);
  const [quantity, setQuantity] = useState(1);
  const [selectedVersion, setSelectedVersion] = useState(product.versions[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [expandedComment, setExpandedComment] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: "",
    content: "",
    user: "Người dùng", // Có thể lấy từ thông tin user đã đăng nhập
  });

  const productImages = [
    { id: 1, image_url: product.img_url },
    {
      id: 2,
      image_url:
        "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-plus_5__1.png",
    },
    {
      id: 3,
      image_url:
        "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-plus_3__1.png",
    },
    {
      id: 4,
      image_url:
        "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-plus_4__1.png",
    },
  ];

  const handleAddToCart = () => {
    console.log("Thêm vào giỏ hàng:", {
      product: product.name,
      version: selectedVersion.name,
      color: selectedColor.name,
      quantity: quantity,
      price: selectedVersion.price
    });
  };


  const toggleCommentExpanded = (commentId) => {
    setExpandedComment(expandedComment === commentId ? null : commentId);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    // Xử lý gửi đánh giá
    console.log("Đánh giá đã gửi:", reviewForm);
    // Thêm đánh giá mới vào danh sách
    const newReview = {
      id: comments.length + 1,
      title: reviewForm.title,
      category: "Đánh giá sản phẩm",
      date: new Date().toISOString().split('T')[0],
      content: reviewForm.content,
      rating: reviewForm.rating,
      user: reviewForm.user,
      avatar: "https://randomuser.me/api/portraits/men/6.jpg"
    };
    
    // Reset form và đóng modal
    setReviewForm({
      rating: 5,
      title: "",
      content: "",
      user: "Người dùng",
    });
    setIsReviewModalOpen(false);
    
    // Hiển thị thông báo thành công
    alert("Cảm ơn bạn đã đánh giá sản phẩm!");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (newRating) => {
    setReviewForm(prev => ({
      ...prev,
      rating: newRating
    }));
  };

  const ProductDescription = ({ htmlContent }) => {
    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
  };

  const StarRating = ({ rating, size = "w-4 h-4", editable = false, onRatingChange }) => {
    return (
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <button
            key={i}
            type={editable ? "button" : "span"}
            onClick={editable ? () => onRatingChange(i + 1) : undefined}
            className={`${size} ${i < rating ? "fill-current" : "text-gray-300"} mx-0.5 ${editable ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
          >
            <FaStar />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg border bg-gray-50">
            <img
              src={selectedImage}
              alt={product.name}
              className="h-full w-full object-contain p-5"
              loading="lazy"
            />
            {product.discount > 0 && (
              <div className="absolute top-2 left-2 rounded-md bg-red-600 px-2 py-1 text-sm font-bold text-white">
                -{product.discount}%
              </div>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {productImages.map((productImage) => (
              <button
                key={productImage.id}
                onClick={() => setSelectedImage(productImage.image_url)}
                className={`h-20 min-w-[80px] rounded border-2 transition-all duration-200 ${
                  selectedImage === productImage.image_url
                    ? "border-red-600 scale-105"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <img
                  src={productImage.image_url}
                  alt={`Thumbnail ${productImage.id}`}
                  className="h-full w-full object-contain p-1"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center">
            <StarRating rating={Math.floor(product.rating)} />
            <span className="ml-2 text-sm text-gray-600">
              ({product.rating}) | 333 đánh giá
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center">
            <span className="text-2xl font-bold text-red-600">
              {selectedVersion.price.toLocaleString("vi-VN")}₫
            </span>
            {product.discount > 0 && (
              <span className="ml-3 text-lg text-gray-500 line-through">
                {Math.round(
                  selectedVersion.price / (1 - product.discount / 100)
                ).toLocaleString("vi-VN")}
                ₫
              </span>
            )}
          </div>

          {/* Version Selection */}
          <div>
            <p className="text-gray-900 font-bold mb-2">Phiên bản</p>
            <div className="flex flex-wrap gap-2">
              {product.versions.map((version) => (
                <button
                  key={version.id}
                  onClick={() => setSelectedVersion(version)}
                  className={`px-4 py-3 border rounded-md transition-all ${
                    selectedVersion.id === version.id
                      ? "border-red-600 bg-red-50 text-red-600 font-medium"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {version.name}
                  <div className="text-sm mt-1">
                    {version.price.toLocaleString("vi-VN")}₫
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <p className="text-gray-900 font-bold mb-2">Màu sắc</p>
            <div className="flex flex-wrap gap-3">
              {product.colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color)}
                  className={`relative p-1 border-2 rounded-full transition-all ${
                    selectedColor.id === color.id
                      ? "border-red-600 scale-110"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  title={color.name}
                >
                  <div
                    className={`w-10 h-10 rounded-full bg-${color.value}`}
                  ></div>
                </button>
              ))}
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Đã chọn: {selectedColor.name}
            </p>
          </div>

          {/* Add to Cart Button */}
          <div className="flex items-center">
            <button
              onClick={handleAddToCart}
              className="flex w-full items-center justify-center rounded-lg bg-red-600 py-3 font-medium text-white transition-colors hover:bg-red-700"
            >
              <LiaCartPlusSolid className="mr-2 h-5 w-5" />
              Thêm vào giỏ hàng -{" "}
              {(selectedVersion.price * quantity).toLocaleString("vi-VN")}₫
            </button>
          </div>

          {/* Warranty & Authenticity */}
          <div className="mt-6 flex flex-wrap items-center justify-around border-t pt-4">
            <div className="mb-2 flex items-center md:mb-0">
              <img
                width={20}
                className="mr-2"
                src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/productdetailspage/2bcf834c40468ebcb90b.svg"
                alt="15 days free return"
              />
              <span className="text-sm">Đổi trả 15 ngày</span>
            </div>
            <div className="flex items-center">
              <img
                width={20}
                className="mr-2"
                src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/productdetailspage/511aca04cc3ba9234ab0.png"
                alt="100% Authentic"
              />
              <span className="text-sm">Hàng chính hãng</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications and Description */}
      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Specifications */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Thông số kỹ thuật
          </h2>
          <div className="space-y-3">
            <div className="flex border-b pb-2">
              <span className="w-1/3 font-medium text-gray-600">Màn hình:</span>
              <span className="w-2/3">{product.screen_size}</span>
            </div>
            <div className="flex border-b pb-2">
              <span className="w-1/3 font-medium text-gray-600">RAM:</span>
              <span className="w-2/3">{product.ram}</span>
            </div>
            <div className="flex border-b pb-2">
              <span className="w-1/3 font-medium text-gray-600">
                Bộ nhớ trong:
              </span>
              <span className="w-2/3">{product.rom}</span>
            </div>
            <div className="flex border-b pb-2">
              <span className="w-1/3 font-medium text-gray-600">Camera:</span>
              <span className="w-2/3">{product.camera}</span>
            </div>
            <div className="flex border-b pb-2">
              <span className="w-1/3 font-medium text-gray-600">Pin:</span>
              <span className="w-2/3">{product.battery}</span>
            </div>
            <div className="flex border-b pb-2">
              <span className="w-1/3 font-medium text-gray-600">Chipset:</span>
              <span className="w-2/3">{product.chipset}</span>
            </div>
            <div className="flex">
              <span className="w-1/3 font-medium text-gray-600">
                Hệ điều hành:
              </span>
              <span className="w-2/3">{product.operating_system}</span>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Mô tả sản phẩm
          </h2>
          <div className="prose max-w-none text-gray-700">
            <ProductDescription htmlContent={product.description} />
          </div>
        </div>
      </div>

{/* Reviews Section */}
      <div className="mt-12 bg-gray-50 py-6 px-4 rounded-md">
        <p className="text-xl font-bold mb-6">{`Đánh giá ${product.name}`}</p>
        
        {/* Rating Summary */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="text-center mr-6">
              <p className="text-5xl font-bold text-gray-900">{product.rating}</p>
              <p className="text-lg text-gray-500">trên 5</p>
            </div>
            <div>
              <StarRating rating={Math.floor(product.rating)} size="w-5 h-5" />
              <p className="mt-2 text-gray-600">333 lượt đánh giá</p>
            </div>
          </div>
          <div className="mt-6">
            <button 
              onClick={() => setIsReviewModalOpen(true)}
              className="bg-red-600 text-white hover:bg-red-700 px-6 py-3 rounded-lg transition-colors"
            >
              Viết đánh giá
            </button>
          </div>
        </div>

        {/* Comments List */}
        <div className="bg-white mt-6 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Đánh giá từ người dùng</h3>
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b pb-6 last:border-b-0">
                <div className="flex items-start">
                  <img 
                    src={comment.avatar} 
                    alt={comment.user}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{comment.user}</p>
                        <StarRating rating={comment.rating} />
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <IoTimeOutline className="mr-1" />
                        <span>Đã đánh giá vào {comment.date}</span>
                      </div>
                    </div>
                    
                    <p className="font-medium mt-2">{comment.title}</p>
                    
                    <p className={`mt-2 text-gray-700 ${expandedComment !== comment.id ? 'line-clamp-3' : ''}`}>
                      {comment.content}
                    </p>
                    
                    {comment.content.length > 150 && (
                      <button 
                        className="text-red-600 text-sm mt-1 hover:underline"
                        onClick={() => toggleCommentExpanded(comment.id)}
                      >
                        {expandedComment === comment.id ? 'Thu gọn' : 'Xem thêm'}
                      </button>
                    )}
                    
                    <div className="mt-2">
                      <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        {comment.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-xl font-bold">Viết đánh giá</h2>
              <button 
                onClick={() => setIsReviewModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleReviewSubmit} className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Đánh giá của bạn
                </label>
                <StarRating 
                  rating={reviewForm.rating} 
                  size="w-8 h-8" 
                  editable={true} 
                  onRatingChange={handleRatingChange}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề đánh giá
                </label>
                <input
                  type="text"
                  name="title"
                  value={reviewForm.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Nhập tiêu đề đánh giá"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung đánh giá
                </label>
                <textarea
                  name="content"
                  value={reviewForm.content}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                  required
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Gửi đánh giá
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


export default ProductDetail;
