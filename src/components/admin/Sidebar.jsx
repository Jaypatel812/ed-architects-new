import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiBarChart, BiCategoryAlt, BiHome } from "react-icons/bi";
import { FcCancel } from "react-icons/fc";
import { useNavigate, useLocation } from "react-router-dom";
import { GoProjectRoadmap } from "react-icons/go";
import { LuLogOut } from "react-icons/lu";

// Hook to detect if screen is desktop size (>= 1024px)
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isDesktop;
}

export const Sidebar = ({ isOpen, setIsOpen }) => {
  const isDesktop = useIsDesktop();
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(null);

  const menuItems = [
    { icon: BiCategoryAlt, label: "Categories", href: "/ed/admin/categories" },
    { icon: GoProjectRoadmap, label: "Projects", href: "/ed/admin/projects" },
    { icon: GoProjectRoadmap, label: "Blog", href: "/ed/admin/blogs" },
  ];

  const handleNavigation = (href) => {
    navigate(href);
    if (!isDesktop) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      setUserData(user);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    navigate("/ed/admin/login");
    setIsOpen(false);
  };

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {!isDesktop && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isDesktop ? 0 : isOpen ? 0 : -320,
          transition: { type: "spring", stiffness: 300, damping: 30 },
        }}
        className={`${
          isDesktop ? "relative" : "fixed"
        } top-0 left-0 h-screen w-64 bg-linear-to-b from-slate-900 to-slate-800 text-white z-50 shadow-2xl shrink-0`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <h1 className="text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              MyApp
            </h1>
            {!isDesktop && (
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <FcCancel size={20} />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    onClick={() => handleNavigation(item.href)}
                    className={`w-full flex items-center cursor-pointer gap-3 px-4 py-3 rounded-lg hover:bg-slate-700/50 transition-all group ${
                      location.pathname === item.href ? "bg-slate-700" : ""
                    }`}
                  >
                    <item.icon
                      size={20}
                      className="text-slate-400 group-hover:text-blue-400 transition-colors"
                    />
                    <span className="font-medium group-hover:text-white transition-colors">
                      {item.label}
                    </span>
                  </button>
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-sm font-bold">
                {userData?.name?.split(" ")?.map((name) => name[0])}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{userData?.name}</p>
                {/* <p className="text-xs text-slate-400">{userData?.email}</p> */}
              </div>
              <div>
                <LuLogOut
                  className="cursor-pointer"
                  size={20}
                  onClick={handleLogout}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
