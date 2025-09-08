import React from "react";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

const slideImages = [
    {
        url: "https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/iphone-16-pro-max-cate-0925.png"
    },
    {
        url: "https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/galaxy-z7-cate-0825-v3.png",
    },

    {
        url: "https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/iphone-16-pro-max-cate-0925.png",
    },
];

const Banner = () => {
    return (
        <div className=" slide-container overflow-hidden px-4 sm:px-6 lg:px-8 py-4">
            <Slide>
                {slideImages.map((slideImage, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-center md:h-320 h-40 lg:h-60  w-full  bg-cover bg-center"
                    >
                        <img
                            src={slideImage.url}
                            alt={`Slide ${index}`}
                            className="h-[200px] w-full rounded-xl object-cover "
                        />
                    </div>
                ))}
            </Slide>
        </div>
    );
};

export default Banner;
