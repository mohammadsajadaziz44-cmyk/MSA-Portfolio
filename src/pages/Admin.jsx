import { useCallback, useEffect, useState } from "react";
import {
  LayoutDashboard,
  User,
  UserRound,
  Code2,
  GraduationCap,
  FolderKanban,
  Mail,
  LogOut,
  Menu,
  X,
  RefreshCw,
  Save,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Github,
  MapPin,
  BriefcaseBusiness,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Eye,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { apiRequest, authHeaders } from "../services/api";

const emptyProfile = {
  name: "",
  brand: "",
  role: "",
  heroDescription: "",
  location: "",
  email: "",
  phoneDisplay: "",
  whatsapp: "",
  github: "",
  linkedin: "",
  cv: "",
  photo: "",
  logo: "",
};

const emptyAbout = {
  heading: "",
  paragraph1: "",
  paragraph2: "",
  currentRole: "",
  education: "",
  goal: "",
};

const emptyProject = {
  title: "",
  category: "Frontend Development",
  description: "",
  technologies: "",
  liveUrl: "",
  githubUrl: "",
  imageUrl: "",
  featured: false,
  order: 0,
};

const emptySkill = { name: "", group: "Frontend" };

const emptyEducation = {
  place: "",
  course: "",
  detail: "",
  type: "School",
};

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition duration-200 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";

const labelClass = "block text-sm font-semibold text-slate-700";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "profile", label: "Profile Information", icon: User },
  { id: "about", label: "About Me", icon: UserRound },
  { id: "skills", label: "My Skills", icon: Code2 },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "messages", label: "Messages", icon: Mail },
];

function Field({ label, children, className = "" }) {
  return (
    <label className={`${labelClass} ${className}`}>
      {label}
      {children}
    </label>
  );
}

function SectionHeading({ eyebrow, title, description, icon: Icon }) {
  return (
    <div className="mb-7 flex items-start gap-4">
      <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
        <Icon size={24} />
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
          {eyebrow}
        </p>
        <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-800">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>
    </div>
  );
}

