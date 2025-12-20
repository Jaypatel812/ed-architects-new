import React, { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import { BiPlus } from "react-icons/bi";
import { DataTable } from "../../components/ui/table/DataTable";
import {
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesMutation,
  useUpdateCategoryMutation,
} from "../../redux/api/edApi";
import {
  LuCircle,
  LuLoaderCircle,
  LuPencil,
  LuTrash,
  LuTrash2,
  LuX,
} from "react-icons/lu";
import Modal from "../../components/ui/overlays/Modal";
import InputField from "../../components/ui/form/Input";
import toast from "react-hot-toast";

const Categories = () => {
  const [getCategories, { isLoading }] = useGetCategoriesMutation();
  const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
  });
  const [error, setError] = useState({
    name: "",
  });
  const [isEdit, setIsEdit] = useState(false);

  const columns = [
    {
      header: "Sr No",
      accessorKey: "_id",
      cell: (info) => info.row.index + 1,
      //   width: 90,
    },
    { header: "Name", accessorKey: "name" },
    {
      header: "Action",
      cell: (info) => (
        <div className="flex items-center gap-5">
          <LuPencil
            onClick={() => handleEdit(info.row.original)}
            size={16}
            className="text-gray-700 cursor-pointer"
          />
          <LuTrash2
            onClick={() => handleDeleteModal(info.row.original)}
            size={16}
            className="text-red-500 cursor-pointer"
          />
        </div>
      ),
    },
  ];

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

  const handleEdit = (data) => {
    setIsEdit(true);
    setFormData({
      _id: data._id,
      name: data.name,
    });
    setIsOpen(true);
  };

  const handleDeleteModal = (data) => {
    setIsDeleteOpen(true);
    setFormData({
      _id: data._id,
      name: data.name,
    });
  };

  const handleClose = (type) => {
    if (type === "delete") {
      setIsDeleteOpen(false);
    } else {
      setIsOpen(false);
    }
    setFormData({
      _id: "",
      name: "",
    });
    setIsEdit(false);
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      setError({
        name: "Name is required",
      });
      return;
    }
    const api = isEdit ? updateCategory : addCategory;
    try {
      const res = await api(formData).unwrap();

      console.log(res);
      if (res.success) {
        toast.success(
          isEdit
            ? "Category updated successfully"
            : "Category added successfully"
        );
        fetchCategories();
        handleClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    if (!formData._id) {
      return toast.error("Category not found");
    }
    try {
      const res = await deleteCategory(formData._id).unwrap();
      if (res.success) {
        toast.success("Category deleted successfully");
        fetchCategories();
        handleClose("delete");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <Button onClick={() => setIsOpen(true)}>
          <BiPlus /> Add Category
        </Button>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <DataTable columns={columns} data={categories} />
        </div>
      )}
      <Modal isOpen={isOpen} onClose={handleClose}>
        <div className="space-y-4">
          <div className="text-2xl flex items-center justify-between min-w-96 font-semibold">
            <div>{isEdit ? "Edit Category" : "Add Category"}</div>
            <LuX className="cursor-pointer" size={20} onClick={handleClose} />
          </div>
          <InputField
            placeholder="Category Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <div className="flex items-center justify-end">
            <Button onClick={() => handleSubmit()}>Save</Button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={isDeleteOpen} onClose={handleClose}>
        <div className="space-y-4">
          <div>Are you sure you want to delete this category?</div>
          <div className="flex items-center justify-end">
            <Button variant="secondary" onClick={() => handleClose("delete")}>
              Cancel
            </Button>
            <Button disabled={isDeleting} onClick={() => handleDelete()}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Categories;
