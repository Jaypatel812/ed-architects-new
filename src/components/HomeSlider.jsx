import React, { useRef, useEffect } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { IMAGE_BASE_URL } from "../config/constant";

const HomeSlider = ({ carouselData }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  useEffect(() => {
    if (
      swiperRef.current &&
      prevRef.current &&
      nextRef.current &&
      swiperRef.current.params.navigation
    ) {
      // re-assign navigation buttons
      swiperRef.current.params.navigation.prevEl = prevRef.current;
      swiperRef.current.params.navigation.nextEl = nextRef.current;

      // re-init navigation
      swiperRef.current.navigation.destroy();
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, []);

  return (
    <div className="w-full relative">
      <Swiper
        loop={true}
        modules={[Navigation]}
        spaceBetween={20}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        className="mySwiper"
      >
        {carouselData?.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={IMAGE_BASE_URL + image}
              className="w-full h-[40vh] sm:h-[60vh] lg:h-[80vh] object-cover"
              width={1920}
              height={1080}
              alt={`Banner ${index + 1}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <button
        ref={prevRef}
        className="absolute z-10 cursor-pointer left-3 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-gray-900 text-white p-2 rounded-full transition"
      >
        <IoChevronBack size={20} />
      </button>
      <button
        ref={nextRef}
        className="absolute z-10 cursor-pointer right-3 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-gray-900 text-white p-2 rounded-full transition"
      >
        <IoChevronForward size={20} />
      </button>
    </div>
  );
};

export default HomeSlider;
