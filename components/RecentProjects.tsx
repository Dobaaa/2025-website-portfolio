"use client";

import { useState } from "react";
import { FaLocationArrow } from "react-icons/fa6";
import { projects as staticProjects } from "@/data";
import { PinContainer } from "./ui/Pin";
import { usePortfolio } from "./PortfolioProvider";
import ProjectModal from "./ProjectModal";
import { mediaUrl, PortfolioProject, techIcon } from "@/lib/portfolio";

const RecentProjects = () => {
  const { status, data } = usePortfolio();
  const [selected, setSelected] = useState<PortfolioProject | null>(null);

  const projects: PortfolioProject[] =
    status === "ready" && data
      ? data.projects
      : status === "error"
        ? staticProjects.map((item) => ({
        id: item.id,
        title: item.title,
        short_description: item.des,
        details: item.des,
        cover_image: item.img,
        images: [],
        technologies: item.iconLists,
        access_type: "public",
        can_open_live: Boolean(item.link),
            live_url: item.link || null,
            github_url: item.githublink || null,
            confidential_message: null,
          }))
        : [];

  return (
    <div className="py-20 scroll-mt-24" id="projects">
      <h1 className="heading">
        A small selection of{" "}
        <span className="text-purple">recent projects</span>
      </h1>
      <div className="flex flex-wrap items-center justify-center p-4 gap-16 mt-10">
        {projects.map((item) => {
          const icons = (item.technologies || [])
            .map((tech) => techIcon(tech))
            .filter(Boolean);

          return (
            <div
              className="lg:min-h-[32.5rem] h-[25rem] flex items-center justify-center sm:w-96 w-[80vw]"
              key={item.id}
              onClick={() => setSelected(item)}
            >
              <PinContainer title="View details" href="#project">
                <div className="relative flex items-center justify-center sm:w-96 w-[80vw] overflow-hidden h-[20vh] lg:h-[30vh] mb-10">
                  <div
                    className="relative w-full h-full overflow-hidden lg:rounded-3xl"
                    style={{ backgroundColor: "#13162D" }}
                  >
                    <img src="/bg.png" alt="bgimg" />
                  </div>
                  {item.cover_image ? (
                    <img
                      src={mediaUrl(item.cover_image)}
                      alt="cover"
                      className="z-10 absolute bottom-0 top-0 h-full"
                    />
                  ) : null}
                </div>

                <h1 className="font-bold lg:text-2xl md:text-xl text-base line-clamp-1">
                  {item.title}
                </h1>

                <p
                  className="lg:text-xl lg:font-normal font-light text-sm line-clamp-2"
                  style={{
                    color: "#BEC1DD",
                    margin: "1vh 0",
                  }}
                >
                  {item.short_description}
                </p>

                <div className="flex items-center justify-between mt-7 mb-3">
                  <div className="flex items-center">
                    {icons.map((icon, index) => (
                      <div
                        key={`${icon}-${index}`}
                        className="border border-white/[.2] rounded-full bg-black lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center"
                        style={{
                          transform: `translateX(-${5 * index + 2}px)`,
                        }}
                      >
                        <img src={icon} alt="icon5" className="p-2" />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center items-center">
                    <span className="flex lg:text-xl md:text-xs text-sm text-purple">
                      View details
                    </span>
                    <FaLocationArrow className="ms-3" color="#CBACF9" />
                  </div>
                </div>
              </PinContainer>
            </div>
          );
        })}
      </div>
      {selected ? (
        <ProjectModal project={selected} onClose={() => setSelected(null)} />
      ) : null}
    </div>
  );
};

export default RecentProjects;
