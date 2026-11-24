import { useEffect, useState } from "react";
import {
  Home,
  UserRound,
  Sparkles,
  GraduationCap,
  FolderKanban,
  Mail,
  FileText,
  Menu,
  X,
} from "lucide-react";

import { profile as defaultProfile } from "../data/portfolio";
import { apiRequest } from "../services/api";

const links = [
  ["Home", "home"],
  ["About", "about"],
  ["Skills", "skills"],
  ["Education", "education"],
  ["Projects", "projects"],
  ["Contact", "contact"],
];

export default function Navbar() {
  const [profile, setProfile] = useState(defaultProfile);
  const [active, setActive] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let alive = true;

    apiRequest("/portfolio")
      .then((response) => {
        if (alive && response?.data?.profile) {
          setProfile({
            ...defaultProfile,
            ...response.data.profile,
          });
        }
      })
      .catch((error) => console.error("Failed to load profile:", error));

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-25% 0px -65% 0px" }
    );

    links.forEach(([, id]) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const goTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });

    setActive(id);
    setMobileOpen(false);
  };

  const logo = profile.logo || "/images/msa-logo.jpeg";
  const brand = profile.brand || defaultProfile.brand;
  const cv = profile.cv || defaultProfile.cv;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex min-h-[82px] max-w-[1500px] items-center justify-between gap-5 px-5 py-3 sm:px-8 lg:px-12">
        {/* Original Logo and Brand */}
        <button
          onClick={() => goTo("home")}
          className="flex shrink-0 items-center gap-3"
        >
          <img
            src={logo}
            alt="MSA Logo"
            className="h-12 w-12 rounded-xl object-contain"
            onError={(e) => {
              e.currentTarget.src = "/images/msa-logo.jpeg";
            }}
          />

          <span className="text-left">
            <strong className="block text-lg font-extrabold tracking-tight text-slate-900">
              {brand}
            </strong>
            <small className="text-xs font-medium text-slate-500">
              Developer Portfolio
            </small>
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 xl:flex">
          {links.map(([label, id]) => (
            <button
              key={id}
              onClick={() => goTo(id)}
              className={`rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-200 ${
                active === id
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* CV Button */}
        {cv && (
          <a
            href={cv}
            target="_blank"
            rel="noreferrer"
            className="hidden shrink-0 items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-600 sm:flex"
          >
            <FileText size={17} />
            Download CV
          </a>
        )}

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-800 transition hover:bg-emerald-50 xl:hidden"
        >
          {mobileOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white px-5 py-4 shadow-xl xl:hidden">
          <nav className="mx-auto flex max-w-[1500px] flex-col gap-2">
            {links.map(([label, id]) => (
              <button
                key={id}
                onClick={() => goTo(id)}
                className={`flex items-center rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                  active === id
                    ? "bg-emerald-600 text-white"
                    : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                }`}
              >
                {label}
              </button>
            ))}

            {cv && (
              <a
                href={cv}
                target="_blank"
                rel="noreferrer"
                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 font-bold text-white"
              >
                <FileText size={17} />
                Download CV
              </a>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
