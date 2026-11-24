import { useEffect, useState } from "react";
import { Github, Linkedin, Mail, ArrowUp, Code2 } from "lucide-react";
import { apiRequest } from "../services/api";

export default function Footer() {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await apiRequest("/portfolio");
        setProfile(response?.data?.profile || response?.profile || {});
      } catch (error) {
        console.error("Footer profile error:", error);
      }
    };

    loadProfile();
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#10251c] text-white">
      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="section-shell relative py-14">
        <div className="flex flex-col items-center justify-between gap-8 border-b border-white/10 pb-10 text-center md:flex-row md:text-left">
          <div>
            <a
              href="#home"
              className="inline-flex items-center gap-3 text-2xl font-extrabold tracking-tight"
            >
              <span className="rounded-xl bg-emerald-500 p-2 text-white">
                <Code2 size={24} />
              </span>
              <span>
                {profile.name || "My Portfolio"}
                <span className="text-emerald-400">.</span>
              </span>
            </a>

            <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
              Building modern digital experiences with creativity, passion, and
              clean code.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {profile.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="rounded-xl border border-white/10 bg-white/5 p-3 text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:bg-emerald-600 hover:text-white"
              >
                <Github size={20} />
              </a>
            )}

            {profile.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="rounded-xl border border-white/10 bg-white/5 p-3 text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:bg-emerald-600 hover:text-white"
              >
                <Linkedin size={20} />
              </a>
            )}

            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                aria-label="Email"
                className="rounded-xl border border-white/10 bg-white/5 p-3 text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:bg-emerald-600 hover:text-white"
              >
                <Mail size={20} />
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-5 pt-8 text-center sm:flex-row">
          <p className="text-sm text-slate-400">
            © {currentYear} {profile.name || "My Portfolio"}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
