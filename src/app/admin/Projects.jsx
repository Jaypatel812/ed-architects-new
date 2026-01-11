import React, { useEffect, useState } from "react";
import { DataTable } from "../../components/ui/table/DataTable";
import Button from "../../components/ui/Button";
import { BiPlus } from "react-icons/bi";
import {
  useGetProjectsMutation,
  useDeleteProjectMutation,
} from "../../redux/api/edApi";
import { useNavigate } from "react-router-dom";
import { LuEye, LuSearch, LuTrash2 } from "react-icons/lu";
import toast from "react-hot-toast";
import InputField from "../../components/ui/form/Input";

const Projects = () => {
  const navigate = useNavigate();
  const [getProjects] = useGetProjectsMutation();
  const [deleteProject] = useDeleteProjectMutation();
  const [projects, setProjects] = useState([]);

  // Storage Key
  const STORAGE_KEY = "projects_table_state";

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

  const fetchProjects = async () => {
    try {
      const res = await getProjects().unwrap();
      if (res.success) {
        setProjects(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;
    try {
      const res = await deleteProject(id).unwrap();
      if (res.success) {
        toast.success("Project Deleted Successfully");
        fetchProjects();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete project");
    }
  };

  const columns = [
    {
      header: "Sr No",
      accessorKey: "_id",
      cell: (info) =>
        info.table.getSortedRowModel().flatRows.indexOf(info.row) + 1,
      //   width: 90,
    },
    { header: "Title", accessorKey: "title", width: 150 },
    {
      header: "Category",
      accessorKey: "category",
      width: 150,
      cell: (info) => info.row.original.category.name,
    },
    { header: "Location", accessorKey: "location", width: 150 },
    {
      header: "Built Up Area",
      accessorKey: "builtUpArea",
      width: 150,
      cell: (info) => info.row.original.builtUpArea || "-",
    },
    {
      header: "Client",
      accessorKey: "client",
      width: 150,
      cell: (info) => info.row.original.client || "-",
    },
    {
      header: "Site Area",
      accessorKey: "siteArea",
      width: 150,
      cell: (info) => info.row.original.siteArea || "-",
    },
    {
      header: "Image",
      accessorKey: "image",
      // width: 200,
      cell: (info) => info.row.original.images.length,
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
            size={16}
            className="cursor-pointer text-gray-500"
            onClick={() =>
              navigate(`/ed/admin/projects/${info.row.original._id}`)
            }
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
    fetchProjects();
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
        <Button onClick={() => navigate("/ed/admin/projects/new")}>
          <BiPlus /> Add Project
        </Button>
      </div>
      <div>
        {projects?.length > 0 ? (
          <DataTable
            columns={columns}
            data={projects}
            globalFilter={searchQuery}
            pagination={{ pageIndex, pageSize }}
            onPaginationChange={handlePaginationChange}
          />
        ) : (
          <div className="flex h-96 items-center justify-center">
            No projects found
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
