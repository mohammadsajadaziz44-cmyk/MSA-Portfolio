import { useEffect, useState } from "react";
import {
  UserRound,
  BriefcaseBusiness,
  GraduationCap,
  Target,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

import SectionHeading from "./SectionHeading";
import { profile as defaultProfile } from "../data/portfolio";
import { apiRequest } from "../services/api";

const defaultAbout = {
  heading: "About Me",
  paragraph1:
    "I am passionate about technology and building modern digital experiences.",
  paragraph2:
    "I enjoy learning new technologies and creating useful solutions through code.",
  currentRole: "Web Developer",
  education: "Computer Science",
  goal: "Becoming a Full-Stack Developer",
};

export default function About() {
  const [profile, setProfile] = useState(defaultProfile || {});
  const [about, setAbout] = useState(defaultAbout);

  useEffect(() => {
    let mounted = true;

    async function loadAbout() {
      try {
        const response = await apiRequest("/portfolio");

        if (mounted && response?.data) {
          if (response.data.profile) {
            setProfile(response.data.profile);
          }

          if (response.data.about) {
            setAbout({
              ...defaultAbout,
              ...response.data.about,
            });
          }
        }
      } catch (error) {
        console.error("About loading error:", error);
      }
    }

    loadAbout();

    return () => {
      mounted = false;
    };
  }, []);

  const information = [
    {
      icon: BriefcaseBusiness,
      title: "Current Role",
      value: about.currentRole,
    },
    {
      icon: GraduationCap,
      title: "Education",
      value: about.education,
    },
    {
      icon: Target,
      title: "My Goal",
      value: about.goal,
    },
  ];

  return (
    <section
      id="about"
      className="section-pad relative overflow-hidden bg-[#f4f8f6]"
    >
      <div className="pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl" />

      <div className="section-shell relative">
        <SectionHeading
          eyebrow="GET TO KNOW ME"
          title="About Me"
          description="A little introduction about my background, passion and journey in technology."
        />

        <div className="grid items-stretch gap-8 lg:grid-cols-5">
          {/* About Content */}
          <div className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm transition duration-300 hover:shadow-xl md:p-9 lg:col-span-3">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-600">
                <UserRound size={28} />
              </div>

              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-600">
                  Who I Am
                </p>

                <h3 className="mt-1 text-2xl font-extrabold text-slate-900">
                  {about.heading || "About Me"}
                </h3>
              </div>
            </div>

            <div className="mt-8 space-y-5 text-base leading-8 text-slate-600">
              <p>{about.paragraph1}</p>
              <p>{about.paragraph2}</p>
            </div>

            <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5">
              <div className="flex items-center gap-3">
                <Sparkles size={22} className="text-emerald-600" />

                <h4 className="font-extrabold text-slate-900">My Vision</h4>
              </div>

              <p className="mt-3 leading-7 text-slate-600">{about.goal}</p>
            </div>
          </div>

          {/* Information Cards */}
          <div className="flex flex-col gap-5 lg:col-span-2">
            {information.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group flex flex-1 items-center gap-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
                >
                  <div className="shrink-0 rounded-2xl bg-emerald-50 p-4 text-emerald-600 transition duration-300 group-hover:bg-emerald-600 group-hover:text-white">
                    <Icon size={25} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-500">
                      {item.title}
                    </p>

                    <h4 className="mt-1 break-words text-lg font-extrabold text-slate-900">
                      {item.value || "Not added yet"}
                    </h4>
                  </div>

                  <ArrowUpRight
                    size={19}
                    className="shrink-0 text-slate-300 transition group-hover:text-emerald-600"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
