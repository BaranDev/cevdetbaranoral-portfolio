import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled, { keyframes, css } from "styled-components";
import {
  Home,
  Briefcase,
  FolderGit2,
  Zap,
  GraduationCap,
  Mail,
  Brain,
  Sun,
  Moon,
  Download,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";
import CVDownloadButton from "../ui/CVDownloadButton";
import CVDownloadModal from "../ui/CVDownloadModal";
import { useTheme } from "../../context/ThemeContext";

/* ── vars ────────────────────────────────────── */
const NAV_W = 220;
const NAV_W_MIN = 64;

/* ── keyframes ───────────────────────────────── */
const glowPulse = keyframes`
  0%,100%{box-shadow:0 0 8px rgba(218,165,32,.3)}
  50%{box-shadow:0 0 16px rgba(218,165,32,.5)}
`;

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

/* ── styled: sidebar (desktop) ───────────────── */
const Sidebar = styled.nav`
  position: fixed;
  left: 12px;
  top: 12px;
  bottom: 12px;
  width: ${(p) => (p.$collapsed ? NAV_W_MIN : NAV_W)}px;
  background: ${(p) => p.theme.colors.card}ee;
  backdrop-filter: blur(16px);
  border: 1px solid ${(p) => p.theme.colors.primary}20;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  z-index: 100;
  transition: width 0.25s ease;
  overflow: hidden;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavTop = styled.div`
  padding: 16px 12px 8px;
  display: flex;
  align-items: center;
  justify-content: ${(p) => (p.$collapsed ? "center" : "flex-end")};
  gap: 8px;
`;

const CollapseBtn = styled.button`
  background: ${(p) => p.theme.colors.primary}15;
  border: 1px solid ${(p) => p.theme.colors.primary}20;
  border-radius: 8px;
  color: ${(p) => p.theme.colors.secondary};
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    color: ${(p) => p.theme.colors.primary};
    background: ${(p) => p.theme.colors.primary}25;
  }
`;

const NavItems = styled.div`
  flex: 1;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 99px;
    background: ${(p) => p.theme.colors.primary}30;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${(p) => p.theme.colors.primary}15;
  margin: 6px ${(p) => (p.$collapsed ? "8px" : "12px")};
`;

const NavBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px ${(p) => (p.$collapsed ? "0" : "12px")};
  justify-content: ${(p) => (p.$collapsed ? "center" : "flex-start")};
  background: ${(p) =>
    p.$active ? p.theme.colors.primary + "18" : "transparent"};
  border: none;
  border-radius: 10px;
  color: ${(p) =>
    p.$active ? p.theme.colors.primary : p.theme.colors.secondary};
  font-size: 0.82rem;
  font-weight: ${(p) => (p.$active ? "600" : "400")};
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  position: relative;

  ${(p) =>
    p.$active &&
    css`
      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 20px;
        background: ${p.theme.colors.primary};
        border-radius: 0 4px 4px 0;
      }
    `}

  &:hover {
    background: ${(p) => p.theme.colors.primary}12;
    color: ${(p) => p.theme.colors.primary};
  }

  svg {
    flex-shrink: 0;
  }
  span {
    opacity: ${(p) => (p.$collapsed ? 0 : 1)};
    transition: opacity 0.2s;
    overflow: hidden;
  }
`;

const NavRouteLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px ${(p) => (p.$collapsed ? "0" : "12px")};
  justify-content: ${(p) => (p.$collapsed ? "center" : "flex-start")};
  background: ${(p) =>
    p.$active ? p.theme.colors.primary + "18" : "transparent"};
  border: none;
  border-radius: 10px;
  color: ${(p) =>
    p.$active ? p.theme.colors.primary : p.theme.colors.secondary};
  font-size: 0.82rem;
  font-weight: ${(p) => (p.$active ? "600" : "400")};
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: ${(p) => p.theme.colors.primary}12;
    color: ${(p) => p.theme.colors.primary};
  }

  svg {
    flex-shrink: 0;
  }
  span {
    opacity: ${(p) => (p.$collapsed ? 0 : 1)};
    transition: opacity 0.2s;
    overflow: hidden;
  }
`;

const NavFooter = styled.div`
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FooterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${(p) => (p.$collapsed ? "center" : "space-between")};
  gap: 10px;
  padding: 6px ${(p) => (p.$collapsed ? "0" : "8px")};
  flex-direction: ${(p) => (p.$collapsed ? "column" : "row")};
`;

const MobileThemeToggleWrapper = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 1000;

  @media (min-width: 769px) {
    display: none;
  }
`;

/* ── styled: mobile bar ──────────────────────── */
const MobileBar = styled.nav`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: ${(p) => p.theme.colors.card}f0;
    backdrop-filter: blur(16px);
    border-top: 1px solid ${(p) => p.theme.colors.primary}20;
    z-index: 100;
    align-items: center;
    justify-content: space-around;
    padding: 0 4px;
    padding-bottom: env(safe-area-inset-bottom, 0);
  }
`;

