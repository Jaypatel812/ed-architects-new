import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Wrapper = ({ children }) => {
  return (
    <div>
      <Header />
      <div className="max-w-7xl text-sm mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Wrapper;
