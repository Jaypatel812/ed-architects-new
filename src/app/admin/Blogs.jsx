import React, { useEffect, useState } from "react";
import { DataTable } from "../../components/ui/table/DataTable";
import Button from "../../components/ui/Button";
import { BiPlus } from "react-icons/bi";
import {
  useGetBlogsMutation,
  useDeleteBlogMutation,
} from "../../redux/api/edApi";
import { useNavigate } from "react-router-dom";
import { LuEye, LuSearch, LuTrash2 } from "react-icons/lu";
import toast from "react-hot-toast";
import InputField from "../../components/ui/form/Input";

const Blogs = () => {
  const navigate = useNavigate();
  const [getBlogs] = useGetBlogsMutation();
  const [deleteBlog] = useDeleteBlogMutation();
  const [blogs, setBlogs] = useState([]);

  // Storage Key
  const STORAGE_KEY = "blogs_table_state";

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

  const fetchBlogs = async () => {
    try {
      const res = await getBlogs().unwrap();
      if (res.success) {
        setBlogs(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      const res = await deleteBlog(id).unwrap();
      if (res.success) {
        toast.success("Blog Deleted Successfully");
        fetchBlogs();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete blog");
    }
  };

  const columns = [
    {
      header: "Sr No",
      accessorKey: "_id",
      cell: (info) =>
        info.table.getSortedRowModel().flatRows.indexOf(info.row) + 1,
    },
    { header: "Title", accessorKey: "title", width: 200 },
    {
      header: "Images",
      accessorKey: "images",
      cell: (info) => info.row.original.images?.length || 0,
    },
    {
      header: "Status",
      accessorKey: "status",
      width: 150,
      cell: (info) => info.row.original.status || "-",
    },
    {
      header: "Action",
      accessorKey: "action",
      width: 150,
      cell: (info) => (
        <div className="flex items-center gap-4">
          <LuEye
            className="cursor-pointer text-gray-500"
            size={16}
            onClick={() => navigate(`/ed/admin/blogs/${info.row.original._id}`)}
          />
          <LuTrash2
            size={16}
            className="cursor-pointer text-red-500"
            onClick={() => handleDelete(info.row.original._id)}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-white p-4 rounded-md shadow-xs">
        <InputField
          placeholder="Search"
          icon={LuSearch}
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
        <Button onClick={() => navigate("/ed/admin/blogs/new")}>
          <BiPlus /> Add Blog
        </Button>
      </div>
      <div>
        {blogs?.length > 0 ? (
          <DataTable
            columns={columns}
            data={blogs}
            globalFilter={searchQuery}
            pagination={{ pageIndex, pageSize }}
            onPaginationChange={handlePaginationChange}
          />
        ) : (
          <div className="flex h-96 items-center justify-center">
            No blogs found
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;
