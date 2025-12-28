import React, { useEffect, useState } from "react";
import Wrapper from "../../components/Wrapper";
import { useParams } from "react-router-dom";
import { useGetProjectByIdMutation } from "../../redux/api/edApi";
import { LuLoaderCircle } from "react-icons/lu";

const ProjectDetail = () => {
  const { id } = useParams();
  const [getProjectById, { isLoading }] = useGetProjectByIdMutation();
  const [projectDetail, setProjectDetail] = useState(null);

  const fetchProjectDetail = async () => {
    try {
      const res = await getProjectById(id).unwrap();
      if (res.success) {
        setProjectDetail(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch project details", error);
    }
  };

  useEffect(() => {
    fetchProjectDetail();
  }, [id]);

  return (
    <Wrapper>
      {isLoading ? (
        <div className="flex h-96 items-center justify-center">
          <LuLoaderCircle size={24} className="animate-spin" />
        </div>
      ) : (
        <div className="space-y-10 text-neutral-500">
          {/* Project Image */}
          <img
            src="/images/projects/project.jpeg"
            alt="project"
            className="w-full max-w-4xl mx-auto aspect-video object-cover shadow-md"
            width={800}
            height={800}
            priority="true"
          />

          {/* Project Content */}
          <div className="space-y-6">
            <div className="text-center font-bold text-xl sm:text-2xl md:text-3xl leading-snug">
              {projectDetail?.title}
            </div>
            <div className="flex justify-between gap-2">
              <div>Location: {projectDetail?.location}</div>
              <div>Client: {projectDetail?.client}</div>
              <div>Built Up Area: {projectDetail?.builtUpArea || "N/A"}</div>
              <div>Site Area: {projectDetail?.siteArea || "N/A"}</div>
            </div>
            <div className="space-y-4 text-justify leading-relaxed text-gray-700">
              {projectDetail?.description.map((item, idx) => (
                <p key={idx}>{item}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </Wrapper>
  );
};

export default ProjectDetail;
