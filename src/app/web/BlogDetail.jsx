import React, { useEffect, useState, useRef } from "react";
import Wrapper from "../../components/Wrapper";
import { useParams } from "react-router-dom";
import {
  useGetBlogByIdMutation,
  useGetBlogsMutation,
} from "../../redux/api/edApi";
import { LuLoaderCircle } from "react-icons/lu";
import { Navigation, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { IMAGE_BASE_URL } from "../../config/constant";

const BlogDetail = () => {
  const { id } = useParams();
  const [getblogById, { isLoading }] = useGetBlogByIdMutation();
  const [blogDetail, setBlogDetail] = useState(null);
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);
  const swiperRef = useRef(null);

  const fetchBlogDetail = async () => {
    try {
      const res = await getblogById(id).unwrap();
      if (res.success) {
        setBlogDetail(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch blog details", error);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchBlogDetail();
  }, [id]);
  return (
    <Wrapper>
      {isLoading ? (
        <div className="flex h-96 items-center justify-center">
          <LuLoaderCircle size={24} className="animate-spin" />
        </div>
      ) : (
        <div className="space-y-10 text-neutral-500">
          {/* Blog Image */}
          {blogDetail?.images?.length > 1 ? (
            <div className="w-full max-w-4xl mx-auto aspect-video relative shadow-md group">
              <Swiper
                loop={true}
                modules={[Navigation, Autoplay]}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
                navigation={{ prevEl, nextEl }}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                className="h-full w-full"
              >
                {blogDetail.images.map((img, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={IMAGE_BASE_URL + img}
                      alt={`blog-${index}`}
                      className="w-full h-full object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Navigation Buttons */}
              <button
                ref={(node) => setPrevEl(node)}
                className="absolute z-10 cursor-pointer left-3 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-gray-900 text-white p-2 rounded-full transition"
              >
                <IoChevronBack size={20} />
              </button>
              <button
                ref={(node) => setNextEl(node)}
                className="absolute z-10 cursor-pointer right-3 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-gray-900 text-white p-2 rounded-full transition"
              >
                <IoChevronForward size={20} />
              </button>
            </div>
          ) : (
            <img
              src={
                blogDetail?.images?.[0]
                  ? IMAGE_BASE_URL + blogDetail.images[0]
                  : "/images/blog/blog.jpg"
              }
              alt="blog"
              className="w-full max-w-4xl mx-auto aspect-video object-cover shadow-md"
              width={800}
              height={800}
              priority="true"
            />
          )}

          {/* Blog Content */}
          <div className="space-y-6">
            <div className="text-center font-bold text-xl sm:text-2xl md:text-3xl leading-snug">
              {blogDetail?.title}
            </div>

            <div className="space-y-4 text-justify leading-relaxed text-gray-700">
              {blogDetail?.description.map((item, idx) => (
                <p key={idx}>{item}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </Wrapper>
  );
};

export default BlogDetail;
