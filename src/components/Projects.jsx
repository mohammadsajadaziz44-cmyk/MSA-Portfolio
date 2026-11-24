import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Github,
  ExternalLink,
  FolderCode,
  Code2,
  Image as ImageIcon,
} from "lucide-react";

import SectionHeading from "./SectionHeading";
import { apiRequest } from "../services/api";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await apiRequest("/projects");

        const data = response?.data || response;

        const projectList = Array.isArray(data)
          ? data
          : Array.isArray(data?.projects)
            ? data.projects
            : [];

        setProjects(projectList);
      } catch (error) {
        console.error("Projects loading error:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Supports different possible image field names
  const getProjectImage = (project) => {
    return (
      project.imageUrl ||
      project.image ||
      project.projectImage ||
      project.imageURL ||
      project.photo ||
      ""
    );
  };

  // Supports string or array technologies
  const getTechnologies = (technologies) => {
    if (Array.isArray(technologies)) {
      return technologies;
    }

    if (typeof technologies === "string") {
      return technologies
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return [];
  };

  return (
    <section
      id="projects"
      className="section-pad bg-[#f5f8f6] dark:bg-[#080f0d]"
    >
      <div className="section-shell">
        <SectionHeading
          eyebrow="MY RECENT WORK"
          title="Featured Projects"
          description="Explore some of the projects I have built using modern technologies."
        />

        {loading ? (
          <div className="py-16 text-center text-slate-500">
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-3xl border border-emerald-100 bg-white p-12 text-center shadow-sm dark:border-white/10 dark:bg-[#111b17]">
            <FolderCode size={42} className="mx-auto mb-4 text-emerald-600" />

            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
              No Projects Yet
            </h3>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
              My projects will appear here soon.
            </p>
          </div>
        ) : (
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => {
              const image = getProjectImage(project);
              const technologies = getTechnologies(project.technologies);

              return (
                <article
                  key={project._id || project.id || index}
                  className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/10 dark:border-white/10 dark:bg-[#111b17]"
                >
                  {/* Project Image */}
                  <div className="relative h-52 overflow-hidden bg-emerald-50 dark:bg-[#17251e]">
                    {image ? (
                      <img
                        src={image}
                        alt={project.title || "Project image"}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                          event.currentTarget.parentElement.classList.add(
                            "flex",
                            "items-center",
                            "justify-center"
                          );
                        }}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ImageIcon size={58} className="text-emerald-300" />
                      </div>
                    )}

                    {project.featured && (
                      <span className="absolute left-4 top-4 rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white shadow-lg">
                        Featured
                      </span>
                    )}

                    {project.category && (
                      <span className="absolute bottom-4 left-4 rounded-full border border-white/40 bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-700 backdrop-blur">
                        {project.category}
                      </span>
                    )}
                  </div>

                  {/* Project Details */}
                  <div className="p-6">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <h3 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400">
                        {project.title || "Untitled Project"}
                      </h3>

                      <ArrowUpRight
                        size={21}
                        className="shrink-0 text-emerald-600 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                      />
                    </div>

                    <p className="mb-5 line-clamp-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                      {project.description ||
                        "A project created using modern web technologies."}
                    </p>

                    {/* Technologies */}
                    {technologies.length > 0 && (
                      <div className="mb-6 flex flex-wrap gap-2">
                        {technologies.map((technology, techIndex) => (
                          <span
                            key={`${technology}-${techIndex}`}
                            className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                          >
                            {technology}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Project Links */}
                    <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5 dark:border-white/10">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:border-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:border-white/10 dark:text-slate-300 dark:hover:bg-emerald-500/10"
                        >
                          <Github size={16} />
                          GitHub
                        </a>
                      )}

                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-700"
                        >
                          <ExternalLink size={16} />
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
