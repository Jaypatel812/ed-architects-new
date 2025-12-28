import React, { useEffect, useState } from "react";
import Wrapper from "../../components/Wrapper";
import { Link } from "react-router-dom";
import { useGetBlogsMutation } from "../../redux/api/edApi";
import { LuLoaderCircle } from "react-icons/lu";

const Blog = () => {
  const [getBlogs, { isLoading }] = useGetBlogsMutation();
  const [blogs, setBlogs] = useState([]);
  const fetchBlogs = async () => {
    try {
      const res = await getBlogs().unwrap();
      if (res.success) {
        setBlogs(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);
  return (
    <Wrapper>
      {isLoading ? (
        <div className="flex h-96 items-center justify-center">
          <LuLoaderCircle size={24} className="animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {blogs?.length > 0 ? (
            blogs?.map((blog, idx) => (
              <Link key={idx} to={`/blog/${blog._id}`} className="w-full">
                <div className="relative w-full aspect-[2.2/1] group overflow-hidden">
                  <img
                    src="/images/blog/blog.jpg"
                    alt={`blog-${idx + 1}`}
                    className="object-cover cursor-pointer group-hover:opacity-70 transition-opacity shadow-sm hover:shadow-md"
                  />

                  {/* Overlay text */}
                  <div
                    className="absolute bottom-0 left-0 w-full h-full
                                      bg-[#FFFFFF91] text-black text-sm p-2 
                                      opacity-0 group-hover:opacity-100 
                                      transition-opacity flex flex-col items-center justify-end duration-1000 ease-in-out"
                  >
                    <div>{blog.title}</div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="flex col-span-3 h-96 items-center justify-center">
              No blogs found
            </div>
          )}
        </div>
      )}
    </Wrapper>
  );
};

export default Blog;
