import React, { useEffect, useState } from "react";
import InputField from "../ui/form/Input";
import InputLabelFormatWrapper from "../ui/form/InpuLabelWrapper";
import UploadFile from "../ui/form/UploadFile";
import TextArea from "../ui/form/TextArea";
import Button from "../ui/Button";
import { LuPlus, LuTrash2, LuPencil, LuX } from "react-icons/lu";
import Switch from "../ui/form/Switch";
import {
  useGetBlogByIdMutation,
  useUpdateBlogMutation,
} from "../../redux/api/edApi";
import {
  useUploadFileMutation,
  useDeleteFileMutation,
} from "../../redux/api/uploadApi";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { IMAGE_BASE_URL } from "../../config/constant";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [getBlogById] = useGetBlogByIdMutation();
  const [updateBlog] = useUpdateBlogMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
  const [deleteFile] = useDeleteFileMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    status: "ACTIVE",
    description: [""],
    images: [],
  });
  const [newFiles, setNewFiles] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [fileResetKey, setFileResetKey] = useState(0);
  const [errors, setErrors] = useState({});

  const fetchBlogDetails = async () => {
    try {
      const res = await getBlogById(id).unwrap();
      if (res.success) {
        const blog = res.data;
        setFormData({
          _id: blog._id,
          title: blog.title || "",
          status: blog.status || "ACTIVE",
          description:
            Array.isArray(blog.description) && blog.description.length > 0
              ? blog.description
              : [""],
          images: blog.images || [],
        });
        setImagesToDelete([]);
        setNewFiles([]);
        setFileResetKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to fetch blog details", error);
      toast.error("Failed to load blog details");
    }
  };

  useEffect(() => {
    if (id) {
      fetchBlogDetails();
    }
  }, [id]);

  const validateForm = () => {
    const errors = {};
    let isValid = true;
    if (!formData.title) {
      errors.title = "Title is required";
      isValid = false;
    }

    // Check if at least one description exists and is not empty
    const hasDescription = formData.description.some((d) => d.trim() !== "");
    if (!hasDescription) {
      toast.error("At least one description is required");
      isValid = false;
    }

    const totalImages = formData.images.length + newFiles.length;
    if (totalImages === 0) {
      toast.error("At least one image is required");
      isValid = false;
    }
    if (totalImages > 12) {
      toast.error("Maximum 12 images allowed");
      isValid = false;
    }

    const isFileTooLarge = newFiles.some((file) => file.size > 5 * 1024 * 1024);
    if (isFileTooLarge) {
      toast.error("Each new image must be less than 5 MB");
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleDeleteExisting = (index, imageUrl) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
    setImagesToDelete([...imagesToDelete, imageUrl]);
  };

  const handleSubmit = async () => {
    const isValid = validateForm();
    if (!isValid) return;

    try {
      let uploadedImageUrls = [];

      // 1. Upload new files if any
      if (newFiles.length > 0) {
        const uploadData = new FormData();
        uploadData.append("folder", "blog");
        newFiles.forEach((file) => {
          uploadData.append("images", file);
        });

        const uploadRes = await uploadFile(uploadData).unwrap();
        if (uploadRes && uploadRes.images) {
          uploadedImageUrls = uploadRes.images;
        } else {
          toast.error("Image upload failed");
          return;
        }
      }

      // 2. Delete removed images
      if (imagesToDelete.length > 0) {
        await deleteFile({ imageUrls: imagesToDelete }).unwrap();
      }

      // 3. Update Blog
      const body = {
        ...formData,
        images: [...formData.images, ...uploadedImageUrls],
      };

      const res = await updateBlog(body).unwrap();
      if (res.success) {
        toast.success("Blog Updated Successfully");
        navigate("/ed/admin/blogs");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to update blog");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {isEditing ? "Edit Blog" : "Blog Details"}
        </h1>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <LuPencil className="mr-2" /> Edit Blog
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex gap-4">
          <InputLabelFormatWrapper label="Title" required error={errors.title}>
            <InputField
              placeholder="Enter blog title"
              value={formData.title}
              disabled={!isEditing}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </InputLabelFormatWrapper>
        </div>

        <div className="flex flex-col gap-4">
          <InputLabelFormatWrapper label="Description" required />
          {formData.description.map((item, index) => (
            <div key={index} className="flex items-top gap-2">
              <TextArea
                className="flex-1"
                placeholder="Enter blog description"
                value={item}
                disabled={!isEditing}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: formData.description.map((desc, i) =>
                      i === index ? e.target.value : desc
                    ),
                  })
                }
              />
              {isEditing && (
                <LuTrash2
                  className="cursor-pointer text-red-500"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      description: formData.description.filter(
                        (_, i) => i !== index
                      ),
                    })
                  }
                />
              )}
            </div>
          ))}
          {isEditing && (
            <Button
              onClick={() =>
                setFormData({
                  ...formData,
                  description: [...formData.description, ""],
                })
              }
            >
              <LuPlus /> Add More
            </Button>
          )}
        </div>

        {/* Existing Images */}
        <div className="flex flex-col gap-2">
          <InputLabelFormatWrapper label="Existing Images" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {formData.images.map((imgUrl, index) => (
              <div
                key={index}
                className="relative group border rounded-lg overflow-hidden h-32 w-full"
              >
                <img
                  src={IMAGE_BASE_URL + imgUrl}
                  alt={`blog-${index}`}
                  className="w-full h-full object-cover"
                />
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => handleDeleteExisting(index, imgUrl)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <LuX size={14} />
                  </button>
                )}
              </div>
            ))}
            {formData.images.length === 0 && (
              <p className="text-sm text-gray-500 col-span-full">
                No existing images.
              </p>
            )}
          </div>
        </div>

        {isEditing && (
          <UploadFile
            key={fileResetKey}
            multiple={true}
            onUpload={(files) => setNewFiles(files)}
            isUploading={isUploading}
          />
        )}

        <div className="flex items-center gap-2">
          <label htmlFor="AcceptConditions">Status</label>
          <Switch
            checked={formData.status === "ACTIVE"}
            disabled={!isEditing}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.checked ? "ACTIVE" : "INACTIVE",
              })
            }
          />
        </div>
        <div className="flex justify-end items-center gap-2">
          {isEditing ? (
            <>
              <Button onClick={() => setIsEditing(false)} variant="tertiary">
                Cancel
              </Button>
              <Button onClick={() => handleSubmit()} disabled={isUploading}>
                {isUploading ? "Updating..." : "Update"}
              </Button>
            </>
          ) : (
            <Button
              onClick={() => navigate("/ed/admin/blogs")}
              variant="tertiary"
            >
              Back to Blogs
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditBlog;
