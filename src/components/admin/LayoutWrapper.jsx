import React, { useState } from "react";
import { BiMenu, BiChevronRight } from "react-icons/bi";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";

// Breadcrumb component
const Breadcrumb = ({ items }) => {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center space-x-2 text-sm">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <BiChevronRight className="text-slate-400" size={16} />}
          {item.href ? (
            <button
              onClick={() => navigate(item.href)}
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-slate-600 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

// Hook to generate breadcrumb items based on current route
const useBreadcrumbs = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  // Define route mappings
  const routeMap = {
    ed: { label: "Admin", href: null },
    admin: { label: "Admin", href: null },
    home: { label: "Dashboard", href: "/ed/admin/home" },
    projects: { label: "Projects", href: "/ed/admin/projects" },
    users: { label: "Users", href: "/ed/admin/users" },
    settings: { label: "Settings", href: "/ed/admin/settings" },
    blogs: { label: "Blogs", href: "/ed/admin/blogs" },
    categories: { label: "Categories", href: "/ed/admin/categories" },
    homeSettings: { label: "Home Settings", href: "/ed/admin/home-settings" },
  };

  // Always start with Admin as home
  const breadcrumbs = [{ label: "Admin", href: "/ed/admin/home" }];

  // Build breadcrumbs from path segments
  let currentPath = "";
  pathSegments.forEach((segment, index) => {
    if (segment === "ed" || segment === "admin") return;

    currentPath += `/${segment}`;
    const fullPath = `/ed/admin${currentPath}`;

    const routeInfo = routeMap[segment];
    if (routeInfo) {
      breadcrumbs.push({
        label: routeInfo.label,
        href: index === pathSegments.length - 1 ? null : fullPath,
      });
    } else {
      // Check if segment is a MongoDB ID (24 hex characters)
      const isMongoId = /^[0-9a-fA-F]{24}$/.test(segment);

      let label = segment.charAt(0).toUpperCase() + segment.slice(1);

      if (isMongoId) {
        // Look at the previous breadcrumb to determine context
        const prevLabel = breadcrumbs[breadcrumbs.length - 1]?.label;
        if (prevLabel === "Projects") {
          label = "Project Details";
        } else if (prevLabel === "Blogs") {
          label = "Blog Details";
        } else {
          label = "Details";
        }
      }

      breadcrumbs.push({
        label: label,
        href: index === pathSegments.length - 1 ? null : fullPath,
      });
    }
  });

  // Get page title (last breadcrumb)
  const pageTitle =
    breadcrumbs.length > 1
      ? breadcrumbs[breadcrumbs.length - 1].label
      : "Dashboard";

  return { breadcrumbs, pageTitle };
};

const MainContent = ({ setIsOpen, children }) => {
  const { breadcrumbs, pageTitle } = useBreadcrumbs();
  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Fixed Top Bar with Breadcrumb */}
      <header className="fixed top-0 right-0 left-0 lg:left-64 bg-white border-b border-slate-200 px-4 sm:px-6 py-4 z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsOpen(true)}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <BiMenu size={24} />
          </button>
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-1">
              {pageTitle}
            </h2>
            <Breadcrumb items={breadcrumbs} />
          </div>
        </div>
      </header>

      {/* Main Content Area - Scrollable with padding for fixed header */}
      <main className="flex-1 overflow-y-auto bg-slate-50 pt-[88px] lg:pt-[88px]">
        <div className="p-4 sm:p-6">{children}</div>
      </main>
    </div>
  );
};

export const LayoutWrapper = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <MainContent setIsOpen={setIsSidebarOpen}>{children}</MainContent>
    </div>
  );
};

export default LayoutWrapper;
