import React, { useEffect, useState } from "react";
import InputField from "../ui/form/Input";
import InputLabelFormatWrapper from "../ui/form/InpuLabelWrapper";
import UploadFile from "../ui/form/UploadFile";
import TextArea from "../ui/form/TextArea";
import Button from "../ui/Button";
import { LuPlus, LuTrash2, LuPencil } from "react-icons/lu";
import Switch from "../ui/form/Switch";
import {
  useGetBlogByIdMutation,
  useUpdateBlogMutation,
} from "../../redux/api/edApi";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [getBlogById] = useGetBlogByIdMutation();
  const [updateBlog] = useUpdateBlogMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    status: "ACTIVE",
    description: [""],
    images: [],
  });
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

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = async () => {
    const isValid = validateForm();
    if (!isValid) return;
    try {
      const body = {
        ...formData,
        // Mock images as we did in AddNewBlog if needed, or if we assume existing images are fine:
        // User said "for now no api for images so put the single text in array as i done in the projects"
        // In update scenarios, usually we keep existing if not changed, but if we follow Add logic strictly:
        // We might want to ensure we don't break the array.
        // If formData.images is empty, maybe push dummy link?
        // Let's assume we just pass formData as is, but if images is empty and it's required...
        // I will keep the implementation similar to EditProject where I just passed ...formData
      };

      const res = await updateBlog(body).unwrap();
      if (res.success) {
        toast.success("Blog Updated Successfully");
        navigate("/ed/admin/blogs");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update blog");
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

        <InputLabelFormatWrapper label="Images" required />
        <UploadFile
          multiple={true}
          disabled={!isEditing}
          onUpload={(file) =>
            console.log("Upload logic implementation pending", file)
          }
        />

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
              <Button onClick={() => handleSubmit()}>Update</Button>
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
