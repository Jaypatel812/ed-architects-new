import React, { useState } from "react";
import InputField from "../ui/form/Input";
import InputLabelFormatWrapper from "../ui/form/InpuLabelWrapper";
import UploadFile from "../ui/form/UploadFile";
import TextArea from "../ui/form/TextArea";
import Button from "../ui/Button";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import Switch from "../ui/form/Switch";
import { useAddBlogMutation } from "../../redux/api/edApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useUploadFileMutation } from "../../redux/api/uploadApi";

const AddNewBlog = () => {
  const navigate = useNavigate();
  const [addBlog] = useAddBlogMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

  const [formData, setFormData] = useState({
    title: "",
    status: "ACTIVE",
    description: [""],
    images: [],
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileResetKey, setFileResetKey] = useState(0);
  const [errors, setErrors] = useState({});

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

    if (selectedFiles.length === 0) {
      toast.error("At least one image is required");
      isValid = false;
    }

    if (selectedFiles.length > 12) {
      toast.error("Maximum 12 images allowed");
      isValid = false;
    }

    const isFileTooLarge = selectedFiles.some(
      (file) => file.size > 5 * 1024 * 1024
    );
    if (isFileTooLarge) {
      toast.error("Each image must be less than 5 MB");
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = async () => {
    const isValid = validateForm();
    if (!isValid) return;

    try {
      // 1. Upload Images
      const uploadData = new FormData();
      uploadData.append("folder", "blog");
      selectedFiles.forEach((file) => {
        uploadData.append("images", file);
      });

      const uploadRes = await uploadFile(uploadData).unwrap();

      let uploadedImageUrls = [];
      if (uploadRes && uploadRes.images) {
        uploadedImageUrls = uploadRes.images;
      } else {
        toast.error("Image upload failed");
        return;
      }

      const body = {
        ...formData,
        images: uploadedImageUrls,
      };

      const res = await addBlog(body).unwrap();
      if (res.success) {
        toast.success("Blog Added Successfully");
        setFormData({
          title: "",
          status: "ACTIVE",
          description: [""],
          images: [],
        });
        setSelectedFiles([]);
        setFileResetKey((prev) => prev + 1);
        navigate("/ed/admin/blogs");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to add blog");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Add New Blog</h1>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex gap-4">
          <InputLabelFormatWrapper label="Title" required error={errors.title}>
            <InputField
              placeholder="Enter blog title"
              value={formData.title}
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
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: formData.description.map((desc, i) =>
                      i === index ? e.target.value : desc
                    ),
                  })
                }
              />
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
            </div>
          ))}
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
        </div>

        <InputLabelFormatWrapper label="Images" required />
        <UploadFile
          key={fileResetKey}
          multiple={true}
          onUpload={(files) => setSelectedFiles(files)}
          isUploading={isUploading}
        />

        <div className="flex items-center gap-2">
          <label htmlFor="AcceptConditions">Status</label>
          <Switch
            checked={formData.status === "ACTIVE"}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.checked ? "ACTIVE" : "INACTIVE",
              })
            }
          />
        </div>
        <div className="flex justify-end items-center gap-2">
          <Button
            onClick={() => navigate("/ed/admin/blogs")}
            variant="tertiary"
          >
            Cancel
          </Button>
          <Button onClick={() => handleSubmit()} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddNewBlog;
