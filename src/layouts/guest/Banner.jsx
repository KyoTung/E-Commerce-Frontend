// import React from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";

// // --- DỮ LIỆU GIẢ LẬP (Thay bằng ảnh thật của bạn) ---
// const mainSlides = [
//   "https://www.didongmy.com/vnt_upload/weblink/iphone-17-series-didongmy-banner.jpg",
//   "https://cdn2.cellphones.com.vn/insecure/rs:fill:1036:450/q:100/plain/https://media-asset.cellphones.com.vn/dashboard-v1/manage-banner/Oppofin%20x9%20ultra_oppen-home.png",
//   "https://cdn-media.sforum.vn/storage/app/media/haianh/xiaomi-17-pro-pro-max-lo-dien-thumb.jpg",
// ];

// const rightBanners = [
//   "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:10/plain/https://dashboard.cellphones.com.vn/storage/ipad-pro-m4-right-banner.jpg",
//   "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:10/plain/https://dashboard.cellphones.com.vn/storage/watch-ultra-2-right-banner.jpg",
//   "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:10/plain/https://dashboard.cellphones.com.vn/storage/airpods-4-right-banner.jpg",
// ];

// const bottomStrip = [
//   "https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:100/plain/https://dashboard.cellphones.com.vn/storage/S25-fe--Cate-1225.png",
//   "https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:100/plain/https://dashboard.cellphones.com.vn/storage/oppo-reno14-cate-1-0925.png",
// ];

// const HeroBanner = () => {
//   return (
//     <div className="bg-white pb-6 pt-4">
//       <div className="mx-auto max-w-[1200px] px-2 sm:px-4">
//         {/* --- PHẦN 1: SLIDER CHÍNH (FULL WIDTH) --- */}
//         <div className="w-full overflow-hidden rounded-xl shadow-md group relative mb-3">
//           <Swiper
//             loop={true}
//             autoplay={{ delay: 4000, disableOnInteraction: false }}
//             pagination={{
//               clickable: true,
//               bulletClass:
//                 "swiper-pagination-bullet bg-white opacity-60 hover:opacity-100",
//               bulletActiveClass:
//                 "swiper-pagination-bullet-active !bg-white !opacity-100 !w-8 rounded-full transition-all",
//             }}
//             navigation={true}
//             modules={[Autoplay, Pagination, Navigation]}
//             className="w-full h-[180px] sm:h-[300px] lg:h-[450px]"
//           >
//             {mainSlides.map((img, idx) => (
//               <SwiperSlide key={idx}>
//                 <a href="#" className="block w-full h-full">
//                   <img
//                     src={img}
//                     alt="Hero Banner"
//                     className="w-full h-full object-cover"
//                   />
//                 </a>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </div>

//         <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
//           {bottomStrip.map((img, idx) => (
//             <a
//               key={idx}
//               href="#"
//               className="block overflow-hidden rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
//             >
//               <img
//                 src={img}
//                 alt="Promotion"
//                 className="w-full h-full object-cover"
//               />
//             </a>
//           ))}
//         </div>
//       </div>

//       <style>{`
//         .swiper-button-next, .swiper-button-prev {
//           color: white;
//           background-color: rgba(0,0,0,0.2);
//           backdrop-filter: blur(2px);
//           width: 44px;
//           height: 44px;
//           border-radius: 50%;
//           font-size: 12px;
//           opacity: 0; /* Ẩn mặc định */
//           transition: all 0.3s ease;
//         }
//         .swiper-button-next:after, .swiper-button-prev:after {
//           font-size: 20px;
//           font-weight: bold;
//         }
//         .swiper-button-next:hover, .swiper-button-prev:hover {
//           background-color: rgba(215, 0, 24, 0.8); 
//         }
       
//         .group:hover .swiper-button-next,
//         .group:hover .swiper-button-prev {
//           opacity: 1;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default HeroBanner;


import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import axiosClient from "../../api/axiosClient";
import Loading from "../../components/Loading"

const HeroBanner = () => {
  const [banners, setBanners] = useState({
    top: [],
    bottomLeft: [],
    bottomRight: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axiosClient.get("/banner");
        const allBanners = response.data; // Mảng các banner active
        // Phân loại theo position
        const topBanners = allBanners.filter((b) => b.position === "top");
        const bottomLeftBanners = allBanners.filter((b) => b.position === "bottom-left");
        const bottomRightBanners = allBanners.filter((b) => b.position === "bottom-right");
        setBanners({
          top: topBanners,
          bottomLeft: bottomLeftBanners,
          bottomRight: bottomRightBanners,
        });
      } catch (error) {
        console.error("Lỗi tải banner:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  if (loading) return <div className="h-64 flex items-center justify-center"><Loading /></div>;
  if (banners.top.length === 0 && banners.bottomLeft.length === 0 && banners.bottomRight.length === 0)
    return null;

  return (
    <div className="bg-white pb-6 pt-4">
      <div className="mx-auto max-w-[1200px] px-2 sm:px-4">
        {/* Slider chính - vị trí top */}
        {banners.top.length > 0 && (
          <div className="w-full overflow-hidden rounded-xl shadow-md group relative mb-3">
            <Swiper
              loop={true}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              pagination={{
                clickable: true,
                bulletClass:
                  "swiper-pagination-bullet bg-white opacity-60 hover:opacity-100",
                bulletActiveClass:
                  "swiper-pagination-bullet-active !bg-white !opacity-100 !w-8 rounded-full transition-all",
              }}
              navigation={true}
              modules={[Autoplay, Pagination, Navigation]}
              className="w-full h-[180px] sm:h-[300px] lg:h-[450px]"
            >
              {banners.top.map((banner) => (
                <SwiperSlide key={banner._id}>
                  <a href={banner.link || "#"} className="block w-full h-full">
                    <img
                      src={banner.image.url}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {/* Hai banner dưới (bottom-left và bottom-right) */}
        {(banners.bottomLeft.length > 0 || banners.bottomRight.length > 0) && (
          <div className="grid grid-cols-2 gap-3">
            {banners.bottomLeft.slice(0, 1).map((banner) => (
              <a
                key={banner._id}
                href={banner.link || "#"}
                className="block overflow-hidden rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <img
                  src={banner.image.url}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
              </a>
            ))}
            {banners.bottomRight.slice(0, 1).map((banner) => (
              <a
                key={banner._id}
                href={banner.link || "#"}
                className="block overflow-hidden rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <img
                  src={banner.image.url}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
              </a>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .swiper-button-next, .swiper-button-prev {
          color: white;
          background-color: rgba(0,0,0,0.2);
          backdrop-filter: blur(2px);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          font-size: 12px;
          opacity: 0;
          transition: all 0.3s ease;
        }
        .swiper-button-next:after, .swiper-button-prev:after {
          font-size: 20px;
          font-weight: bold;
        }
        .swiper-button-next:hover, .swiper-button-prev:hover {
          background-color: rgba(215, 0, 24, 0.8);
        }
        .group:hover .swiper-button-next,
        .group:hover .swiper-button-prev {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default HeroBanner;