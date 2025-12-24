// redux/services/otherApi.ts

import { baseApi } from "./baseApi";

export const edApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.mutation({
      query: () => ({
        url: "/categories",
        method: "GET",
      }),
    }),
    addCategory: builder.mutation({
      query: (body) => ({
        url: "/categories",
        method: "POST",
        body,
      }),
    }),
    updateCategory: builder.mutation({
      query: (body) => ({
        url: `/categories/${body._id}`,
        method: "PUT",
        body,
      }),
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
    }),
    getProjects: builder.mutation({
      query: () => ({
        url: "/projects",
        method: "GET",
      }),
    }),
    getProjectById: builder.mutation({
      query: (id) => ({
        url: `/projects/${id}`,
        method: "GET",
      }),
    }),
    addProject: builder.mutation({
      query: (body) => ({
        url: "/projects",
        method: "POST",
        body,
      }),
    }),
    updateProject: builder.mutation({
      query: (body) => ({
        url: `/projects/${body._id}`,
        method: "PUT",
        body,
      }),
    }),
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/projects/${id}`,
        method: "DELETE",
      }),
    }),
    getBlogs: builder.mutation({
      query: () => ({
        url: "/blogs",
        method: "GET",
      }),
    }),
    getBlogById: builder.mutation({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: "GET",
      }),
    }),
    addBlog: builder.mutation({
      query: (body) => ({
        url: "/blogs",
        method: "POST",
        body,
      }),
    }),
    updateBlog: builder.mutation({
      query: (body) => ({
        url: `/blogs/${body._id}`,
        method: "PUT",
        body,
      }),
    }),
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetCategoriesMutation,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetProjectsMutation,
  useGetProjectByIdMutation,
  useAddProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetBlogsMutation,
  useGetBlogByIdMutation,
  useAddBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = edApi;
