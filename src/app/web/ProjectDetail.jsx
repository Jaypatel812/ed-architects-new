import React, { useEffect, useState, useRef } from "react";
import Wrapper from "../../components/Wrapper";
import { useParams } from "react-router-dom";
import { useGetProjectByIdMutation } from "../../redux/api/edApi";
import { LuLoaderCircle } from "react-icons/lu";
import { Navigation, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { IoChevronBack, IoChevronForward, IoClose } from "react-icons/io5";
import { IMAGE_BASE_URL } from "../../config/constant";

const ProjectDetail = () => {
  const { id } = useParams();
  const [getProjectById, { isLoading }] = useGetProjectByIdMutation();
  const [projectDetail, setProjectDetail] = useState(null);
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);
  const swiperRef = useRef(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [initialSlide, setInitialSlide] = useState(0);
  const [fsPrevEl, setFsPrevEl] = useState(null);
  const [fsNextEl, setFsNextEl] = useState(null);

  const openFullScreen = (index) => {
    setInitialSlide(index);
    setIsFullScreen(true);
  };

  const fetchProjectDetail = async () => {
    try {
      const res = await getProjectById(id).unwrap();
      if (res.success) {
        setProjectDetail(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch project details", error);
    }
  };

  useEffect(() => {
    fetchProjectDetail();
  }, [id]);

  useEffect(() => {
    if (isFullScreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isFullScreen]);

  return (
    <Wrapper>
      {isLoading ? (
        <div className="flex h-96 items-center justify-center">
          <LuLoaderCircle size={24} className="animate-spin" />
        </div>
      ) : (
        <div className="space-y-10 text-neutral-500">
          {/* Project Image */}
          {projectDetail?.images?.length > 1 ? (
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
                onClick={(swiper) => openFullScreen(swiper.realIndex)}
                className="h-full w-full cursor-pointer"
              >
                {projectDetail.images.map((img, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={IMAGE_BASE_URL + img}
                      alt={`project-${index}`}
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
                projectDetail?.images?.[0]
                  ? IMAGE_BASE_URL + projectDetail.images[0]
                  : "/images/projects/project.jpeg"
              }
              alt="project"
              className="w-full max-w-4xl mx-auto aspect-video object-cover shadow-md cursor-pointer"
              onClick={() => openFullScreen(0)}
              width={800}
              height={800}
              priority="true"
            />
          )}

          {/* Project Content */}
          <div className="space-y-6">
            <div className="text-center font-bold text-xl sm:text-2xl md:text-3xl leading-snug">
              {projectDetail?.title}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 justify-between gap-2">
              <div>Location: {projectDetail?.location}</div>
              <div>Client: {projectDetail?.client}</div>
              <div>Built Up Area: {projectDetail?.builtUpArea || "N/A"}</div>
              <div>Site Area: {projectDetail?.siteArea || "N/A"}</div>
            </div>
            <div className="space-y-4 text-justify leading-relaxed text-gray-700">
              {projectDetail?.description.map((item, idx) => (
                <p key={idx}>{item}</p>
              ))}
            </div>
          </div>

          {/* Full Screen Image Slider */}
          {isFullScreen && (
            <div className="fixed inset-0 z-[100] bg-black bg-opacity-95 flex items-center justify-center p-4">
              <button
                onClick={() => setIsFullScreen(false)}
                className="absolute top-5 right-5 text-white hover:text-gray-300 transition-colors z-[110]"
              >
                <IoClose size={30} className="cursor-pointer" />
              </button>

              {/* Custom Navigation Buttons */}
              <button
                ref={(node) => setFsPrevEl(node)}
                className="absolute z-[110] cursor-pointer left-5 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-gray-900 text-white p-3 rounded-full transition"
              >
                <IoChevronBack size={24} />
              </button>
              <button
                ref={(node) => setFsNextEl(node)}
                className="absolute z-[110] cursor-pointer right-5 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-gray-900 text-white p-3 rounded-full transition"
              >
                <IoChevronForward size={24} />
              </button>

              <Swiper
                initialSlide={initialSlide}
                loop={true}
                navigation={{ prevEl: fsPrevEl, nextEl: fsNextEl }}
                modules={[Navigation]}
                className="w-full h-full"
              >
                {projectDetail?.images?.map((img, index) => (
                  <SwiperSlide
                    key={index}
                    className="flex items-center justify-center"
                  >
                    <img
                      src={IMAGE_BASE_URL + img}
                      alt={`project-fullscreen-${index}`}
                      className="w-full h-full object-contain"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>
      )}
    </Wrapper>
  );
};

export default ProjectDetail;
