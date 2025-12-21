import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./app/web/Home";
import AboutUs from "./app/web/AboutUs";
import Blog from "./app/web/Blog";
import Projects from "./app/web/Projects";
import ProjectList from "./app/admin/Projects";
import ProjectDetail from "./app/web/ProjectDetail";
import BlogDetail from "./app/web/BlogDetail";
import ContactUs from "./app/web/ContactUs";
import Login from "./app/admin/Login";
import { LayoutWrapper } from "./components/admin/LayoutWrapper";
import { Toaster } from "react-hot-toast";
import { ProtectedRoute, PublicRoute } from "./components/admin/AuthWrapper";
import Categories from "./app/admin/Categories";
import AddNewProject from "./components/admin/AddNewProject";

export default function App() {
  return (
    <div>
      <Toaster toastOptions={{ duration: 2000 }} />
      <Router>
        <Routes>
          {/* Public Web Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/contact-us" element={<ContactUs />} />

          {/* Admin Public Routes (Login) */}
          <Route element={<PublicRoute />}>
            <Route path="/ed/admin/login" element={<Login />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/ed/admin/home" element={<LayoutWrapper />} />
            <Route
              path="/ed/admin/projects"
              element={
                <LayoutWrapper>
                  <ProjectList />
                </LayoutWrapper>
              }
            />
            <Route
              path="/ed/admin/projects/new"
              element={
                <LayoutWrapper>
                  <AddNewProject />
                </LayoutWrapper>
              }
            />
            <Route
              path="/ed/admin/categories"
              element={
                <LayoutWrapper>
                  <Categories />
                </LayoutWrapper>
              }
            />
            <Route path="/ed/admin/analytics" element={<LayoutWrapper />} />
          </Route>

          {/* 404 Route */}
          <Route
            path="*"
            element={
              <div className="text-2xl font-semibold h-screen flex flex-col items-center justify-center">
                <div className="text-red-500">404</div>
                <div>Page Not Found</div>
              </div>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}
