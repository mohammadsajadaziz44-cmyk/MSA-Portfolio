import { useEffect, useState } from "react";
import {
  GraduationCap,
  BookOpen,
  CalendarDays,
  MapPin,
  Award,
  Sparkles,
} from "lucide-react";

import SectionHeading from "./SectionHeading";
import { education as defaultEducation } from "../data/portfolio";
import { apiRequest } from "../services/api";

export default function Education() {
  const [education, setEducation] = useState(defaultEducation || []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadEducation() {
      try {
        const response = await apiRequest("/portfolio");

        if (mounted && Array.isArray(response?.data?.education)) {
          setEducation(
            response.data.education.length > 0
              ? response.data.education
              : defaultEducation || []
          );
        }
      } catch (error) {
        console.error("Education loading error:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadEducation();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section
      id="education"
      className="section-pad relative overflow-hidden bg-[#f4f8f6]"
    >
      <div className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />

      <div className="section-shell relative">
        <SectionHeading
          eyebrow="MY LEARNING JOURNEY"
          title="Education & Qualifications"
          description="My educational background and the journey that continues to shape my knowledge and skills."
        />

        <div className="mb-10 flex items-center gap-4 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
            <Sparkles size={25} />
          </div>

          <div>
            <h3 className="font-extrabold text-slate-900">
              Learning Never Stops
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Every step in education creates new opportunities.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="mx-auto max-w-4xl space-y-5">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-40 animate-pulse rounded-3xl bg-white"
              />
            ))}
          </div>
        ) : education.length > 0 ? (
          <div className="relative mx-auto max-w-4xl">
            <div className="absolute bottom-8 left-6 top-8 w-0.5 bg-gradient-to-b from-emerald-500 via-green-400 to-emerald-100 md:left-8" />

            <div className="space-y-7">
              {education.map((item, index) => {
                const title =
                  item.course ||
                  item.degree ||
                  item.title ||
                  item.qualification ||
                  "Education";

                const institution =
                  item.place ||
                  item.institution ||
                  item.school ||
                  item.university ||
                  "";

                const period =
                  item.year ||
                  item.duration ||
                  item.date ||
                  [item.startYear, item.endYear].filter(Boolean).join(" - ");

                const description =
                  item.detail || item.description || item.details || "";

                const type = item.type || "Education";

                return (
                  <div
                    key={item._id || `${title}-${index}`}
                    className="group relative flex gap-5 md:gap-7"
                  >
                    <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-4 border-[#f4f8f6] bg-emerald-600 text-white shadow-lg transition duration-300 group-hover:scale-110 group-hover:bg-emerald-700 md:h-16 md:w-16">
                      {type === "School" ? (
                        <GraduationCap size={26} />
                      ) : type === "Certificates" ? (
                        <Award size={25} />
                      ) : (
                        <BookOpen size={25} />
                      )}
                    </div>

                    <div className="mb-2 min-w-0 flex-1 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl md:p-8">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-700">
                          {type.toUpperCase()}
                        </span>

                        {period && (
                          <span className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                            <CalendarDays
                              size={16}
                              className="text-emerald-600"
                            />
                            {period}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-5 text-xl font-extrabold text-slate-900 md:text-2xl">
                        {title}
                      </h3>

                      {institution && (
                        <p className="mt-3 flex items-center gap-2 font-semibold text-emerald-700">
                          <MapPin size={17} />
                          {institution}
                        </p>
                      )}

                      {description && (
                        <p className="mt-4 text-sm leading-7 text-slate-600">
                          {description}
                        </p>
                      )}

                      <div className="mt-6 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs font-extrabold tracking-wide text-emerald-600">
                        <BookOpen size={16} />
                        KNOWLEDGE & GROWTH
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-emerald-200 bg-white p-12 text-center">
            <GraduationCap size={45} className="mx-auto text-emerald-400" />
            <h3 className="mt-4 font-extrabold text-slate-900">
              Education Coming Soon
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Education information will appear here when added.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
