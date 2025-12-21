import React, { useEffect, useState } from "react";
import { DataTable } from "../../components/ui/table/DataTable";
import Button from "../../components/ui/Button";
import { BiPlus } from "react-icons/bi";
import { useGetProjectsMutation } from "../../redux/api/edApi";
import { useNavigate } from "react-router-dom";

const Projects = () => {
  const navigate = useNavigate();
  const [getProjects] = useGetProjectsMutation();
  const [projects, setProjects] = useState([]);
  const columns = [
    {
      header: "Sr No",
      accessorKey: "_id",
      cell: (info) => info.row.index + 1,
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
      header: "Status",
      accessorKey: "status",
      width: 150,
      cell: (info) => info.row.original.status || "-",
    },
    {
      header: "Image",
      accessorKey: "image",
      width: 200,
      cell: (info) => info.row.original.images.length,
    },
  ];

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

  useEffect(() => {
    fetchProjects();
  }, []);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Button onClick={() => navigate("/ed/admin/projects/new")}>
          <BiPlus /> Add Project
        </Button>
      </div>
      <div>
        <DataTable columns={columns} data={projects} />
      </div>
    </div>
  );
};

export default Projects;
