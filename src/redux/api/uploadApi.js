import { baseApi } from "./baseApi";

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation({
      query: (data) => ({
        url: "/uploads/upload-images",
        method: "POST",
        body: data,
      }),
    }),
    deleteFile: builder.mutation({
      query: (body) => ({
        url: `/uploads/delete-images`,
        method: "DELETE",
        body,
      }),
    }),
  }),
});

export const { useUploadFileMutation, useDeleteFileMutation } = uploadApi;
