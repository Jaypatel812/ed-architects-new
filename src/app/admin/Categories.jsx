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
  LuSearch,
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

  // Storage Key
  const STORAGE_KEY = "categories_table_state";

  // Initial State from Session Storage
  const [tableState, setTableState] = useState(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored
      ? JSON.parse(stored)
      : { pageIndex: 0, pageSize: 10, search: "" };
  });

  const { pageIndex, pageSize, search: searchQuery } = tableState;

  // Local Search Input
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Persist to Session Storage
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tableState));
  }, [tableState]);

  // Debounce Search
  useEffect(() => {
    const handler = setTimeout(() => {
      setTableState((prev) => {
        if (prev.search === localSearch) return prev;
        return { ...prev, search: localSearch, pageIndex: 0 };
      });
    }, 300);

    return () => clearTimeout(handler);
  }, [localSearch]);

  // Pagination Handler
  const handlePaginationChange = (updater) => {
    setTableState((prev) => {
      const currentPagination = {
        pageIndex: prev.pageIndex,
        pageSize: prev.pageSize,
      };

      const nextPagination =
        typeof updater === "function" ? updater(currentPagination) : updater;

      return { ...prev, ...nextPagination };
    });
  };

  const columns = [
    {
      header: "Sr No",
      accessorKey: "_id",
      cell: (info) =>
        info.table.getSortedRowModel().flatRows.indexOf(info.row) + 1,
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
      setError({ name: error?.data?.message || "Something went wrong" });
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
      toast.error(error?.data?.message || "Something went wrong");
      handleClose("delete");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-white p-4 rounded-md shadow-xs">
          <InputField
            placeholder="Search"
            icon={LuSearch}
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
          <Button onClick={() => setIsOpen(true)}>
            <BiPlus /> Add Category
          </Button>
        </div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div>
            {categories?.length > 0 ? (
              <DataTable
                columns={columns}
                data={categories}
                globalFilter={searchQuery}
                pagination={{ pageIndex, pageSize }}
                onPaginationChange={handlePaginationChange}
              />
            ) : (
              <div className="flex h-96 items-center justify-center">
                No categories found
              </div>
            )}
          </div>
        )}
      </div>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <div className="space-y-4">
          <div className="text-2xl flex items-center justify-between min-w-96 font-semibold">
            <div>{isEdit ? "Edit Category" : "Add Category"}</div>
            <LuX className="cursor-pointer" size={20} onClick={handleClose} />
          </div>
          <InputField
            placeholder="Category Name"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              setError({ name: "" });
            }}
            error={error.name}
          />
          <div className="flex items-center justify-end">
            <Button
              onClick={() => handleSubmit()}
              disabled={isAdding || isUpdating}
            >
              {isAdding || isUpdating ? (
                <>
                  <LuLoaderCircle className="animate-spin" /> Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={isDeleteOpen} onClose={handleClose}>
        <div className="space-y-4">
          <div>Are you sure you want to delete this category?</div>
          <div className="flex items-center gap-2 justify-end">
            <Button variant="secondary" onClick={() => handleClose("delete")}>
              Cancel
            </Button>
            <Button disabled={isDeleting} onClick={() => handleDelete()}>
              {isDeleting ? (
                <>
                  <LuLoaderCircle className="animate-spin" /> Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Categories;
