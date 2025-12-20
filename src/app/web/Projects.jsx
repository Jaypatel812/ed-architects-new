import React, { useState } from "react";
import { Link } from "react-router-dom";
import Wrapper from "../../components/Wrapper";
import { PROJECT_TAB_TYPES } from "../../utils/constants";

const Projects = () => {
  const [tabs, setTabs] = useState(PROJECT_TAB_TYPES.ALL);

  return (
    <Wrapper>
      <div className="space-y-6 text-neutral-500">
        {/* Tabs for md+ */}
        <div className="md:flex hidden flex-wrap gap-x-6 gap-y-2">
          {Object.values(PROJECT_TAB_TYPES).map((tab) => (
            <div
              key={tab}
              onClick={() => setTabs(tab)}
              className={`cursor-pointer py-1 rounded-md transition ${
                tabs === tab
                  ? "font-bold text-black bg-gray-200"
                  : "hover:text-gray-600"
              }`}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* Dropdown for <md */}
        <div className="md:hidden">
          <select
            value={tabs}
            onChange={(e) => setTabs(e.target.value)}
            className="w-full border rounded-md p-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            {Object.values(PROJECT_TAB_TYPES).map((tab) => (
              <option key={tab} value={tab}>
                {tab}
              </option>
            ))}
          </select>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-6">
          {Array.from({ length: 7 }).map((_, idx) => (
            <Link key={idx} to={`/project/${idx + 1}`} className="w-full">
              <div className="relative w-full aspect-[2.2/1] group overflow-hidden">
                <img
                  src="/images/projects/project.jpeg"
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
                  <div>Project {idx + 1}</div>
                  <div>Some Text</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Wrapper>
  );
};

export default Projects;
