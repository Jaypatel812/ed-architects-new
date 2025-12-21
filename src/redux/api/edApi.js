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
  }),
});

export const {
  useGetCategoriesMutation,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetProjectsMutation,
  useAddProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = edApi;
