import React from "react";
import Wrapper from "../../components/Wrapper";
import { Link } from "react-router-dom";

const Blog = () => {
  return (
    <Wrapper>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.from({ length: 7 }).map((_, idx) => (
          <Link key={idx} to={`/blog/${idx + 1}`} className="w-full">
            <div className="relative w-full aspect-[2.2/1] group overflow-hidden">
              <img
                src="/images/blog/blog.jpg"
                alt={`blog-${idx + 1}`}
                className="object-cover cursor-pointer shadow-sm hover:shadow-md transition "
              />
            </div>
          </Link>
        ))}
      </div>
    </Wrapper>
  );
};

export default Blog;