function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition duration-300 hover:shadow-md sm:p-7 ${className}`}
    >
      {children}
    </div>
  );
}

export default function Admin() {
  const [token, setToken] = useState(
    () => localStorage.getItem("msa-admin-token") || ""
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [admin, setAdmin] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("msa-admin-user") || "null");
    } catch {
      return null;
    }
  });

  const [activeSection, setActiveSection] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  const [projects, setProjects] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [portfolio, setPortfolio] = useState(null);

  const [profileForm, setProfileForm] = useState(emptyProfile);
  const [aboutForm, setAboutForm] = useState(emptyAbout);

  const [skills, setSkills] = useState([]);
  const [skillForm, setSkillForm] = useState(emptySkill);
  const [editingSkillIndex, setEditingSkillIndex] = useState(-1);

  const [educationItems, setEducationItems] = useState([]);
  const [educationForm, setEducationForm] = useState(emptyEducation);
  const [editingEducationIndex, setEditingEducationIndex] = useState(-1);

  const [projectForm, setProjectForm] = useState(emptyProject);
  const [editingId, setEditingId] = useState("");

  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState({ type: "", text: "" });

  const logout = useCallback(() => {
    localStorage.removeItem("msa-admin-token");
    localStorage.removeItem("msa-admin-user");
    setToken("");
    setAdmin(null);
    setProjects([]);
    setContacts([]);
    setPortfolio(null);
    setProfileForm(emptyProfile);
    setAboutForm(emptyAbout);
    setSkills([]);
    setEducationItems([]);
  }, []);

  const loadDashboard = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const headers = authHeaders();

      const [projectResult, contactResult, portfolioResult] = await Promise.all(
        [
          apiRequest("/projects", { headers }),
          apiRequest("/contacts", { headers }),
          apiRequest("/portfolio"),
        ]
      );

      const data = portfolioResult.data || {};

      setProjects(Array.isArray(projectResult.data) ? projectResult.data : []);
      setContacts(Array.isArray(contactResult.data) ? contactResult.data : []);
      setPortfolio(data);

      setProfileForm({
        ...emptyProfile,
        ...(data.profile || {}),
      });

      setAboutForm({
        ...emptyAbout,
        ...(data.about || {}),
      });

      setSkills(Array.isArray(data.skills) ? data.skills : []);
      setEducationItems(Array.isArray(data.education) ? data.education : []);

      setNotice({ type: "", text: "" });
    } catch (error) {
      setNotice({ type: "error", text: error.message });
      if (/token|session|login/i.test(error.message)) logout();
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  async function handleLogin(event) {
    event.preventDefault();
    setBusy(true);
    setNotice({ type: "", text: "" });

    try {
      const result = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("msa-admin-token", result.token);
      localStorage.setItem("msa-admin-user", JSON.stringify(result.admin));

      setToken(result.token);
      setAdmin(result.admin);
      setPassword("");
      setNotice({ type: "success", text: "Login successful!" });
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    } finally {
      setBusy(false);
    }
  }

  function updateProfileField(field, value) {
    setProfileForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function saveProfile(event) {
    event.preventDefault();
    setBusy(true);

    try {
      const result = await apiRequest("/portfolio", {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ profile: profileForm }),
      });

      setPortfolio(result.data);
      setProfileForm({
        ...emptyProfile,
        ...(result.data?.profile || {}),
      });
      setNotice({
        type: "success",
        text: "Profile information saved successfully!",
      });
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    } finally {
      setBusy(false);
    }
  }

  async function savePortfolioField(field, value, successMessage) {
    setBusy(true);

    try {
      const result = await apiRequest("/portfolio", {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ [field]: value }),
      });

      const data = result.data || {};
      setPortfolio(data);

      if (field === "about") {
        setAboutForm({ ...emptyAbout, ...(data.about || value) });
      }
      if (field === "skills") {
        setSkills(Array.isArray(data.skills) ? data.skills : value);
      }
      if (field === "education") {
        setEducationItems(
          Array.isArray(data.education) ? data.education : value
        );
      }

      setNotice({ type: "success", text: successMessage });
      return true;
    } catch (error) {
      setNotice({ type: "error", text: error.message });
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function saveAbout(event) {
    event.preventDefault();
    await savePortfolioField(
      "about",
      aboutForm,
      "About information saved successfully!"
    );
  }

  async function saveSkill(event) {
    event.preventDefault();
    const name = skillForm.name.trim();
    if (!name) return;

    const updated = [...skills];
    if (editingSkillIndex >= 0) {
      updated[editingSkillIndex] = { ...skillForm, name };
    } else {
      updated.push({ ...skillForm, name });
    }

    const success = await savePortfolioField(
      "skills",
      updated,
      editingSkillIndex >= 0
        ? "Skill updated successfully!"
        : "New skill added successfully!"
    );

    if (success) {
      setSkillForm(emptySkill);
      setEditingSkillIndex(-1);
    }
  }

  async function deleteSkill(index) {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;

    const updated = skills.filter((_, i) => i !== index);
    const success = await savePortfolioField(
      "skills",
      updated,
      "Skill deleted successfully!"
    );

    if (success) {
      setSkillForm(emptySkill);
      setEditingSkillIndex(-1);
    }
  }

  async function saveEducation(event) {
    event.preventDefault();
    if (!educationForm.place.trim() || !educationForm.course.trim()) return;

    const updated = [...educationItems];
    if (editingEducationIndex >= 0) {
      updated[editingEducationIndex] = { ...educationForm };
    } else {
      updated.push({ ...educationForm });
    }

    const success = await savePortfolioField(
      "education",
      updated,
      editingEducationIndex >= 0
        ? "Education updated successfully!"
        : "Education added successfully!"
    );

    if (success) {
      setEducationForm(emptyEducation);
      setEditingEducationIndex(-1);
    }
  }

  async function deleteEducation(index) {
    if (!window.confirm("Delete this education information?")) return;

    const updated = educationItems.filter((_, i) => i !== index);
    const success = await savePortfolioField(
      "education",
      updated,
      "Education deleted successfully!"
    );

    if (success) {
      setEducationForm(emptyEducation);
      setEditingEducationIndex(-1);
    }
  }

  function editProject(project) {
    setEditingId(project._id);
    setProjectForm({
      title: project.title || "",
      category: project.category || "",
      description: project.description || "",
      technologies: (project.technologies || []).join(", "),
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
      imageUrl: project.imageUrl || "",
      featured: Boolean(project.featured),
      order: project.order || 0,
    });

    setActiveSection("projects");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveProject(event) {
    event.preventDefault();
    setBusy(true);

    const body = {
      ...projectForm,
      technologies: projectForm.technologies
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
      order: Number(projectForm.order),
    };

    try {
      await apiRequest(editingId ? `/projects/${editingId}` : "/projects", {
        method: editingId ? "PUT" : "POST",
        headers: authHeaders(),
        body: JSON.stringify(body),
      });

      const wasEditing = Boolean(editingId);
      setProjectForm(emptyProject);
      setEditingId("");
      await loadDashboard();

      setNotice({
        type: "success",
        text: wasEditing
          ? "Project updated successfully!"
          : "Project added successfully!",
      });
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    } finally {
      setBusy(false);
    }
  }

  async function removeProject(id) {
    if (!window.confirm("Delete this project?")) return;

    try {
      await apiRequest(`/projects/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      await loadDashboard();
      setNotice({ type: "success", text: "Project deleted successfully!" });
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    }
  }

  async function markRead(id) {
    try {
      await apiRequest(`/contacts/${id}/read`, {
        method: "PATCH",
        headers: authHeaders(),
      });
      await loadDashboard();
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    }
  }

  async function removeContact(id) {
    if (!window.confirm("Delete this message?")) return;

    try {
      await apiRequest(`/contacts/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      await loadDashboard();
      setNotice({ type: "success", text: "Message deleted successfully!" });
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    }
  }

  function openSection(id) {
    setActiveSection(id);
    setMobileOpen(false);
    setNotice({ type: "", text: "" });
  }

  const unreadMessages = contacts.filter((item) => !item.isRead).length;

  const pageTitles = {
    dashboard: "Dashboard Overview",
    profile: "Profile Information",
    about: "About Me",
    skills: "My Skills",
    education: "Education",
    projects: "Projects",
    messages: "Contact Messages",
  };

  if (!token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-emerald-50 px-5 py-10">
        <style>{`
          @keyframes riseIn {
            from { opacity: 0; transform: translateY(18px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .rise-in { animation: riseIn .55s ease both; }
        `}</style>

        <form
          onSubmit={handleLogin}
          className="rise-in w-full max-w-md rounded-3xl border border-emerald-100 bg-white p-8 shadow-xl shadow-emerald-900/5"
        >
          <a
            href="/"
            className="text-sm font-bold text-emerald-700 hover:text-emerald-900"
          >
            ← Back to portfolio
          </a>

          <div className="mt-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
            <LayoutDashboard size={28} />
          </div>

          <p className="mt-6 text-xs font-extrabold tracking-[.2em] text-emerald-600">
            MSA DEVELOPER
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-800">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to manage your portfolio.
          </p>

          <Field label="Email">
            <input
              required
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="admin@example.com"
            />
          </Field>

          <Field label="Password" className="mt-5">
            <input
              required
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="Your admin password"
            />
          </Field>

          {notice.text && (
            <p
              role="alert"
              className={`mt-4 rounded-xl p-3 text-sm ${
                notice.type === "error"
                  ? "bg-red-50 text-red-600"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {notice.text}
            </p>
          )}

          <button
            disabled={busy}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:opacity-60"
          >
            {busy ? "Signing in..." : "Sign In"}
            <ChevronRight size={18} />
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f8f6] text-slate-800">
      <style>{`
        @keyframes riseIn {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes softPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,.12); }
          50% { box-shadow: 0 0 0 7px rgba(16,185,129,0); }
        }
        .dashboard-enter { animation: riseIn .45s ease both; }
        .sidebar-active { animation: softPulse 2.4s ease-in-out infinite; }
        .nav-link { transition: all .2s ease; }
        .nav-link:hover { transform: translateX(3px); }
        @media (prefers-reduced-motion: reduce) {
          .dashboard-enter, .sidebar-active { animation: none; }
          .nav-link { transition: none; }
        }
      `}</style>

      {mobileOpen && (
        <button
          aria-label="Close sidebar"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-emerald-100 bg-white shadow-xl shadow-emerald-900/5 transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-lg font-black text-white shadow-lg shadow-emerald-600/20">
              M
            </div>
            <div>
              <p className="font-extrabold tracking-tight text-slate-800">
                MSA Developer
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-emerald-600">
                Admin Panel
              </p>
            </div>
          </a>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-5 pb-3 pt-7">
          <p className="px-3 text-[10px] font-extrabold uppercase tracking-[.2em] text-slate-400">
            Workspace
          </p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => openSection(item.id)}
                className={`nav-link flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold ${
                  active
                    ? "sidebar-active bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                    : "text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"
                }`}
              >
                <Icon size={19} />
                <span className="flex-1">{item.label}</span>
                {item.id === "messages" && unreadMessages > 0 && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {unreadMessages}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-emerald-50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
              {(admin?.name || "A").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-800">
                {admin?.name || "Administrator"}
              </p>
              <p className="truncate text-xs text-slate-500">
                {admin?.email || "Admin account"}
              </p>
            </div>
          </div>

          <a
            href="/"
            className="mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Eye size={18} />
            View Portfolio
            <ExternalLink size={14} className="ml-auto" />
          </a>

          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-[270px]">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-100 bg-white/90 px-4 backdrop-blur-xl sm:px-7">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-emerald-50 lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={21} />
            </button>
            <div>
              <p className="text-xs font-semibold text-emerald-600">
                MSA ADMINISTRATION
              </p>
              <h1 className="text-lg font-extrabold text-slate-800 sm:text-xl">
                {pageTitles[activeSection]}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 sm:inline-flex sm:items-center sm:gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              System Online
            </span>
            <button
              onClick={loadDashboard}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-[1500px] p-4 sm:p-7">
          {notice.text && (
            <div
              role="status"
              className={`mb-6 flex items-center gap-3 rounded-xl border p-4 text-sm font-semibold dashboard-enter ${
                notice.type === "error"
                  ? "border-rose-100 bg-rose-50 text-rose-700"
                  : "border-emerald-100 bg-emerald-50 text-emerald-700"
              }`}
            >
              {notice.type === "error" ? (
                <AlertCircle size={19} />
              ) : (
                <CheckCircle2 size={19} />
              )}
              {notice.text}
            </div>
          )}

          {loading && !portfolio ? (
            <Card>
              <div className="flex items-center gap-3 text-slate-500">
                <RefreshCw className="animate-spin text-emerald-600" />
                Loading your dashboard...
              </div>
            </Card>
          ) : (
            <div key={activeSection} className="dashboard-enter">
              {activeSection === "dashboard" && (
                <>
                  <div className="mb-7 overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-500 p-6 text-white shadow-xl shadow-emerald-700/10 sm:p-8">
                    <div className="flex flex-wrap items-center justify-between gap-5">
                      <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold">
                          <Sparkles size={14} />
                          YOUR PERSONAL WORKSPACE
                        </div>
                        <h2 className="text-2xl font-black sm:text-3xl">
                          Welcome back, {admin?.name || "Admin"}!
                        </h2>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-50">
                          Manage your portfolio content, projects, skills and
                          messages from one beautiful dashboard.
                        </p>
                      </div>
                      <div className="hidden rounded-3xl bg-white/10 p-5 sm:block">
                        <LayoutDashboard size={48} />
                      </div>
                    </div>
                  </div>

                  <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                      {
                        label: "Total Projects",
                        value: projects.length,
                        icon: FolderKanban,
                        color: "bg-blue-50 text-blue-600",
                      },
                      {
                        label: "Total Skills",
                        value: skills.length,
                        icon: Code2,
                        color: "bg-emerald-50 text-emerald-600",
                      },
                      {
                        label: "Education Records",
                        value: educationItems.length,
                        icon: GraduationCap,
                        color: "bg-violet-50 text-violet-600",
                      },
                      {
                        label: "Unread Messages",
                        value: unreadMessages,
                        icon: Mail,
                        color: "bg-amber-50 text-amber-600",
                      },
                    ].map((stat) => {
                      const Icon = stat.icon;
                      return (
                        <div
                          key={stat.label}
                          className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                        >
                          <div
                            className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${stat.color}`}
                          >
                            <Icon size={23} />
                          </div>
                          <p className="text-sm font-medium text-slate-500">
                            {stat.label}
                          </p>
                          <p className="mt-1 text-3xl font-black text-slate-800">
                            {stat.value}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="grid gap-6 xl:grid-cols-[1.3fr_.7fr]">
                    <Card>
                      <div className="mb-5 flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-extrabold text-slate-800">
                            Quick Management
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">
                            Choose a section to update your portfolio.
                          </p>
                        </div>
                        <Sparkles className="text-emerald-500" />
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {navItems.slice(1).map((item) => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.id}
                              onClick={() => openSection(item.id)}
                              className="flex items-center gap-3 rounded-xl border border-slate-100 p-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50"
                            >
                              <span className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                                <Icon size={20} />
                              </span>
                              <span className="flex-1 text-sm font-bold text-slate-700">
                                {item.label}
                              </span>
                              <ChevronRight
                                size={17}
                                className="text-slate-400"
                              />
                            </button>
                          );
                        })}
                      </div>
                    </Card>

                    <Card>
                      <h3 className="text-lg font-extrabold text-slate-800">
                        Account Overview
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Your current portfolio profile.
                      </p>
                      <div className="mt-5 flex items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                          <User size={27} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">
                            {profileForm.name || "Your Name"}
                          </p>
                          <p className="text-sm text-slate-500">
                            {profileForm.role || "Your Role"}
                          </p>
                        </div>
                      </div>
                      <div className="mt-5 space-y-3 border-t border-slate-100 pt-4 text-sm">
                        <p className="flex items-center gap-2 text-slate-500">
                          <Mail size={16} className="text-emerald-600" />
                          {profileForm.email || "Email not added"}
                        </p>
                        <p className="flex items-center gap-2 text-slate-500">
                          <MapPin size={16} className="text-emerald-600" />
                          {profileForm.location || "Location not added"}
                        </p>
                      </div>
                      <button
                        onClick={() => openSection("profile")}
                        className="mt-5 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
                      >
                        Edit Profile
                      </button>
                    </Card>
                  </div>
                </>
              )}

              {activeSection === "profile" && (
                <Card>
                  <SectionHeading
                    eyebrow="PERSONAL DETAILS"
                    title="Profile Information"
                    description="Update the information displayed on your public portfolio."
                    icon={User}
                  />
                  <form
                    onSubmit={saveProfile}
                    className="grid gap-5 sm:grid-cols-2"
                  >
                    <Field label="Full Name">
                      <input
                        required
                        className={inputClass}
                        value={profileForm.name || ""}
                        onChange={(e) =>
                          updateProfileField("name", e.target.value)
                        }
                      />
                    </Field>
                    <Field label="Brand Name">
                      <input
                        className={inputClass}
                        value={profileForm.brand || ""}
                        onChange={(e) =>
                          updateProfileField("brand", e.target.value)
                        }
                      />
                    </Field>
                    <Field label="Job Title / Role">
                      <input
                        className={inputClass}
                        value={profileForm.role || ""}
                        onChange={(e) =>
                          updateProfileField("role", e.target.value)
                        }
                      />
                    </Field>
                    <Field label="Location">
                      <input
                        className={inputClass}
                        value={profileForm.location || ""}
                        onChange={(e) =>
                          updateProfileField("location", e.target.value)
                        }
                      />
                    </Field>
                    <Field label="Email">
                      <input
                        type="email"
                        className={inputClass}
                        value={profileForm.email || ""}
                        onChange={(e) =>
                          updateProfileField("email", e.target.value)
                        }
                      />
                    </Field>
                    <Field label="Phone">
                      <input
                        className={inputClass}
                        value={profileForm.phoneDisplay || ""}
                        onChange={(e) =>
                          updateProfileField("phoneDisplay", e.target.value)
                        }
                      />
                    </Field>
                    <Field label="WhatsApp Number">
                      <input
                        className={inputClass}
                        value={profileForm.whatsapp || ""}
                        onChange={(e) =>
                          updateProfileField("whatsapp", e.target.value)
                        }
                      />
                    </Field>
                    <Field label="GitHub URL">
                      <input
                        className={inputClass}
                        value={profileForm.github || ""}
                        onChange={(e) =>
                          updateProfileField("github", e.target.value)
                        }
                      />
                    </Field>
                    <Field label="LinkedIn URL">
                      <input
                        className={inputClass}
                        value={profileForm.linkedin || ""}
                        onChange={(e) =>
                          updateProfileField("linkedin", e.target.value)
                        }
                      />
                    </Field>
                    <Field label="CV PDF Link">
                      <input
                        className={inputClass}
                        value={profileForm.cv || ""}
                        onChange={(e) =>
                          updateProfileField("cv", e.target.value)
                        }
                      />
                    </Field>
                    <Field label="Profile Photo URL">
                      <input
                        className={inputClass}
                        value={profileForm.photo || ""}
                        onChange={(e) =>
                          updateProfileField("photo", e.target.value)
                        }
                      />
                    </Field>
                    <Field label="Logo URL">
                      <input
                        className={inputClass}
                        value={profileForm.logo || ""}
                        onChange={(e) =>
                          updateProfileField("logo", e.target.value)
                        }
                      />
                    </Field>
                    <Field label="Hero Description" className="sm:col-span-2">
                      <textarea
                        rows="4"
                        className={inputClass}
                        value={profileForm.heroDescription || ""}
                        onChange={(e) =>
                          updateProfileField("heroDescription", e.target.value)
                        }
                      />
                    </Field>
                    <button
                      disabled={busy || !portfolio}
                      className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50 sm:col-span-2"
                    >
                      <Save size={18} />
                      {busy ? "Saving..." : "Save Profile Information"}
                    </button>
                  </form>
                </Card>
              )}

              {activeSection === "about" && (
                <Card>
                  <SectionHeading
                    eyebrow="YOUR STORY"
                    title="About Me"
                    description="Edit the introduction and personal details shown in your About section."
                    icon={UserRound}
                  />
                  <form
                    onSubmit={saveAbout}
                    className="grid gap-5 sm:grid-cols-2"
                  >
                    <Field label="About Heading">
                      <input
                        className={inputClass}
                        value={aboutForm.heading}
                        onChange={(e) =>
                          setAboutForm({
                            ...aboutForm,
                            heading: e.target.value,
                          })
                        }
                      />
                    </Field>
                    <Field label="Current Role">
                      <input
                        className={inputClass}
                        value={aboutForm.currentRole}
                        onChange={(e) =>
                          setAboutForm({
                            ...aboutForm,
                            currentRole: e.target.value,
                          })
                        }
                      />
                    </Field>
                    <Field label="Education Status">
                      <input
                        className={inputClass}
                        value={aboutForm.education}
                        onChange={(e) =>
                          setAboutForm({
                            ...aboutForm,
                            education: e.target.value,
                          })
                        }
                      />
                    </Field>
                    <Field label="Career Goal">
                      <input
                        className={inputClass}
                        value={aboutForm.goal}
                        onChange={(e) =>
                          setAboutForm({ ...aboutForm, goal: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="First Paragraph" className="sm:col-span-2">
                      <textarea
                        rows="5"
                        className={inputClass}
                        value={aboutForm.paragraph1}
                        onChange={(e) =>
                          setAboutForm({
                            ...aboutForm,
                            paragraph1: e.target.value,
                          })
                        }
                      />
                    </Field>
                    <Field label="Second Paragraph" className="sm:col-span-2">
                      <textarea
                        rows="5"
                        className={inputClass}
                        value={aboutForm.paragraph2}
                        onChange={(e) =>
                          setAboutForm({
                            ...aboutForm,
                            paragraph2: e.target.value,
                          })
                        }
                      />
                    </Field>
                    <button
                      disabled={busy}
                      className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50 sm:col-span-2"
                    >
                      <Save size={18} /> Save About Information
                    </button>
                  </form>
                </Card>
              )}

              {activeSection === "skills" && (
                <Card>
                  <SectionHeading
                    eyebrow="WHAT I CAN DO"
                    title="Manage Skills"
                    description="Add, edit or remove the skills shown on your portfolio."
                    icon={Code2}
                  />
                  <form
                    onSubmit={saveSkill}
                    className="mb-7 grid gap-3 sm:grid-cols-[1fr_190px_auto]"
                  >
                    <input
                      required
                      className={inputClass}
                      placeholder="Skill name e.g. React"
                      value={skillForm.name}
                      onChange={(e) =>
                        setSkillForm({ ...skillForm, name: e.target.value })
                      }
                    />
                    <select
                      className={inputClass}
                      value={skillForm.group}
                      onChange={(e) =>
                        setSkillForm({ ...skillForm, group: e.target.value })
                      }
                    >
                      <option value="Frontend">Frontend</option>
                      <option value="Design">Design</option>
                      <option value="Tools">Tools</option>
                    </select>
                    <button
                      disabled={busy}
                      className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                    >
                      <Plus size={17} />
                      {editingSkillIndex >= 0 ? "Update Skill" : "Add Skill"}
                    </button>
                  </form>

                  {editingSkillIndex >= 0 && (
                    <button
                      onClick={() => {
                        setSkillForm(emptySkill);
                        setEditingSkillIndex(-1);
                      }}
                      className="mb-4 text-sm font-semibold text-slate-500 hover:text-emerald-700"
                    >
                      Cancel editing
                    </button>
                  )}

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {skills.map((skill, index) => (
                      <div
                        key={skill._id || `${skill.name}-${index}`}
                        className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4 transition hover:border-emerald-200 hover:bg-emerald-50/50"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700">
                            <Code2 size={18} />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-bold text-slate-800">
                              {skill.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {skill.group}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setSkillForm({
                                name: skill.name || "",
                                group: skill.group || "Frontend",
                              });
                              setEditingSkillIndex(index);
                            }}
                            className="rounded-lg p-2 text-slate-500 hover:bg-white hover:text-emerald-700"
                            aria-label="Edit skill"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteSkill(index)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                            aria-label="Delete skill"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {skills.length === 0 && (
                    <p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
                      No skills added yet. Add your first skill above.
                    </p>
                  )}
                </Card>
              )}

              {activeSection === "education" && (
                <Card>
                  <SectionHeading
                    eyebrow="LEARNING JOURNEY"
                    title="Education"
                    description="Manage your schools, training courses and certificates."
                    icon={GraduationCap}
                  />
                  <form
                    onSubmit={saveEducation}
                    className="mb-7 grid gap-5 sm:grid-cols-2"
                  >
                    <Field label="School / Institute">
                      <input
                        required
                        className={inputClass}
                        value={educationForm.place}
                        onChange={(e) =>
                          setEducationForm({
                            ...educationForm,
                            place: e.target.value,
                          })
                        }
                      />
                    </Field>
                    <Field label="Course / Grade">
                      <input
                        required
                        className={inputClass}
                        value={educationForm.course}
                        onChange={(e) =>
                          setEducationForm({
                            ...educationForm,
                            course: e.target.value,
                          })
                        }
                      />
                    </Field>
                    <Field label="Education Type">
                      <select
                        className={inputClass}
                        value={educationForm.type}
                        onChange={(e) =>
                          setEducationForm({
                            ...educationForm,
                            type: e.target.value,
                          })
                        }
                      >
                        <option value="School">School</option>
                        <option value="Training">Training</option>
                        <option value="Certificates">Certificates</option>
                        <option value="University">University</option>
                        <option value="Other">Other</option>
                      </select>
                    </Field>
                    <Field label="Details">
                      <input
                        className={inputClass}
                        value={educationForm.detail}
                        onChange={(e) =>
                          setEducationForm({
                            ...educationForm,
                            detail: e.target.value,
                          })
                        }
                      />
                    </Field>
                    <button
                      disabled={busy}
                      className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50 sm:col-span-2"
                    >
                      <Plus size={18} />
                      {editingEducationIndex >= 0
                        ? "Update Education"
                        : "Add Education"}
                    </button>
                  </form>

                  {editingEducationIndex >= 0 && (
                    <button
                      onClick={() => {
                        setEducationForm(emptyEducation);
                        setEditingEducationIndex(-1);
                      }}
                      className="mb-4 text-sm font-semibold text-slate-500 hover:text-emerald-700"
                    >
                      Cancel editing
                    </button>
                  )}

                  <div className="space-y-3">
                    {educationItems.map((item, index) => (
                      <div
                        key={item._id || `${item.place}-${index}`}
                        className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-100 p-4 transition hover:border-emerald-200"
                      >
                        <div className="flex items-start gap-3">
                          <span className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
                            <GraduationCap size={21} />
                          </span>
                          <div>
                            <p className="font-bold text-slate-800">
                              {item.place}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              {item.course} · {item.type}
                            </p>
                            {item.detail && (
                              <p className="mt-1 text-sm text-slate-500">
                                {item.detail}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEducationForm({
                                place: item.place || "",
                                course: item.course || "",
                                detail: item.detail || "",
                                type: item.type || "School",
                              });
                              setEditingEducationIndex(index);
                            }}
                            className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:border-emerald-200 hover:text-emerald-700"
                            aria-label="Edit education"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteEducation(index)}
                            className="rounded-lg border border-rose-100 p-2 text-rose-500 hover:bg-rose-50"
                            aria-label="Delete education"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {educationItems.length === 0 && (
                      <p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
                        No education information added yet.
                      </p>
                    )}
                  </div>
                </Card>
              )}

              {activeSection === "projects" && (
                <>
                  <Card className="mb-6">
                    <SectionHeading
                      eyebrow="PORTFOLIO WORK"
                      title={editingId ? "Edit Project" : "Add New Project"}
                      description="Add your work and display it on your public portfolio."
                      icon={FolderKanban}
                    />
                    <form
                      onSubmit={saveProject}
                      className="grid gap-5 sm:grid-cols-2"
                    >
                      <Field label="Project Title">
                        <input
                          required
                          className={inputClass}
                          value={projectForm.title}
                          onChange={(e) =>
                            setProjectForm({
                              ...projectForm,
                              title: e.target.value,
                            })
                          }
                        />
                      </Field>
                      <Field label="Category">
                        <input
                          required
                          className={inputClass}
                          value={projectForm.category}
                          onChange={(e) =>
                            setProjectForm({
                              ...projectForm,
                              category: e.target.value,
                            })
                          }
                        />
                      </Field>
                      <Field label="Description" className="sm:col-span-2">
                        <textarea
                          required
                          rows="4"
                          className={inputClass}
                          value={projectForm.description}
                          onChange={(e) =>
                            setProjectForm({
                              ...projectForm,
                              description: e.target.value,
                            })
                          }
                        />
                      </Field>
                      <Field
                        label="Technologies (comma separated)"
                        className="sm:col-span-2"
                      >
                        <input
                          className={inputClass}
                          placeholder="React, Tailwind CSS, JavaScript"
                          value={projectForm.technologies}
                          onChange={(e) =>
                            setProjectForm({
                              ...projectForm,
                              technologies: e.target.value,
                            })
                          }
                        />
                      </Field>
                      <Field label="Live Demo URL">
                        <input
                          className={inputClass}
                          value={projectForm.liveUrl}
                          onChange={(e) =>
                            setProjectForm({
                              ...projectForm,
                              liveUrl: e.target.value,
                            })
                          }
                        />
                      </Field>
                      <Field label="GitHub URL">
                        <input
                          className={inputClass}
                          value={projectForm.githubUrl}
                          onChange={(e) =>
                            setProjectForm({
                              ...projectForm,
                              githubUrl: e.target.value,
                            })
                          }
                        />
                      </Field>
                      <Field label="Project Image URL">
                        <input
                          className={inputClass}
                          value={projectForm.imageUrl}
                          onChange={(e) =>
                            setProjectForm({
                              ...projectForm,
                              imageUrl: e.target.value,
                            })
                          }
                        />
                      </Field>
                      <Field label="Display Order">
                        <input
                          type="number"
                          className={inputClass}
                          value={projectForm.order}
                          onChange={(e) =>
                            setProjectForm({
                              ...projectForm,
                              order: e.target.value,
                            })
                          }
                        />
                      </Field>
                      <label className="flex items-center gap-3 text-sm font-semibold text-slate-700 sm:col-span-2">
                        <input
                          type="checkbox"
                          checked={projectForm.featured}
                          onChange={(e) =>
                            setProjectForm({
                              ...projectForm,
                              featured: e.target.checked,
                            })
                          }
                          className="h-4 w-4 accent-emerald-600"
                        />
                        Featured Project
                      </label>
                      <div className="flex flex-wrap gap-3 sm:col-span-2">
                        <button
                          disabled={busy}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                        >
                          <Save size={18} />
                          {busy
                            ? "Saving..."
                            : editingId
                              ? "Update Project"
                              : "Add Project"}
                        </button>
                        {editingId && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId("");
                              setProjectForm(emptyProject);
                            }}
                            className="rounded-xl border border-slate-200 px-5 py-3 font-bold text-slate-600 hover:bg-slate-50"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </Card>

                  <Card>
                    <h3 className="mb-5 text-lg font-extrabold text-slate-800">
                      Manage Projects ({projects.length})
                    </h3>
                    <div className="space-y-3">
                      {projects.map((project) => (
                        <div
                          key={project._id}
                          className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-100 p-4 transition hover:border-emerald-200"
                        >
                          <div className="flex items-start gap-3">
                            <span className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
                              <FolderKanban size={20} />
                            </span>
                            <div>
                              <p className="font-bold text-slate-800">
                                {project.title}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                {project.category} ·{" "}
                                {(project.technologies || []).join(", ")}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => editProject(project)}
                              className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:border-emerald-200 hover:text-emerald-700"
                              aria-label="Edit project"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeProject(project._id)}
                              className="rounded-lg border border-rose-100 p-2 text-rose-500 hover:bg-rose-50"
                              aria-label="Delete project"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                      {projects.length === 0 && (
                        <p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
                          No projects added yet.
                        </p>
                      )}
                    </div>
                  </Card>
                </>
              )}

              {activeSection === "messages" && (
                <Card>
                  <SectionHeading
                    eyebrow="INBOX"
                    title="Contact Messages"
                    description={`${contacts.length} total messages · ${unreadMessages} unread`}
                    icon={MessageSquare}
                  />
                  <div className="space-y-4">
                    {contacts.map((item) => (
                      <article
                        key={item._id}
                        className="rounded-2xl border border-slate-100 p-5 transition hover:border-emerald-200 hover:shadow-sm"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-extrabold text-slate-800">
                                {item.name}
                              </h3>
                              {!item.isRead && (
                                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                                  New Message
                                </span>
                              )}
                            </div>
                            <a
                              href={`mailto:${item.email}`}
                              className="mt-1 inline-block text-sm font-medium text-emerald-700 hover:underline"
                            >
                              {item.email}
                            </a>
                            <p className="mt-1 text-xs text-slate-400">
                              {new Date(item.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {!item.isRead && (
                              <button
                                type="button"
                                onClick={() => markRead(item._id)}
                                className="rounded-lg border border-emerald-200 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50"
                              >
                                Mark Read
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => removeContact(item._id)}
                              className="rounded-lg border border-rose-100 p-2 text-rose-500 hover:bg-rose-50"
                              aria-label="Delete message"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        {item.subject && (
                          <p className="mt-4 font-bold text-slate-700">
                            {item.subject}
                          </p>
                        )}
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                          {item.message}
                        </p>
                      </article>
                    ))}
                    {contacts.length === 0 && (
                      <div className="rounded-2xl bg-slate-50 p-8 text-center">
                        <Mail size={32} className="mx-auto text-slate-300" />
                        <p className="mt-3 font-bold text-slate-700">
                          No messages yet
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Messages sent through your portfolio will appear here.
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>

        <footer className="px-5 pb-7 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} MSA Developer · Admin Dashboard
        </footer>
      </div>
    </main>
  );
}
