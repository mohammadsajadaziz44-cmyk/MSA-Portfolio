import { useEffect, useState } from "react";
import { Code2, Palette, Wrench, Sparkles, ArrowUpRight } from "lucide-react";

import SectionHeading from "./SectionHeading";
import { skills as defaultSkills } from "../data/portfolio";
import { apiRequest } from "../services/api";

const groups = [
  {
    name: "Frontend",
    icon: Code2,
    description: "Modern web development technologies",
  },
  {
    name: "Design",
    icon: Palette,
    description: "Creative design and user experiences",
  },
  {
    name: "Tools",
    icon: Wrench,
    description: "Development and productivity tools",
  },
];

// Convert comma-separated skill names into individual skills
function getIndividualSkills(skills, groupName) {
  return skills
    .filter((skill) => skill.group === groupName)
    .flatMap((skill) =>
      String(skill.name || "")
        .split(/[,\n]+/)
        .map((name) => name.trim())
        .filter(Boolean)
    );
}

export default function Skills() {
  const [skills, setSkills] = useState(defaultSkills || []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSkills() {
      try {
        const response = await apiRequest("/portfolio");

        if (mounted && Array.isArray(response?.data?.skills)) {
          setSkills(
            response.data.skills.length > 0
              ? response.data.skills
              : defaultSkills || []
          );
        }
      } catch (error) {
        console.error("Skills loading error:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadSkills();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section
      id="skills"
      className="section-pad relative overflow-hidden bg-white"
    >
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-emerald-100/60 blur-3xl" />

      <div className="section-shell relative">
        <SectionHeading
          eyebrow="MY TECHNICAL EXPERTISE"
          title="Skills & Technologies"
          description="Technologies and tools I use to build modern, responsive and user-friendly digital experiences."
        />

        <div className="mb-9 flex items-center gap-4 rounded-2xl border border-emerald-100 bg-[#effbf5] p-5">
          <div className="rounded-xl bg-white p-3 text-emerald-600 shadow-sm">
            <Sparkles size={25} />
          </div>

          <div>
            <h3 className="font-extrabold text-slate-900">
              My Development Toolkit
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Always learning, improving and exploring new technologies.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-72 animate-pulse rounded-3xl bg-slate-100"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {groups.map((group) => {
              const Icon = group.icon;

              const groupSkills = getIndividualSkills(skills, group.name);

              return (
                <div
                  key={group.name}
                  className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:border-emerald-200 hover:shadow-xl"
                >
                  <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-green-300" />

                  <div className="p-7">
                    <div className="flex items-center justify-between">
                      <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-600 transition duration-300 group-hover:bg-emerald-600 group-hover:text-white">
                        <Icon size={27} />
                      </div>

                      <span className="rounded-full bg-[#effbf5] px-3 py-1.5 text-xs font-extrabold text-emerald-700">
                        {groupSkills.length}{" "}
                        {groupSkills.length === 1 ? "Skill" : "Skills"}
                      </span>
                    </div>

                    <h3 className="mt-6 text-xl font-extrabold text-slate-900">
                      {group.name}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {group.description}
                    </p>

                    <div className="my-6 h-px bg-slate-100" />

                    <div className="flex flex-wrap gap-2">
                      {groupSkills.length > 0 ? (
                        groupSkills.map((skill, index) => (
                          <span
                            key={`${group.name}-${skill}-${index}`}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700 transition duration-200 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                          >
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-slate-400">
                          No skills added yet.
                        </p>
                      )}
                    </div>

                    <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5">
                      <span className="text-xs font-extrabold tracking-wider text-emerald-600">
                        CONTINUOUS LEARNING
                      </span>

                      <ArrowUpRight
                        size={19}
                        className="text-slate-300 transition group-hover:text-emerald-600"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
