"use client";
import React, { useRef, useState, useEffect } from "react";
import Button from "../Button";
import { LuFileInput, LuX } from "react-icons/lu";
import Spinner from "../../Spinner";

export default function UploadFile({
  accept = ".jpg , .jpeg , .png , .pdf",
  text = "Please upload in JPG, JPEG, PNG, PDF File Format",
  isUploading = false,
  showPreview = true,
  buttonText = "Browse Files",
  onUpload = () => {},
  multiple = false,
}) {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const filesRef = useRef(files);

  // Update ref whenever files changes so cleanup has access to latest
  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  // Cleanup object URLs to avoid memory leaks on unmount
  useEffect(() => {
    return () => {
      filesRef.current.forEach((fileObj) => {
        if (fileObj.preview) {
          URL.revokeObjectURL(fileObj.preview);
        }
      });
    };
  }, []);

  const handleFileUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    const newFiles = selectedFiles.map((file) => ({
      file,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null,
    }));

    let updatedFiles = [];

    if (multiple) {
      updatedFiles = [...files, ...newFiles];
    } else {
      // If replacing, revoke old preview
      files.forEach((f) => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });
      updatedFiles = newFiles;
    }

    setFiles(updatedFiles);

    // Notify parent
    if (multiple) {
      onUpload(updatedFiles.map((f) => f.file));
    } else {
      onUpload(updatedFiles[0].file);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear input to allow re-selecting same file
    }
  };

  const removeFile = (indexToRemove) => {
    const fileToRemove = files[indexToRemove];
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }

    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    setFiles(updatedFiles);

    if (multiple) {
      onUpload(updatedFiles.map((f) => f.file));
    } else {
      onUpload(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col items-center w-full gap-4 py-6 border-2 border-dashed border-slate-300 rounded-xl min-h-56">
        <div className="text-sm font-bold text-center text-black">
          <LuFileInput
            name="upload"
            className="h-auto mx-auto mb-4 w-14 text-slate-300"
          />
          Upload Files
        </div>
        <span className="text-slate-900 text-sm">{text} </span>

        <Button
          variant="secondary"
          className="relative border rounded-lg disabled:opacity-50"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            className="hidden"
            id="sectionHiddenFile"
            onChange={handleFileUpload}
          />
          {isUploading && <Spinner size="5" />}
          {buttonText}
        </Button>
      </div>

      {/* Display uploaded files */}
      {showPreview && files.length > 0 && (
        <div className="flex flex-col gap-3">
          {files.map((fileObj, index) => (
            <div
              key={index}
              className="flex items-center gap-4 relative w-full border-2 border-dashed border-gray-200 p-2 rounded-lg"
            >
              <img
                src={fileObj.preview ? fileObj.preview : "/file-icon.png"}
                alt={fileObj.file.name}
                width={40}
                height={40}
                className="w-10 h-10 object-cover rounded"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{fileObj.file.name}</span>
                <span className="text-xs text-gray-500 font-medium">
                  {fileObj.file.size < 1024 * 1024
                    ? `${(fileObj.file.size / 1024).toFixed(2)} KB`
                    : `${(fileObj.file.size / (1024 * 1024)).toFixed(2)} MB`}
                </span>
              </div>

              <LuX
                size={18}
                className="ms-auto text-gray-500 cursor-pointer hover:text-red-500"
                onClick={() => removeFile(index)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
