import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// --- DỮ LIỆU GIẢ LẬP (Thay bằng ảnh thật của bạn) ---
const mainSlides = [
  "https://www.didongmy.com/vnt_upload/weblink/iphone-17-series-didongmy-banner.jpg",
  "https://www.samsungmobilepress.com/file/AE353E7F3A8F479FA2F9A60DD7926B5FABAD0BA885D4B7AEB8032B2132151E2E4C996F6B8D6302154FCDAE2B9CE00488C847A80A12B3A30AEF3010A0AA0A201B8F1997D92477CDD96573663B37DB40293C9CCB396457457ADCE7E79BE432DBC0F88886474B7A1217A7C6C3F1C4A955B79D6F83846BBB748AD0EF09125D4A62B78A08F32D9512E8401202623C6B547207",
  "https://cdn-media.sforum.vn/storage/app/media/haianh/xiaomi-17-pro-pro-max-lo-dien-thumb.jpg"
];

const rightBanners = [
  "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:10/plain/https://dashboard.cellphones.com.vn/storage/ipad-pro-m4-right-banner.jpg",
  "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:10/plain/https://dashboard.cellphones.com.vn/storage/watch-ultra-2-right-banner.jpg",
  "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:10/plain/https://dashboard.cellphones.com.vn/storage/airpods-4-right-banner.jpg",
];

const bottomStrip = [
  "https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:100/plain/https://dashboard.cellphones.com.vn/storage/iphone-17-pro-max-bac-1225-cate.png",
  "https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:100/plain/https://dashboard.cellphones.com.vn/storage/S25-fe--Cate-1225.png",
  "https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:100/plain/https://dashboard.cellphones.com.vn/storage/xiaomi-redmi-note-14-cate-0825.png",
  "https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:100/plain/https://dashboard.cellphones.com.vn/storage/oppo-reno14-cate-1-0925.png",
];


const HeroBanner = () => {
  return (
    <div className="bg-white pb-6 pt-4">
      <div className="mx-auto max-w-[1200px] px-2 sm:px-4">
        
        {/* --- PHẦN 1: SLIDER CHÍNH (FULL WIDTH) --- */}
        <div className="w-full overflow-hidden rounded-xl shadow-md group relative mb-3">
          <Swiper
            loop={true}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ 
              clickable: true,
              bulletClass: "swiper-pagination-bullet bg-white opacity-60 hover:opacity-100",
              bulletActiveClass: "swiper-pagination-bullet-active !bg-white !opacity-100 !w-8 rounded-full transition-all"
            }}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
          
            className="w-full h-[180px] sm:h-[300px] lg:h-[450px]" 
          >
            {mainSlides.map((img, idx) => (
              <SwiperSlide key={idx}>
                <a href="#" className="block w-full h-full">
                  <img 
                    src={img} 
                    alt="Hero Banner" 
                    className="w-full h-full object-cover" 
                  />
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

    
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
           {bottomStrip.map((img, idx) => (
              <a key={idx} href="#" className="block overflow-hidden rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                 <img 
                   src={img} 
                   alt="Promotion" 
                   className="w-full h-full object-cover"
                 />
              </a>
           ))}
        </div>

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
          opacity: 0; /* Ẩn mặc định */
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