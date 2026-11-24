import { useEffect, useState } from "react";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  Linkedin,
  Github,
  CheckCircle2,
} from "lucide-react";

import SectionHeading from "./SectionHeading";
import { apiRequest } from "../services/api";

export default function Contact() {
  const [profile, setProfile] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    apiRequest("/portfolio")
      .then((response) => {
        if (alive) {
          const data = response?.data || response;
          setProfile(data?.profile || {});
        }
      })
      .catch((err) => {
        console.error("Profile loading error:", err);
      });

    return () => {
      alive = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await apiRequest("/contacts", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      setSuccess(
        response.message || "Your message has been received successfully!"
      );

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error("Contact submission error:", err);
      setError(err.message || "Unable to send your message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Read the correct phone field from MongoDB
  const phoneNumber = String(
    profile.phoneDisplay || profile.phone || ""
  ).trim();

  const phoneForLink = phoneNumber.replace(/[^\d+]/g, "");

  const contactItems = [
    {
      icon: Mail,
      title: "Email Address",
      value: profile.email || "Email not available",
      href: profile.email ? `mailto:${profile.email}` : null,
    },
    {
      icon: Phone,
      title: "Phone Number",
      value: phoneNumber || "Phone not available",
      href: phoneForLink ? `tel:${phoneForLink}` : null,
    },
    {
      icon: MapPin,
      title: "Location",
      value: profile.location || "Location not available",
      href: null,
    },
  ];

  return (
    <section id="contact" className="section-pad bg-white dark:bg-[#080f0d]">
      <div className="section-shell">
        <SectionHeading
          eyebrow="LET'S CONNECT"
          title="Get In Touch"
          description="Have a project in mind or want to work together? Feel free to send me a message."
        />

        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="h-full rounded-3xl bg-[#10251c] p-7 text-white shadow-xl shadow-emerald-950/10 sm:p-9">
              <span className="inline-flex rounded-xl bg-emerald-500/15 p-3 text-emerald-400">
                <Mail size={25} />
              </span>

              <h3 className="mt-6 text-2xl font-bold">
                Let's Talk About Your Project
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                I'm always interested in hearing about new opportunities,
                creative ideas, and exciting projects.
              </p>

              <div className="mt-9 space-y-7">
                {contactItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.title} className="flex items-start gap-4">
                      <span className="rounded-xl bg-emerald-500/15 p-3 text-emerald-400">
                        <Icon size={20} />
                      </span>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-300">
                          {item.title}
                        </p>

                        {item.href ? (
                          <a
                            href={item.href}
                            className="mt-1 block break-all text-sm text-white transition-colors hover:text-emerald-400"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="mt-1 text-sm text-white">
                            {item.value}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-10 border-t border-white/10 pt-7">
                <p className="mb-4 text-sm font-semibold text-slate-300">
                  Connect With Me
                </p>

                <div className="flex gap-3">
                  {profile.github && (
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="GitHub"
                      className="rounded-xl bg-white/10 p-3 transition-all hover:-translate-y-1 hover:bg-emerald-600"
                    >
                      <Github size={19} />
                    </a>
                  )}

                  {profile.linkedin && (
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="LinkedIn"
                      className="rounded-xl bg-white/10 p-3 transition-all hover:-translate-y-1 hover:bg-emerald-600"
                    >
                      <Linkedin size={19} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-[#f8faf9] p-7 shadow-sm dark:border-white/10 dark:bg-[#111b17] sm:p-9 lg:col-span-3">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Send Me a Message
            </h3>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Fill out the form below and I'll get back to you.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Your Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-white/10 dark:bg-[#0b1510] dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    maxLength={150}
                    placeholder="Enter your email"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-white/10 dark:bg-[#0b1510] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Subject
                </label>

                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  maxLength={200}
                  placeholder="What is this about?"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-white/10 dark:bg-[#0b1510] dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Your Message
                </label>

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  minLength={5}
                  maxLength={5000}
                  rows={6}
                  placeholder="Write your message here..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-white/10 dark:bg-[#0b1510] dark:text-white"
                />
              </div>

              {success && (
                <div
                  role="status"
                  className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                >
                  <CheckCircle2 size={19} />
                  {success}
                </div>
              )}

              {error && (
                <p
                  role="alert"
                  className="rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-emerald-600 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {loading ? "Sending..." : "Send Message"}
                <Send size={17} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
