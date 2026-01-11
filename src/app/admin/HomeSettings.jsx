import React, { useEffect, useState } from "react";
import InputLabelFormatWrapper from "../../components/ui/form/InpuLabelWrapper";
import InputField from "../../components/ui/form/Input";
import UploadFile from "../../components/ui/form/UploadFile";
import Button from "../../components/ui/Button";
import { LuPencil, LuTrash2, LuX } from "react-icons/lu";
import {
  useGetHomeDataMutation,
  useUpdateHomeDataMutation,
} from "../../redux/api/edApi";
import {
  useUploadFileMutation,
  useDeleteFileMutation,
} from "../../redux/api/uploadApi";
import toast from "react-hot-toast";
import Spinner from "../../components/Spinner";
import { IMAGE_BASE_URL } from "../../config/constant";

const HomeSettings = () => {
  // data fetching
  const [getHomeData, { isLoading: isFetching }] = useGetHomeDataMutation();
  const [updateHomeData, { isLoading: isUpdating }] =
    useUpdateHomeDataMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
  const [deleteFile] = useDeleteFileMutation();

  // local state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    carousel: [],
    counts: {
      totalProjects: "",
      totalClients: "",
      totalCities: "",
      totalArea: "",
    },
  });
  const [newFiles, setNewFiles] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [fileResetKey, setFileResetKey] = useState(0);

  const fetchData = async () => {
    try {
      const res = await getHomeData().unwrap();
      if (res.success) {
        setFormData({
          carousel: res.data.carousel || [],
          counts: {
            totalProjects: res.data.counts?.totalProjects || "",
            totalClients: res.data.counts?.totalClients || "",
            totalCities: res.data.counts?.totalCities || "",
            totalArea: res.data.counts?.totalArea || "",
          },
        });
        setImagesToDelete([]);
        setNewFiles([]);
        setFileResetKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch home data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      counts: {
        ...prev.counts,
        [field]: value,
      },
    }));
  };

  const handleRemoveExistingImage = (indexToRemove) => {
    const imageToDelete = formData.carousel[indexToRemove];
    setImagesToDelete((prev) => [...prev, imageToDelete]);

    setFormData((prev) => ({
      ...prev,
      carousel: prev.carousel.filter((_, index) => index !== indexToRemove),
    }));
  };

  const clearNewFiles = () => {
    setNewFiles([]);
    setFileResetKey((prev) => prev + 1);
  };

  const handleCancel = () => {
    setIsEditing(false);
    clearNewFiles();
    setImagesToDelete([]);
    fetchData(); // Revert to server data
  };

  const handleSubmit = async () => {
    const totalImages = formData.carousel.length + newFiles.length;

    if (totalImages < 3) {
      toast.error("At least 3 images are required for the carousel");
      return;
    }

    try {
      let uploadedImageUrls = [];

      // 1. Upload new files
      if (newFiles.length > 0) {
        const uploadData = new FormData();
        uploadData.append("folder", "home"); // Assuming 'home' folder is appropriate/allowed
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
        try {
          await deleteFile({ imageUrls: imagesToDelete }).unwrap();
        } catch (error) {
          console.error("Failed to delete images", error);
          // We continue even if deletion fails, to ensure update happens
        }
      }

      // 3. Update Home Data
      const finalCarousel = [...formData.carousel, ...uploadedImageUrls];

      const body = {
        carousel: finalCarousel,
        counts: formData.counts,
      };

      const res = await updateHomeData(body).unwrap();
      if (res.success) {
        toast.success("Home Settings Updated Successfully");
        setIsEditing(false);
        clearNewFiles();
        setImagesToDelete([]);
        // Update local state with the final result
        setFormData({
          carousel: res.data.carousel || finalCarousel,
          counts: res.data.counts || formData.counts,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  if (
    isFetching &&
    !formData.carousel.length &&
    !formData.counts.totalProjects
  ) {
    return (
      <div className="flex justify-center p-10">
        <Spinner size="10" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <LuPencil className="mr-2" /> Edit
          </Button>
        )}
      </div>

      {/* Carousel Images Section */}
      <div className="flex flex-col gap-3 rounded-md p-4 bg-white shadow-sm border border-slate-200">
        <div className="font-semibold text-lg">Carousel Images</div>

        {/* Existing Images */}
        {formData.carousel.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {formData.carousel.map((imgUrl, index) => (
              <div
                key={index}
                className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-video"
              >
                <img
                  src={IMAGE_BASE_URL + imgUrl}
                  alt={`Carousel ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {isEditing && (
                  <button
                    onClick={() => handleRemoveExistingImage(index)}
                    className="absolute top-2 right-2 p-1 bg-white text-red-500 rounded-full shadow-md hover:bg-red-50 transition-colors"
                    title="Remove Image"
                  >
                    <LuTrash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          !isEditing && (
            <p className="text-gray-500 italic">No images in carousel.</p>
          )
        )}

        {/* Upload New Images (Only in Edit Mode) */}
        {isEditing && (
          <UploadFile
            key={fileResetKey}
            multiple={true}
            onUpload={(files) => setNewFiles(files)}
            isUploading={isUploading}
            text="Upload new images to add to the carousel"
          />
        )}
      </div>

      {/* Counts Section */}
      <div className="flex flex-col gap-3 rounded-md p-4 bg-white shadow-sm border border-slate-200">
        <div className="font-semibold text-lg">Counts</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <InputLabelFormatWrapper label="Total Projects">
            <InputField
              placeholder="450"
              value={formData.counts.totalProjects}
              onChange={(e) =>
                handleInputChange("totalProjects", e.target.value)
              }
              disabled={!isEditing}
            />
          </InputLabelFormatWrapper>
          <InputLabelFormatWrapper label="Total Clients">
            <InputField
              placeholder="300"
              value={formData.counts.totalClients}
              onChange={(e) =>
                handleInputChange("totalClients", e.target.value)
              }
              disabled={!isEditing}
            />
          </InputLabelFormatWrapper>
          <InputLabelFormatWrapper label="Total Cities">
            <InputField
              placeholder="450"
              value={formData.counts.totalCities}
              onChange={(e) => handleInputChange("totalCities", e.target.value)}
              disabled={!isEditing}
            />
          </InputLabelFormatWrapper>
          <InputLabelFormatWrapper label="Total Area (Sq Ft)">
            <InputField
              placeholder="300"
              value={formData.counts.totalArea}
              onChange={(e) => handleInputChange("totalArea", e.target.value)}
              disabled={!isEditing}
            />
          </InputLabelFormatWrapper>
        </div>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex justify-end items-center gap-2 pt-4">
          <Button
            variant="tertiary"
            onClick={handleCancel}
            disabled={isUploading || isUpdating}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isUploading || isUpdating}>
            {isUploading || isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default HomeSettings;
