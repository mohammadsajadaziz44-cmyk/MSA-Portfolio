import { useEffect, useState } from "react";
import {
  ArrowRight,
  Download,
  Github,
  Linkedin,
  MapPin,
  Sparkles,
  Code2,
} from "lucide-react";

import { profile as defaultProfile } from "../data/portfolio";
import { apiRequest } from "../services/api";

const backgroundImage =
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=85";

export default function Hero() {
  const [profile, setProfile] = useState(defaultProfile || {});

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        const response = await apiRequest("/portfolio");

        if (mounted && response?.data?.profile) {
          setProfile(response.data.profile);
        }
      } catch (error) {
        console.error("Hero profile loading error:", error);
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const name = profile.name || "Mohammad Sajad Aziz";
  const role = profile.role || "Full Stack Developer";
  const description =
    profile.description ||
    "I build modern, responsive and user-friendly web applications with clean code and creative ideas.";

  const photo = profile.photo || profile.image || "/images/profile.jpeg";

  const cv = profile.cvUrl || profile.resumeUrl || profile.cv;

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden bg-[#f4f8f6] py-20 md:py-28"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: `url("${backgroundImage}")` }}
      />

      {/* Green and White Overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#f4f8f6] via-[#f4f8f6]/95 to-[#e5f5ee]/75" />

      <div className="pointer-events-none absolute -right-24 top-0 -z-10 h-96 w-96 rounded-full bg-emerald-400/15 blur-3xl" />

      <div className="section-shell">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* Left Content */}
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/90 px-4 py-2 text-sm font-bold text-emerald-700 shadow-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              Available for Opportunities
            </div>

            <p className="mt-8 text-sm font-extrabold uppercase tracking-[0.22em] text-emerald-600">
              Hello, I'm
            </p>

            <h1 className="mt-4 max-w-2xl text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              {name}
              <span className="mt-2 block text-emerald-600">{role}</span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-slate-600 md:text-lg">
              {description}
            </p>

            {profile.location && (
              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-slate-500">
                <MapPin size={18} className="text-emerald-600" />
                {profile.location}
              </div>
            )}

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="#contact"
                className="inline-flex items-center gap-3 rounded-xl bg-emerald-600 px-6 py-4 font-bold text-white shadow-lg shadow-emerald-600/20 transition duration-300 hover:-translate-y-1 hover:bg-emerald-700"
              >
                Let's Talk
                <ArrowRight size={19} />
              </a>

              {cv && (
                <a
                  href={cv}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-4 font-bold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:text-emerald-700"
                >
                  Download CV
                  <Download size={19} />
                </a>
              )}
            </div>

            <div className="mt-9 flex items-center gap-3">
              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="rounded-xl border border-slate-200 bg-white p-3 text-slate-600 shadow-sm transition hover:-translate-y-1 hover:bg-emerald-600 hover:text-white"
                >
                  <Github size={21} />
                </a>
              )}

              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="rounded-xl border border-slate-200 bg-white p-3 text-slate-600 shadow-sm transition hover:-translate-y-1 hover:bg-emerald-600 hover:text-white"
                >
                  <Linkedin size={21} />
                </a>
              )}
            </div>
          </div>

          {/* Right Profile Image */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-5 rounded-[2.5rem] bg-emerald-500/15 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white p-3 shadow-2xl shadow-emerald-900/10">
              <div className="relative overflow-hidden rounded-[1.5rem] bg-emerald-50">
                <img
                  src={photo}
                  alt={name}
                  onError={(event) => {
                    event.currentTarget.src = "/images/profile.jpeg";
                  }}
                  className="aspect-[4/5] w-full object-cover"
                />

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-7 pt-20">
                  <p className="text-sm font-semibold text-emerald-300">
                    <Sparkles size={15} className="mr-2 inline" />
                    Welcome to my portfolio
                  </p>
                  <h2 className="mt-2 text-2xl font-extrabold text-white">
                    {name}
                  </h2>
                </div>
              </div>
            </div>

            <div className="absolute -left-7 top-12 hidden items-center gap-3 rounded-2xl border border-emerald-100 bg-white p-4 shadow-xl sm:flex">
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <Code2 size={24} />
              </div>
              <div>
                <p className="text-sm font-extrabold text-slate-800">
                  Creative Developer
                </p>
                <p className="text-xs text-slate-500">Building Digital Ideas</p>
              </div>
            </div>

            <div className="absolute -bottom-5 -right-5 hidden rounded-2xl border border-emerald-100 bg-white p-4 shadow-xl sm:block">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-700">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Always Learning
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
