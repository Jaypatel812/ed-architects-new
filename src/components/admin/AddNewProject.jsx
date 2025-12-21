import React, { useEffect, useState } from "react";
import InputField from "../ui/form/Input";
import InputLabelFormatWrapper from "../ui/form/InpuLabelWrapper";
import SingleSelect from "../ui/form/SingleSelect";
import UploadFile from "../ui/form/UploadFile";
import TextArea from "../ui/form/TextArea";
import Button from "../ui/Button";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import Switch from "../ui/form/Switch";
import {
  useAddProjectMutation,
  useGetCategoriesMutation,
} from "../../redux/api/edApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddNewProject = () => {
  const navigate = useNavigate();
  const [getCategories, { isLoading }] = useGetCategoriesMutation();
  const [addProject] = useAddProjectMutation();
  const [categories, setCategories] = useState([]);
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
    // if (!formData.images.length) {
    //   errors.images = "Images are required";
    // }
    setErrors(errors);
    return isValid;
  };

  const handleSubmit = async () => {
    const isValid = validateForm();
    if (!isValid) return;
    try {
      const body = {
        ...formData,
        images: ["somelink"],
      };
      const res = await addProject(body).unwrap();
      if (res.success) {
        toast.success("Project Added Successfully");
        setFormData({
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
        navigate("/ed/admin/projects");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Add New Project</h1>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex gap-4">
          <InputLabelFormatWrapper label="Title" required error={errors.title}>
            <InputField
              placeholder="Enter project title"
              value={formData.title}
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
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
          </InputLabelFormatWrapper>
          <InputLabelFormatWrapper label="Built Up Area">
            <InputField
              placeholder="Enter built up area"
              value={formData.builtUpArea}
              onChange={(e) =>
                setFormData({ ...formData, builtUpArea: e.target.value })
              }
            />
          </InputLabelFormatWrapper>
          <InputLabelFormatWrapper label="Site Area">
            <InputField
              placeholder="Enter site area"
              value={formData.siteArea}
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
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: formData.description.map((_, i) =>
                      i === index ? e.target.value : item
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
        <UploadFile multiple={true} onUpload={(file) => console.log(file)} />
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
          <Button variant="tertiary">Cancel</Button>
          <Button onClick={() => handleSubmit()}>Submit</Button>
        </div>
      </div>
    </div>
  );
};

export default AddNewProject;
