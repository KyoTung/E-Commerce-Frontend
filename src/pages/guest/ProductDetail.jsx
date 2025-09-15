import React, { useState } from "react";
import { LiaCartPlusSolid } from "react-icons/lia";
import { FaStar } from "react-icons/fa";
import "../../App.css"

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
};

const ProductDetail = () => {
  const [selectedImage, setSelectedImage] = useState(product.img_url);
  const [quantity, setQuantity] = useState(1);

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
    // Logic thêm vào giỏ hàng
    console.log("Thêm vào giỏ hàng:", product.name, "Số lượng:", quantity);
  };

  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const ProductDescription = ({ htmlContent }) => {
    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg px-10 border">
            <img
              src={selectedImage}
              alt={product.name}
              className="h-full w-full object-contain p-5"
              loading="lazy"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {productImages.map((productImage) => (
              <button
                key={productImage.id}
                onClick={() => setSelectedImage(productImage.image_url)}
                className={`h-20 min-w-[80px] rounded border-2 transition-colors ${
                  selectedImage === productImage.image_url
                    ? "border-red-600"
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
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating)
                      ? "fill-current"
                      : "text-gray-300"
                  }`}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              ({product.rating})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center">
            <span className="text-2xl font-bold text-red-600">
              {product.price.toLocaleString("vi-VN")}₫
            </span>
            {product.discount > 0 && (
              <span className="ml-3 text-lg text-gray-500 line-through">
                {Math.round(
                  product.price / (1 - product.discount / 100)
                ).toLocaleString("vi-VN")}
                ₫
              </span>
            )}
          </div>
          <div>
            <p className="text-gray-900 font-bold">Phiên bản</p>
            <div className="flex">
              <a className="px-7 py-4 border rounded-md">128GB</a>
              <a className="px-7 py-4 border rounded-md ml-5">256GB</a>
            </div>
          </div>
          <div>
            <p className="text-gray-900 font-bold">Màu sắc</p>
            <div className="flex">
              <a className="px-6 py-3 border rounded-md bg-blue-600 hover:scale-105"></a>
              <a className="px-6 py-3 border rounded-md ml-5 bg-black hover:scale-105"></a>
              <a className="px-6 py-3 border rounded-md ml-5 bg-pink-300 hover:scale-105"></a>
              <a className="px-6 py-3 border rounded-md ml-5 bg-yellow-300 hover:scale-105"></a>
              <a className="px-6 py-3 border rounded-md ml-5 bg-purple-300 hover:scale-105"></a>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="flex items-center">
            <button
              onClick={handleAddToCart}
              className="flex w-full items-center justify-center rounded-lg bg-red-600 py-3 font-medium text-white transition-colors hover:bg-red-700"
            >
              <LiaCartPlusSolid className="mr-2 h-5 w-5" />
              Thêm vào giỏ hàng
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

      {/* Specifications and Description - Placed side by side */}
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

      <div className="grid mt-12 bg-slate-50 py-8 px-4 rounded-md">
        <p className="text-lg font-bold ">{`Đánh giá ${product.name}`}</p>
        <div className="bg-white px-20 py-10">
          <div className="flex">
            <p className="text-6xl font/bold ">{product.rating}</p>
            <p className="text-5xl opacity-70">/5</p>
          </div>
          <div>
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={
                    i < Math.floor(product.rating)
                      ? "w-4 h-4 fill-current mx-1"
                      : "w-4 h-4 text-gray-300 mx-1"
                  }
                />
              ))}
            </div>
          </div>
          <div className="mt-5">
            <p className="text-gray-900">333 lượt đánh giá</p>
          </div>
          <div className="mt-5">
            <button className="bg-red-600 text-white hover:bg-red-700 px-6 py-3 rounded-lg">Viết đánh giá</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
