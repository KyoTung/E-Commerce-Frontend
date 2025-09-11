import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const slideImages = [
  {
    url: "https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/iphone-16-pro-max-cate-0925.png",
  },
  {
    url: "https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/galaxy-z7-cate-0825-v3.png",
  },
  {
    url: "https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/iphone-16-pro-max-cate-0925.png",
  },
  {
    url: "https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:100/plain/https://dashboard.cellphones.com.vn/storage/xiaomi-redmi-note-14-cate-0825.png"
  },
  {
   url:"https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:100/plain/https://dashboard.cellphones.com.vn/storage/oppo-reno14-cate-1-0925.png"
  }
];

const Banner = () => {
  return (
    <div className="slide-container overflow-hidden px-4 sm:px-2 lg:px-4 py-8 max-w-screen-xl mx-auto">
      <Swiper
        spaceBetween={20}
        loop={true}
        autoplay={{ delay: 3000 }}
        modules={[Autoplay]}
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
          1024: {
            slidesPerView: 2,
          },
        }}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}
      >
        {slideImages.map((slideImage, index) => (
          <SwiperSlide key={index}>
            <a href="#">
              <div className="flex items-center justify-center sm:h-14 md:h-32 lg:h-24 bg-cover bg-center shadow-sm border rounded-s-md">
              <img
                src={slideImage.url}
                alt={`Slide ${index}`}
                className="h-full w-full rounded-xl object-cover"
              />
            </div>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;
