"use client";

import { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { mediaUrl, PortfolioProject, techIcon } from "@/lib/portfolio";

export default function ProjectModal({
  project,
  onClose,
}: {
  project: PortfolioProject;
  onClose: () => void;
}) {
  const images = [
    ...(project.cover_image
      ? [{ id: 0, image_path: project.cover_image, caption: project.title }]
      : []),
    ...project.images,
  ];

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[6000] flex items-center justify-center bg-black/75 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-3xl border border-white/10 bg-black-100 p-6 md:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-purple">
              Project details
            </p>
            <h3 className="mt-2 text-2xl font-bold md:text-3xl">{project.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-white/15 p-2"
            aria-label="Close"
          >
            <IoClose size={18} />
          </button>
        </div>

        {project.short_description ? (
          <p className="mt-4 text-white-100">{project.short_description}</p>
        ) : null}
        {project.details ? (
          <p className="mt-3 whitespace-pre-line text-white-200">{project.details}</p>
        ) : null}

        {images.length ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {images.map((image) => (
              <img
                key={`${image.id}-${image.image_path}`}
                src={mediaUrl(image.image_path)}
                alt={image.caption || project.title}
                className="h-48 w-full rounded-2xl object-cover"
              />
            ))}
          </div>
        ) : null}

        {project.technologies?.length ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {project.technologies.map((tech) => {
              const icon = techIcon(tech);
              return (
                <span
                  key={tech}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black px-3 py-1 text-sm"
                >
                  {icon ? <img src={icon} alt="" className="h-4 w-4" /> : null}
                  {tech}
                </span>
              );
            })}
          </div>
        ) : null}

        <div className="mt-6 rounded-2xl border border-white/10 bg-[#070b24] p-4">
          {project.access_type === "confidential" ? (
            <p className="leading-7 text-white-100">{project.confidential_message}</p>
          ) : (
            <div className="flex flex-wrap gap-4">
              {project.live_url ? (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-purple"
                >
                  Check Live Site
                </a>
              ) : null}
              {project.github_url ? (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-purple"
                >
                  Check GitHub Repo
                </a>
              ) : null}
              {!project.live_url && !project.github_url ? (
                <p className="text-white-200">No public link for this project yet.</p>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
