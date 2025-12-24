import React, { useEffect, useState } from "react";
import InputField from "../ui/form/Input";
import InputLabelFormatWrapper from "../ui/form/InpuLabelWrapper";
import SingleSelect from "../ui/form/SingleSelect";
import UploadFile from "../ui/form/UploadFile";
import TextArea from "../ui/form/TextArea";
import Button from "../ui/Button";
import { LuPlus, LuTrash2, LuPencil } from "react-icons/lu";
import Switch from "../ui/form/Switch";
import {
  useGetProjectByIdMutation,
  useUpdateProjectMutation,
  useGetCategoriesMutation,
} from "../../redux/api/edApi";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [getCategories] = useGetCategoriesMutation();
  const [getProjectById] = useGetProjectByIdMutation();
  const [updateProject] = useUpdateProjectMutation();

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
    setErrors(errors);
    return isValid;
  };

  const handleSubmit = async () => {
    const isValid = validateForm();
    if (!isValid) return;
    try {
      const body = {
        ...formData,
      };
      // Ensure images are preserved or handled effectively
      // If no new images uploaded, we keep existing.
      // Note: UploadFile implementation details are vague, assuming we just pass current state.

      const res = await updateProject(body).unwrap();
      if (res.success) {
        toast.success("Project Updated Successfully");
        navigate("/ed/admin/projects");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update project");
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
        <UploadFile
          multiple={true}
          disabled={!isEditing}
          onUpload={(file) =>
            console.log("Upload logic implementation pending", file)
          }
          // Note: Logic to show existing images would go here if UploadFile supports it
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
