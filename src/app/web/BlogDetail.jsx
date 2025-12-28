import React, { useEffect, useState } from "react";
import Wrapper from "../../components/Wrapper";
import { useParams } from "react-router-dom";
import {
  useGetBlogByIdMutation,
  useGetBlogsMutation,
} from "../../redux/api/edApi";
import { LuLoaderCircle } from "react-icons/lu";

const BlogDetail = () => {
  const { id } = useParams();
  const [getblogById, { isLoading }] = useGetBlogByIdMutation();
  const [blogDetail, setBlogDetail] = useState(null);

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
          <img
            src="/images/blog/blog.jpg"
            alt="blog"
            className="w-full max-w-4xl mx-auto aspect-video object-cover shadow-md"
            width={800}
            height={800}
            priority="true"
          />

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
