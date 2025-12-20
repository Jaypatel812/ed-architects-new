import React from "react";
import { DataTable } from "../../components/ui/table/DataTable";
import Button from "../../components/ui/Button";
import { BiPlus } from "react-icons/bi";

const Projects = () => {
  const columns = [
    { header: "ID", accessorKey: "id", width: 90 },
    { header: "Name", accessorKey: "name", width: 150 },
    { header: "Age", accessorKey: "age", width: 110 },
    { header: "Email", accessorKey: "email", width: 200 },
  ];
  const data = [
    { id: 1, name: "John", age: 30, email: "john@example.com" },
    { id: 2, name: "Jane", age: 25, email: "jane@example.com" },
    { id: 3, name: "Mike", age: 35, email: "mike@example.com" },
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Button>
          <BiPlus /> Add Project
        </Button>
      </div>
      <div>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default Projects;
