import React, { useEffect, useState } from "react";
import InputField from "../ui/form/Input";
import InputLabelFormatWrapper from "../ui/form/InpuLabelWrapper";
import SingleSelect from "../ui/form/SingleSelect";
import UploadFile from "../ui/form/UploadFile";
import TextArea from "../ui/form/TextArea";
import Button from "../ui/Button";
import { LuPlus, LuTrash2, LuPencil, LuX } from "react-icons/lu";
import Switch from "../ui/form/Switch";
import {
  useGetProjectByIdMutation,
  useUpdateProjectMutation,
  useGetCategoriesMutation,
} from "../../redux/api/edApi";
import {
  useUploadFileMutation,
  useDeleteFileMutation,
} from "../../redux/api/uploadApi";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { IMAGE_BASE_URL } from "../../config/constant";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [getCategories] = useGetCategoriesMutation();
  const [getProjectById] = useGetProjectByIdMutation();
  const [updateProject] = useUpdateProjectMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
  const [deleteFile] = useDeleteFileMutation();

  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    client: "",
    location: "",
    builtUpArea: "",
    siteArea: "",
    status: "ACTIVE",
    description: [""],
    images: [],
  });
  const [newFiles, setNewFiles] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [fileResetKey, setFileResetKey] = useState(0);
  const [errors, setErrors] = useState({});

  const fetchCategories = async () => {
    try {
      const res = await getCategories().unwrap();
      if (res.success) {
        setCategories(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProjectDetails = async () => {
    try {
      const res = await getProjectById(id).unwrap();
      if (res.success) {
        const project = res.data;
        setFormData({
          _id: project._id,
          title: project.title || "",
          categoryId: project.category?._id || project.categoryId || "",
          client: project.client || "",
          location: project.location || "",
          builtUpArea: project.builtUpArea || "",
          siteArea: project.siteArea || "",
          status: project.status || "ACTIVE",
          description:
            Array.isArray(project.description) && project.description.length > 0
              ? project.description
              : [""],
          images: project.images || [],
        });
        setImagesToDelete([]);
        setNewFiles([]);
        setFileResetKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to fetch project details", error);
      toast.error("Failed to load project details");
    }
  };

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchProjectDetails();
    }
  }, [id]);

  const validateForm = () => {
    const errors = {};
    let isValid = true;
    if (!formData.title) {
      errors.title = "Title is required";
      isValid = false;
    }
    if (!formData.categoryId) {
      errors.category = "Category is required";
      isValid = false;
    }
    if (!formData.location) {
      errors.location = "Location is required";
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
        uploadData.append("folder", "project");
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

      // 3. Update Project
      const body = {
        ...formData,
        images: [...formData.images, ...uploadedImageUrls],
      };

      const res = await updateProject(body).unwrap();
      if (res.success) {
        toast.success("Project Updated Successfully");
        navigate("/ed/admin/projects");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to update project");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {isEditing ? "Edit Project" : "Project Details"}
        </h1>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <LuPencil className="mr-2" /> Edit Project
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex gap-4">
          <InputLabelFormatWrapper label="Title" required error={errors.title}>
            <InputField
              placeholder="Enter project title"
              value={formData.title}
              disabled={!isEditing}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </InputLabelFormatWrapper>
          <InputLabelFormatWrapper
            label="Category"
            required
            error={errors.category}
          >
            <SingleSelect
              options={
                categories.length > 0
                  ? categories.map((item) => ({
                      label: item.name,
                      value: item._id,
                    }))
                  : []
              }
              value={formData.categoryId}
              disabled={!isEditing}
              onChange={(value) =>
                setFormData({ ...formData, categoryId: value })
              }
              placeholder="Select category"
            />
          </InputLabelFormatWrapper>
        </div>
        <div className="flex gap-4">
          <InputLabelFormatWrapper label="Client">
            <InputField
              placeholder="Enter client name"
              value={formData.client}
              disabled={!isEditing}
              onChange={(e) =>
                setFormData({ ...formData, client: e.target.value })
              }
            />
          </InputLabelFormatWrapper>
          <InputLabelFormatWrapper
            label="Location"
            required
            error={errors.location}
          >
            <InputField
              placeholder="Enter location"
              value={formData.location}
              disabled={!isEditing}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
          </InputLabelFormatWrapper>
          <InputLabelFormatWrapper label="Built Up Area">
            <InputField
              placeholder="Enter built up area"
              value={formData.builtUpArea}
              disabled={!isEditing}
              onChange={(e) =>
                setFormData({ ...formData, builtUpArea: e.target.value })
              }
            />
          </InputLabelFormatWrapper>
          <InputLabelFormatWrapper label="Site Area">
            <InputField
              placeholder="Enter site area"
              value={formData.siteArea}
              disabled={!isEditing}
              onChange={(e) =>
                setFormData({ ...formData, siteArea: e.target.value })
              }
            />
          </InputLabelFormatWrapper>
        </div>
        <div className="flex flex-col gap-4">
          <InputLabelFormatWrapper label="Description" />
          {formData.description.map((item, index) => (
            <div key={index} className="flex items-top gap-2">
              <TextArea
                className="flex-1"
                placeholder="Enter project description"
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
                  alt={`project-${index}`}
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
              onClick={() => navigate("/ed/admin/projects")}
              variant="tertiary"
            >
              Back to Projects
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProject;
