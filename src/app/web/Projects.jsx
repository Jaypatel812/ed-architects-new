import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Wrapper from "../../components/Wrapper";
import { PROJECT_TAB_TYPES } from "../../utils/constants";
import {
  useGetCategoriesMutation,
  useGetProjectsMutation,
} from "../../redux/api/edApi";
import { LuLoader, LuLoaderCircle } from "react-icons/lu";
import { IMAGE_BASE_URL } from "../../config/constant";
import SingleSelect from "../../components/ui/form/SingleSelect";

const Projects = () => {
  const [tabs, setTabs] = useState(PROJECT_TAB_TYPES.ALL);
  const [getCategories, { isLoading: categoriesLoading }] =
    useGetCategoriesMutation();
  const [getProjects, { isLoading: projectsLoading }] =
    useGetProjectsMutation();
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await getCategories().unwrap();
      if (res.success) {
        setCategories([
          { _id: PROJECT_TAB_TYPES.ALL, name: "All" },
          ...res.data,
        ]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await getProjects(
        `categoryId=${tabs == PROJECT_TAB_TYPES.ALL ? "" : tabs}`
      ).unwrap();
      if (res.success) {
        setProjects(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [tabs]);
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Wrapper>
      <div className="space-y-6 text-neutral-500">
        {/* Tabs for md+ */}
        <div className="md:flex hidden flex-wrap gap-x-6 gap-y-2">
          {categoriesLoading ? (
            <div className="flex items-center justify-center">Loading...</div>
          ) : (
            categories?.map((category) => (
              <div
                key={category._id}
                onClick={() => setTabs(category._id)}
                className={`cursor-pointer py-1 rounded-md transition ${
                  tabs === category._id
                    ? "font-bold text-black bg-gray-200"
                    : "hover:text-gray-600"
                }`}
              >
                {category.name}
              </div>
            ))
          )}
        </div>

        {/* Dropdown for <md */}
        <div className="md:hidden">
          <SingleSelect
            options={categories.map((category) => ({
              value: category._id,
              label: category.name,
            }))}
            value={tabs}
            onChange={(val) => setTabs(val)}
          />
        </div>

        {/* Project Grid */}
        {projectsLoading ? (
          <div className="flex h-96 items-center justify-center">
            <LuLoaderCircle size={24} className="animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-6">
            {projects?.length > 0 ? (
              projects?.map((item, idx) => (
                <Link key={idx} to={`/project/${item._id}`} className="w-full">
                  <div className="relative w-full aspect-[2.2/1] group overflow-hidden">
                    <img
                      src={IMAGE_BASE_URL + item.images[0]}
                      alt={`project-${idx + 1}`}
                      className="object-cover cursor-pointer group-hover:opacity-70 transition-opacity shadow-sm hover:shadow-md"
                    />

                    {/* Overlay text */}
                    <div
                      className="absolute bottom-0 left-0 w-full h-full
                           bg-[#FFFFFF91] text-black text-sm p-2 
                           opacity-0 group-hover:opacity-100 
                           transition-opacity flex flex-col items-center justify-end duration-1000 ease-in-out"
                    >
                      <div>{item.title}</div>
                      <div>{item.category.name}</div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex col-span-3 h-96 items-center justify-center">
                No projects found
              </div>
            )}
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default Projects;
