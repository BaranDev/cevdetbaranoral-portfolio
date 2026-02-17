import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Briefcase,
  FolderGit2,
  Zap,
  GraduationCap,
  Mail,
  Brain,
  Download,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";
import CVDownloadModal from "../ui/CVDownloadModal";

/* ── nav items ───────────────────────────────── */
const NAV_SECTIONS = [
  { id: "home", label: "Home", icon: Home },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "skills", label: "Skills", icon: Zap },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "contact", label: "Contact", icon: Mail },
];

const NAV_ROUTES = [{ to: "/ai-demos", label: "AI Demos", icon: Brain }];

/* ── Component ───────────────────────────────── */
const Header = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [moreOpen, setMoreOpen] = useState(false);
  const [showCVModal, setShowCVModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  // track active section via IntersectionObserver
  useEffect(() => {
    if (!isHome) return;
    const ids = NAV_SECTIONS.map((s) => s.id);
    const observers = [];
    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    };
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        const obs = new IntersectionObserver(handleIntersect, {
          rootMargin: "-30% 0px -60% 0px",
        });
        obs.observe(el);
        observers.push(obs);
      }
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [isHome]);

  const handleNav = useCallback(
    (id) => {
      if (!isHome) {
        navigate("/");
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      } else {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setMoreOpen(false);
    },
    [isHome, navigate],
  );

  // Mobile: show first 4 items + "more"
  const mobilePrimary = NAV_SECTIONS.slice(0, 4);
  const mobileSecondary = NAV_SECTIONS.slice(4);

  // Common classes
  const navItemClasses = (active) => `
    flex items-center rounded-xl transition-all duration-200 cursor-pointer border-none bg-transparent w-full
    text-[0.82rem] font-medium whitespace-nowrap relative
    ${
      active
        ? "bg-primary/10 text-primary font-semibold"
        : "text-secondary hover:bg-primary/5 hover:text-primary"
    }
    ${collapsed ? "justify-center px-0 gap-0 h-[44px]" : "px-3 gap-3 p-3"}
  `;

  // Active indicator line for desktop sidebar
  const ActiveIndicator = () => (
    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-md" />
  );

  return (
    <>
      {/* Desktop sidebar */}
      <nav
        className={`
          hidden md:flex fixed top-3 left-3 bottom-3 flex-col bg-card/95 backdrop-blur-md 
          border border-primary/20 rounded-2xl z-[100] transition-[width] duration-300 overflow-hidden
          ${collapsed ? "w-[64px]" : "w-[220px]"}
        `}
      >
        {/* Top: Collapse Button */}
        <div
          className={`p-4 pb-2 flex items-center gap-2 ${collapsed ? "justify-center" : "justify-end"}`}
        >
          <button
            onClick={() => setCollapsed((c) => !c)}
            aria-label="Toggle sidebar"
            className="w-7 h-7 flex items-center justify-center bg-primary/10 hover:bg-primary/20 text-secondary hover:text-primary border border-primary/20 rounded-lg transition-all"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Middle: Navigation Items */}
        <div className="flex-1 p-3 flex flex-col gap-1.5 overflow-y-auto overflow-x-hidden scrollbar-thin">
          {NAV_SECTIONS.map((s) => {
            const isActive = isHome && activeSection === s.id;
            return (
              <button
                key={s.id}
                className={navItemClasses(isActive)}
                onClick={() => handleNav(s.id)}
                title={collapsed ? s.label : ""}
              >
                {isActive && <ActiveIndicator />}
                <s.icon size={18} className="shrink-0" />
                <span
                  className={`transition-opacity duration-200 ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}
                >
                  {s.label}
                </span>
              </button>
            );
          })}

          <div
            className={`my-1.5 border-t border-primary/10 ${collapsed ? "mx-2" : "mx-3"}`}
          />

          {NAV_ROUTES.map((r) => {
            const isActive = location.pathname === r.to;
            return (
              <Link
                key={r.to}
                to={r.to}
                className={navItemClasses(isActive)}
                title={collapsed ? r.label : ""}
              >
                {isActive && <ActiveIndicator />}
                <r.icon size={18} className="shrink-0" />
                <span
                  className={`transition-opacity duration-200 ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}
                >
                  {r.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Bottom: Theme Toggle */}
        <div className="p-2 flex flex-col gap-1">
          <div
            className={`my-1.5 border-t border-primary/10 ${collapsed ? "mx-2" : "mx-3"}`}
          />
          <div
            className={`flex items-center gap-2.5 p-1.5 ${collapsed ? "justify-center flex-col" : "justify-between"}`}
          >
            <ThemeToggle collapsed={collapsed} />
          </div>
        </div>
      </nav>

      {/* Mobile bottom bar */}
      <nav className="md:hidden flex fixed bottom-0 left-0 right-0 h-[60px] bg-card/95 backdrop-blur-md border-t border-primary/20 z-[100] items-center justify-around px-1 pb-[env(safe-area-inset-bottom)]">
        {mobilePrimary.map((s) => {
          const isActive = isHome && activeSection === s.id;
          return (
            <button
              key={s.id}
              className={`
                flex flex-col items-center gap-0.5 p-1 bg-transparent border-none flex-1 max-w-[64px] cursor-pointer transition-colors duration-200
                ${isActive ? "text-primary" : "text-secondary hover:text-primary"}
              `}
              onClick={() => handleNav(s.id)}
            >
              <s.icon size={18} />
              <span className="text-[0.6rem]">{s.label}</span>
            </button>
          );
        })}
        <button
          className={`
            flex flex-col items-center gap-0.5 p-1 bg-transparent border-none flex-1 max-w-[64px] cursor-pointer transition-colors duration-200
            ${moreOpen ? "text-primary" : "text-secondary hover:text-primary"}
          `}
          onClick={() => setMoreOpen((o) => !o)}
        >
          {moreOpen ? <X size={18} /> : <Menu size={18} />}
          <span className="text-[0.6rem]">More</span>
        </button>
      </nav>

      {/* Mobile "more" drawer */}
      {moreOpen && (
        <div className="fixed bottom-[64px] left-2 right-2 bg-card/95 backdrop-blur-md border border-primary/20 rounded-2xl p-3 z-[101] flex flex-wrap gap-2 justify-center pb-[calc(12px+env(safe-area-inset-bottom))]">
          {mobileSecondary.map((s) => {
            const isActive = isHome && activeSection === s.id;
            return (
              <button
                key={s.id}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-xl border border-primary/10 text-[0.82rem] cursor-pointer transition-all duration-200
                  ${
                    isActive
                      ? "bg-primary/15 text-primary border-primary/20"
                      : "bg-primary/5 text-secondary hover:bg-primary/15"
                  }
                `}
                onClick={() => handleNav(s.id)}
              >
                <s.icon size={16} />
                {s.label}
              </button>
            );
          })}
          {NAV_ROUTES.map((r) => (
            <Link
              key={r.to}
              to={r.to}
              onClick={() => setMoreOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-primary/10 text-[0.82rem] bg-primary/5 text-text hover:bg-primary/15 transition-all duration-200 no-underline"
            >
              <r.icon size={16} />
              {r.label}
            </Link>
          ))}
          <button
            onClick={() => {
              setMoreOpen(false);
              setShowCVModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-primary/10 text-[0.82rem] bg-primary/5 text-text hover:bg-primary/15 transition-all duration-200 cursor-pointer"
          >
            <Download size={16} /> CV
          </button>
          <CVDownloadModal
            isOpen={showCVModal}
            onClose={() => setShowCVModal(false)}
          />
        </div>
      )}

      {/* Mobile Fixed Theme Toggle */}
      <div className="md:hidden fixed top-2.5 right-2.5 z-[1000]">
        <ThemeToggle collapsed={true} />
      </div>
    </>
  );
};

export default Header;