const MobBtn = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 4px 6px;
  background: none;
  border: none;
  color: ${(p) =>
    p.$active ? p.theme.colors.primary : p.theme.colors.secondary};
  font-size: 0.6rem;
  cursor: pointer;
  transition: color 0.2s;
  flex: 1;
  max-width: 64px;

  &:hover,
  &:active {
    color: ${(p) => p.theme.colors.primary};
  }
`;

const MobMore = styled.div`
  position: fixed;
  bottom: 64px;
  left: 8px;
  right: 8px;
  background: ${(p) => p.theme.colors.card}f8;
  backdrop-filter: blur(16px);
  border: 1px solid ${(p) => p.theme.colors.primary}20;
  border-radius: 16px;
  padding: 12px;
  z-index: 101;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  padding-bottom: calc(12px + env(safe-area-inset-bottom, 0));
`;

const MobMoreBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${(p) =>
    p.$active ? p.theme.colors.primary + "18" : p.theme.colors.primary + "08"};
  border: 1px solid ${(p) => p.theme.colors.primary}15;
  border-radius: 10px;
  color: ${(p) => (p.$active ? p.theme.colors.primary : p.theme.colors.text)};
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: ${(p) => p.theme.colors.primary}18;
  }
`;

const MobMoreLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${(p) => p.theme.colors.primary}08;
  border: 1px solid ${(p) => p.theme.colors.primary}15;
  border-radius: 10px;
  color: ${(p) => p.theme.colors.text};
  font-size: 0.82rem;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: ${(p) => p.theme.colors.primary}18;
  }
`;

/* ── Component ───────────────────────────────── */
const Header = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [moreOpen, setMoreOpen] = useState(false);
  const [showCVModal, setShowCVModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
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

  return (
    <>
      {/* Desktop sidebar */}
      <Sidebar $collapsed={collapsed}>
        <NavTop $collapsed={collapsed}>
          <CollapseBtn
            onClick={() => setCollapsed((c) => !c)}
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </CollapseBtn>
        </NavTop>

        <NavItems>
          {NAV_SECTIONS.map((s) => (
            <NavBtn
              key={s.id}
              $active={isHome && activeSection === s.id}
              $collapsed={collapsed}
              onClick={() => handleNav(s.id)}
            >
              <s.icon size={18} />
              <span>{s.label}</span>
            </NavBtn>
          ))}

          <Divider $collapsed={collapsed} />

          {NAV_ROUTES.map((r) => (
            <NavRouteLink
              key={r.to}
              to={r.to}
              $active={location.pathname === r.to}
              $collapsed={collapsed}
            >
              <r.icon size={18} />
              <span>{r.label}</span>
            </NavRouteLink>
          ))}
        </NavItems>

        <NavFooter>
          <Divider $collapsed={collapsed} />
          <FooterRow $collapsed={collapsed}>
            <ThemeToggle />
            <CVDownloadButton />
          </FooterRow>
        </NavFooter>
      </Sidebar>

      {/* Mobile bottom bar */}
      <MobileBar>
        {mobilePrimary.map((s) => (
          <MobBtn
            key={s.id}
            $active={isHome && activeSection === s.id}
            onClick={() => handleNav(s.id)}
          >
            <s.icon size={18} />
            <span>{s.label}</span>
          </MobBtn>
        ))}
        <MobBtn $active={moreOpen} onClick={() => setMoreOpen((o) => !o)}>
          {moreOpen ? <X size={18} /> : <Menu size={18} />}
          <span>More</span>
        </MobBtn>
      </MobileBar>

      {/* Mobile "more" drawer */}
      {moreOpen && (
        <MobMore>
          {mobileSecondary.map((s) => (
            <MobMoreBtn
              key={s.id}
              $active={isHome && activeSection === s.id}
              onClick={() => handleNav(s.id)}
            >
              <s.icon size={16} />
              {s.label}
            </MobMoreBtn>
          ))}
          {NAV_ROUTES.map((r) => (
            <MobMoreLink
              key={r.to}
              to={r.to}
              onClick={() => setMoreOpen(false)}
            >
              <r.icon size={16} />
              {r.label}
            </MobMoreLink>
          ))}
          <MobMoreBtn
            onClick={() => {
              setMoreOpen(false);
              setShowCVModal(true);
            }}
          >
            <Download size={16} /> CV
          </MobMoreBtn>
          <CVDownloadModal
            isOpen={showCVModal}
            onClose={() => setShowCVModal(false)}
          />
        </MobMore>
      )}

      {/* Mobile Fixed Theme Toggle */}
      <MobileThemeToggleWrapper>
        <ThemeToggle />
      </MobileThemeToggleWrapper>
    </>
  );
};

export default Header;
