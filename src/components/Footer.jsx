import React from "react";
import { IoLogoInstagram, IoLogoLinkedin } from "react-icons/io";
import { IoLogoFacebook } from "react-icons/io5";

const Footer = () => {
  return (
    <div className="z-50 text-neutral-500 fixed bottom-0 w-full bg-ed-light-gray">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2 sm:gap-4 sm:py-5 py-2 mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl text-center md:text-left">
        {/* Copyright */}
        <div className="text-sm">
          © 2025 ED Architects. All rights reserved
        </div>

        {/* Social Icons */}
        <div className="flex gap-4">
          <IoLogoLinkedin
            size={26}
            className="cursor-pointer hover:text-blue-700 transition"
          />
          <IoLogoInstagram
            size={26}
            className="cursor-pointer hover:text-pink-600 transition"
          />
          <IoLogoFacebook
            size={26}
            className="cursor-pointer hover:text-blue-600 transition"
          />
        </div>
      </div>
    </div>
  );
};

export default Footer;
