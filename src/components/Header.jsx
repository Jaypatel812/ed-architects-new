import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineMenu } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const path = useLocation();

  // Prevent background scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  return (
    <div className="fixed z-50 w-full bg-ed-light-gray py-3 h-20">
      <div className="flex w-full max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto justify-between items-center ">
        {/* Logo */}
        <Link to="/">
          <img
            src="/images/EDArchitectsLogo.svg"
            alt="Logo"
            width={75}
            height={100}
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 text-sm text-neutral-500 ">
          <Link
            to="/about-us"
            className={
              path.pathname.includes("/about-us") ? "text-black font-semibold" : ""
            }
          >
            About Us
          </Link>
          <Link
            to="/projects"
            className={
              path.pathname.includes("/projects") ? "text-black font-semibold" : ""
            }
          >
            Projects
          </Link>
          <Link
            to="/blog"
            className={path.pathname.includes("/blog") ? "text-black font-semibold" : ""}
          >
            Blog
          </Link>
          <Link
            to="/contact-us"
            className={
              path.pathname.includes("/contact-us") ? "text-black font-semibold" : ""
            }
          >
            Contact Us
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-200 transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <RxCross2 size={24} /> : <HiOutlineMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
            className="absolute top-full left-0 w-full bg-ed-light-gray  md:hidden"
          >
            <div className="flex flex-col items-center gap-6 py-6 font-semibold shadow-lg">
              <Link to="/about-us" onClick={() => setIsOpen(false)}>
                About Us
              </Link>
              <Link to="/projects" onClick={() => setIsOpen(false)}>
                Projects
              </Link>
              <Link to="/blog" onClick={() => setIsOpen(false)}>
                Blog
              </Link>
              <Link to="/contact-us" onClick={() => setIsOpen(false)}>
                Contact Us
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Header;
