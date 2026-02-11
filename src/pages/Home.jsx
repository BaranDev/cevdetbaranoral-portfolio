import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";
import {
  Briefcase,
  GraduationCap,
  FolderGit2,
  Zap,
  Trophy,
  Award,
  Mail,
  MapPin,
  Globe,
  ExternalLink,
  Github,
  Linkedin,
  ArrowRight,
  FileText,
  ChevronRight,
  Code2,
  Database,
  Cloud,
  Brain,
  Wrench,
  Palette,
} from "lucide-react";
import {
  Section,
  NeumorphicContainer,
  NeumorphicButton,
  FlexContainer,
} from "../styles/StyledComponents";
import CVDownloadButton from "../components/ui/CVDownloadButton";
import { useTheme } from "../context/ThemeContext";
import portfolioData from "../data/portfolioData.json";

/* ── animation ────────────────────────────────── */
const glow = keyframes`
  0%,100%{box-shadow:0 0 5px rgba(218,165,32,.4),0 0 10px rgba(218,165,32,.2)}
  50%{box-shadow:0 0 10px rgba(218,165,32,.7),0 0 20px rgba(218,165,32,.5)}
`;
const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };
const A = ({ children, id, ...r }) => (
  <motion.div
    id={id}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.12 }}
    variants={stagger}
    {...r}
  >
    {children}
  </motion.div>
);
const I = ({ children, ...r }) => (
  <motion.div
    variants={fadeUp}
    transition={{ duration: 0.4, ease: "easeOut" }}
    {...r}
  >
    {children}
  </motion.div>
);

const ICON_MAP = {
  Languages: Code2,
  Frontend: Palette,
  Backend: Database,
  Databases: Database,
  "Cloud & DevOps": Cloud,
  "AI & ML": Brain,
  Tools: Wrench,
};

/* ── styled ───────────────────────────────────── */
const Page = styled.div`
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  padding: 0 ${(p) => p.theme.spacing.lg};
  @media (max-width: 768px) {
    padding: 0 ${(p) => p.theme.spacing.md};
  }
`;

const Hero = styled(Section)`
  min-height: 70vh;
  display: flex;
  align-items: center;
  padding: ${(p) => p.theme.spacing.lg} 0;
  @media (max-width: ${(p) => p.theme.breakpoints.md}) {
    min-height: auto;
    padding: ${(p) => p.theme.spacing.sm} 0;
  }
`;
const HeroCard = styled(NeumorphicContainer)`
  padding: ${(p) => p.theme.spacing.xl};
  display: grid;
  grid-template-columns: 1fr 180px;
  gap: ${(p) => p.theme.spacing.lg};
  align-items: center;
  @media (max-width: ${(p) => p.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    text-align: center;
    padding: ${(p) => p.theme.spacing.lg};
  }
`;
const HeroText = styled.div`
  @media (max-width: ${(p) => p.theme.breakpoints.md}) {
    order: 2;
  }
`;
const AvatarWrap = styled.div`
  @media (max-width: ${(p) => p.theme.breakpoints.md}) {
    order: 1;
  }
`;
const Name = styled.h1`
  font-family: ${(p) => p.theme.typography.headingFont};
  font-size: clamp(1.6rem, 4.5vw, 2.6rem);
  margin: 0 0 4px;
  background: linear-gradient(
    135deg,
    ${(p) => p.theme.colors.primary},
    ${(p) => p.theme.colors.accent},
    ${(p) => p.theme.colors.magical}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;
const Title = styled.p`
  color: ${(p) => p.theme.colors.secondary};
  font-size: clamp(0.95rem, 2vw, 1.15rem);
  margin: 0 0 6px;
  font-weight: ${(p) => p.theme.typography.fontWeights.medium};
`;
const Tagline = styled.p`
  color: ${(p) => p.theme.colors.accent};
  font-style: italic;
  font-size: 0.9rem;
  margin: 0 0 ${(p) => p.theme.spacing.md};
  line-height: 1.5;
`;
const Bio = styled.p`
  color: ${(p) => p.theme.colors.text};
  font-size: 0.88rem;
  line-height: 1.6;
  margin: 0 0 ${(p) => p.theme.spacing.md};
  max-width: 520px;
`;
const Avatar = styled.div`
  width: 170px;
  height: 170px;
  position: relative;
  margin: 0 auto;
  &::before {
    content: "";
    position: absolute;
    inset: -6px;
    background: linear-gradient(
      45deg,
      ${(p) => p.theme.colors.primary},
      ${(p) => p.theme.colors.magical}
    );
    border-radius: 50%;
    z-index: -1;
    animation: ${glow} 3s ease-in-out infinite;
  }
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid ${(p) => p.theme.colors.card};
  }
`;
const Btn = styled(NeumorphicButton)`
  font-weight: ${(p) => p.theme.typography.fontWeights.semiBold};
  font-size: 0.82rem;
  padding: 8px 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.3s;
  &:hover {
    animation: ${glow} 2s ease-in-out infinite;
    transform: translateY(-2px);
  }
`;
const BtnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${(p) => p.theme.spacing.sm};
  width: 100%;
  max-width: 400px;
  @media (max-width: ${(p) => p.theme.breakpoints.md}) {
    max-width: 100%;
  }
`;

/* stats */
const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${(p) => p.theme.spacing.sm};
  margin: ${(p) => p.theme.spacing.md} 0;
  @media (max-width: ${(p) => p.theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;
const Stat = styled(NeumorphicContainer)`
  text-align: center;
  padding: ${(p) => p.theme.spacing.md};
  transition: all 0.3s;
  &:hover {
    transform: translateY(-3px);
  }
`;
const StatNum = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.xl};
  font-weight: bold;
  color: ${(p) => p.theme.colors.primary};
  font-family: ${(p) => p.theme.typography.headingFont};
`;
const StatLbl = styled.div`
  font-size: 0.7rem;
  color: ${(p) => p.theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 2px;
`;

/* section header */
const SH = styled.h2`
  font-family: ${(p) => p.theme.typography.headingFont};
  color: ${(p) => p.theme.colors.text};
  font-size: clamp(1.2rem, 3vw, 1.6rem);
  margin: 0 0 ${(p) => p.theme.spacing.md};
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

/* experience */
const Timeline = styled.div`
  position: relative;
  margin-top: ${(p) => p.theme.spacing.md};
  &::before {
    content: "";
    position: absolute;
    left: 18px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(
      to bottom,
      ${(p) => p.theme.colors.primary},
      ${(p) => p.theme.colors.magical}
    );
  }
`;
const Job = styled(NeumorphicContainer)`
  position: relative;
  margin: ${(p) => p.theme.spacing.sm} 0 ${(p) => p.theme.spacing.sm} 44px;
  padding: ${(p) => p.theme.spacing.md};
  &::before {
    content: "";
    position: absolute;
    left: -36px;
    top: 14px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${(p) => p.theme.colors.primary};
    box-shadow: 0 0 8px ${(p) => p.theme.colors.magical};
  }
`;
const JobTitle = styled.h3`
  font-family: ${(p) => p.theme.typography.headingFont};
  color: ${(p) => p.theme.colors.primary};
  margin: 0 0 2px;
  font-size: 0.95rem;
`;
const JobMeta = styled.div`
  font-size: 0.78rem;
  color: ${(p) => p.theme.colors.secondary};
  margin-bottom: 4px;
`;
const JobDesc = styled.p`
  font-size: 0.82rem;
  color: ${(p) => p.theme.colors.text};
  margin: 0 0 6px;
  line-height: 1.5;
`;
const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;
const Chip = styled.span`
  background: ${(p) => p.theme.colors.primary}15;
  color: ${(p) => p.theme.colors.primary};
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 500;
  border: 1px solid ${(p) => p.theme.colors.primary}20;
`;
const Metric = styled.span`
  background: ${(p) => p.theme.colors.primary}20;
  color: ${(p) => p.theme.colors.primary};
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.75rem;
  min-width: 48px;
  text-align: center;
`;
const AchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 3px;
  font-size: 0.8rem;
`;

/* projects */
const PGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: ${(p) => p.theme.spacing.md};
  margin-top: ${(p) => p.theme.spacing.md};
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;
const PCard = styled(NeumorphicContainer)`
  padding: ${(p) => p.theme.spacing.md};
  transition: all 0.3s;
  &:hover {
    transform: translateY(-5px);
    animation: ${glow} 2s ease-in-out infinite;
  }
`;
const PHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`;
const PTitle = styled.h3`
  font-family: ${(p) => p.theme.typography.headingFont};
  color: ${(p) => p.theme.colors.text};
  margin: 0;
  font-size: 0.95rem;
`;
const Badge = styled.span`
  background: ${(p) => p.theme.colors.primary}20;
  color: ${(p) => p.theme.colors.primary};
  padding: 1px 8px;
  border-radius: 12px;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  white-space: nowrap;
`;
const PDesc = styled.p`
  font-size: 0.8rem;
  color: ${(p) => p.theme.colors.text};
  line-height: 1.5;
  margin: 4px 0 8px;
`;
const PAward = styled.div`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.accent};
  font-weight: 600;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
`;
const PActions = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 8px;
`;
const PLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.primary};
  text-decoration: none;
  padding: 4px 10px;
  border-radius: ${(p) => p.theme.borderRadius.small};
  border: 1px solid ${(p) => p.theme.colors.primary}30;
  transition: all 0.2s;
  &:hover {
    background: ${(p) => p.theme.colors.primary}15;
    transform: translateY(-1px);
  }
`;
const PImpact = styled.div`
  display: flex;
  gap: ${(p) => p.theme.spacing.sm};
  margin: 8px 0;
  flex-wrap: wrap;
`;
const PImpactItem = styled.div`
  text-align: center;
  min-width: 70px;
`;
const PImpactVal = styled.div`
  font-size: 0.85rem;
  font-weight: bold;
  color: ${(p) => p.theme.colors.primary};
  font-family: ${(p) => p.theme.typography.headingFont};
`;
const PImpactLbl = styled.div`
  font-size: 0.6rem;
  color: ${(p) => p.theme.colors.secondary};
  text-transform: uppercase;
`;

/* skills */
const SGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: ${(p) => p.theme.spacing.sm};
  margin-top: ${(p) => p.theme.spacing.md};
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;
const SCat = styled(NeumorphicContainer)`
  padding: ${(p) => p.theme.spacing.md};
`;
const SCatHead = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;
const SCatTitle = styled.h4`
  font-family: ${(p) => p.theme.typography.headingFont};
  margin: 0;
  color: ${(p) => p.theme.colors.primary};
  font-size: 0.85rem;
`;
const SkillList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

/* education */
const EduGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${(p) => p.theme.spacing.md};
  margin-top: ${(p) => p.theme.spacing.md};
`;
const EduCard = styled(NeumorphicContainer)`
  padding: ${(p) => p.theme.spacing.md};
`;
const EduDegree = styled.h3`
  font-family: ${(p) => p.theme.typography.headingFont};
  color: ${(p) => p.theme.colors.primary};
  margin: 0 0 2px;
  font-size: 0.9rem;
`;
const EduMeta = styled.div`
  font-size: 0.78rem;
  color: ${(p) => p.theme.colors.secondary};
  margin-bottom: 4px;
`;
const EduBadge = styled.div`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.accent};
  font-weight: 500;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
`;

/* awards & certs */
const AwardRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: ${(p) => p.theme.spacing.sm};
  margin-top: ${(p) => p.theme.spacing.md};
`;
const AwardCard = styled(NeumorphicContainer)`
  padding: ${(p) => p.theme.spacing.sm} ${(p) => p.theme.spacing.md};
  font-size: 0.82rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

/* contact */
const ContactRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${(p) => p.theme.spacing.lg};
  margin-top: ${(p) => p.theme.spacing.md};
  @media (max-width: ${(p) => p.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;
const CInfo = styled(NeumorphicContainer)`
  padding: ${(p) => p.theme.spacing.lg};
`;
const SocBtn = styled(NeumorphicButton)`
  width: 44px;
  height: 44px;
  padding: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  &:hover {
    animation: ${glow} 2s ease-in-out infinite;
  }
`;
const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;
const ContactIcon = styled.div`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(p) => p.theme.colors.primary}15;
  border-radius: 50%;
  color: ${(p) => p.theme.colors.primary};
`;
const ContactLabel = styled.div`
  font-size: 0.72rem;
  color: ${(p) => p.theme.colors.secondary};
`;
const ContactValue = styled.div`
  font-weight: 500;
  font-size: 0.88rem;
`;

/* ── Component ────────────────────────────────── */
const Home = () => {
  const { theme } = useTheme();
  const d = portfolioData;
  const featured = d.projects.filter((p) => p.priority === "featured");
  const other = d.projects.filter((p) => p.priority !== "featured");

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const renderProjectCard = (p) => (
    <I key={p.id}>
      <PCard aria-label={p.title}>
        <PHead>
          <PTitle>{p.title}</PTitle>
          <Badge>{p.status}</Badge>
        </PHead>
        {p.award && (
          <PAward>
            <Trophy size={13} />
            {p.award}
          </PAward>
        )}
        <PDesc>{p.description}</PDesc>
        <PImpact>
          {p.impact.metrics.map((m, i) => (
            <PImpactItem key={i}>
              <PImpactVal>{m.value}</PImpactVal>
              <PImpactLbl>{m.label}</PImpactLbl>
            </PImpactItem>
          ))}
        </PImpact>
        <Chips>
          {Object.values(p.technologies)
            .flat()
            .slice(0, 5)
            .map((t, i) => (
              <Chip key={i}>{t}</Chip>
            ))}
        </Chips>
        <PActions>
          {p.media?.demo && (
            <PLink
              href={p.media.demo}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink size={12} /> Live Site
            </PLink>
          )}
          {p.repo && (
            <PLink href={p.repo} target="_blank" rel="noopener noreferrer">
              <Github size={12} /> Source
            </PLink>
          )}
        </PActions>
      </PCard>
    </I>
  );

  return (
    <Page>
      {/* Hero */}
      <Hero id="home">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: "100%" }}
        >
          <HeroCard>
            <HeroText>
              <Name>{d.personal.name}</Name>
              <Title>{d.personal.title}</Title>
              <Tagline>{d.personal.tagline}</Tagline>
              <Bio>{d.personal.bio}</Bio>
              <BtnGrid>
                <Btn $primary onClick={() => scrollTo("projects")}>
                  <FolderGit2 size={15} /> Projects
                </Btn>
                <Btn onClick={() => scrollTo("contact")}>
                  <Mail size={15} /> Contact
                </Btn>
                <div style={{ gridColumn: "1 / -1" }}>
                  <CVDownloadButton style={{ width: "100%" }} />
                </div>
              </BtnGrid>
            </HeroText>
            <AvatarWrap>
              <Avatar>
                <img src={d.personal.profileImage} alt={d.personal.name} />
              </Avatar>
            </AvatarWrap>
          </HeroCard>
        </motion.div>
      </Hero>

      {/* Stats */}
      <A>
        <StatsRow>
          {[
            { n: d.personal.quickStats.yearsExperience + "+", l: "Years Exp." },
            { n: d.personal.quickStats.projectsCompleted + "+", l: "Repos" },
            { n: d.personal.quickStats.degreesEarned, l: "Degrees" },
            { n: d.personal.quickStats.hackathonAwards, l: "Awards" },
          ].map((s, i) => (
            <I key={i}>
              <Stat>
                <StatNum>{s.n}</StatNum>
                <StatLbl>{s.l}</StatLbl>
              </Stat>
            </I>
          ))}
        </StatsRow>
      </A>

      {/* Experience */}
      <A id="experience" style={{ padding: `${theme.spacing.lg} 0` }}>
        <I>
          <SH>
            <Briefcase size={22} /> Experience
          </SH>
        </I>
        <Timeline>
          {d.experience.map((j) => (
            <I key={j.id}>
              <Job>
                <JobTitle>{j.title}</JobTitle>
                <JobMeta>
                  {j.company} · {j.duration}
                </JobMeta>
                <JobDesc>{j.description}</JobDesc>
                <div style={{ marginBottom: 6 }}>
                  {j.achievements.map((a, i) => (
                    <AchRow key={i}>
                      <Metric>{a.metric}</Metric>
                      <span style={{ color: theme.colors.text }}>
                        {a.description}
                      </span>
                    </AchRow>
                  ))}
                </div>
                <Chips>
                  {j.technologies[0]?.items.map((t, i) => (
                    <Chip key={i}>{t}</Chip>
                  ))}
                </Chips>
              </Job>
            </I>
          ))}
        </Timeline>
      </A>

      {/* Featured Projects */}
      <A
        id="projects"
        style={{ padding: `${theme.spacing.lg} 0`, contentVisibility: "auto" }}
      >
        <I>
          <SH>
            <FolderGit2 size={22} /> Featured Projects
          </SH>
        </I>
        <PGrid>{featured.map(renderProjectCard)}</PGrid>

        {other.length > 0 && (
          <>
            <I>
              <SH style={{ marginTop: theme.spacing.lg, fontSize: "1.1rem" }}>
                <ChevronRight size={18} /> More Projects
              </SH>
            </I>
            <PGrid>{other.map(renderProjectCard)}</PGrid>
          </>
        )}
      </A>

      {/* Skills */}
      <A
        id="skills"
        style={{ padding: `${theme.spacing.lg} 0`, contentVisibility: "auto" }}
      >
        <I>
          <SH>
            <Zap size={22} /> Technical Skills
          </SH>
        </I>
        <SGrid>
          {Object.entries(d.skills).map(([name, cat]) => {
            const Icon = ICON_MAP[name] || Code2;
            return (
              <I key={name}>
                <SCat>
                  <SCatHead>
                    <Icon size={18} color={theme.colors.primary} />
                    <SCatTitle>{name}</SCatTitle>
                  </SCatHead>
                  <SkillList>
                    {cat.skills.map((s, i) => (
                      <Chip key={i}>{s}</Chip>
                    ))}
                  </SkillList>
                </SCat>
              </I>
            );
          })}
        </SGrid>
      </A>

      {/* Education */}
      <A
        id="education"
        style={{ padding: `${theme.spacing.lg} 0`, contentVisibility: "auto" }}
      >
        <I>
          <SH>
            <GraduationCap size={22} /> Education
          </SH>
        </I>
        <EduGrid>
          {d.education.map((e, i) => (
            <I key={i}>
              <EduCard>
                <EduDegree>{e.degree}</EduDegree>
                <EduMeta>
                  {e.school} · {e.duration}
                </EduMeta>
                <EduBadge>
                  <span>GPA: {e.gpa}</span>
                  <span>·</span>
                  <span>{e.honors}</span>
                </EduBadge>
              </EduCard>
            </I>
          ))}
        </EduGrid>
      </A>

      {/* Awards & Certs */}
      <A
        style={{ padding: `${theme.spacing.lg} 0`, contentVisibility: "auto" }}
      >
        <I>
          <SH>
            <Award size={22} /> Awards & Certifications
          </SH>
        </I>
        <AwardRow>
          {d.awards.map((a, i) => (
            <I key={i}>
              <AwardCard>
                <Trophy size={14} color={theme.colors.primary} />
                <span style={{ color: theme.colors.text }}>{a}</span>
              </AwardCard>
            </I>
          ))}
          {d.certifications.map((c, i) => (
            <I key={"c" + i}>
              <AwardCard>
                <FileText size={14} color={theme.colors.primary} />
                <span style={{ color: theme.colors.text }}>{c}</span>
              </AwardCard>
            </I>
          ))}
        </AwardRow>
      </A>

      {/* Contact */}
      <A
        id="contact"
        style={{ padding: `${theme.spacing.xl} 0`, contentVisibility: "auto" }}
      >
        <I>
          <SH>
            <Mail size={22} /> Let's Connect
          </SH>
        </I>
        <ContactRow>
          <I>
            <CInfo>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: theme.spacing.md,
                }}
              >
                <ContactItem>
                  <ContactIcon>
                    <Mail size={16} />
                  </ContactIcon>
                  <div>
                    <ContactLabel>Email</ContactLabel>
                    <ContactValue>{d.personal.email}</ContactValue>
                  </div>
                </ContactItem>
                <ContactItem>
                  <ContactIcon>
                    <MapPin size={16} />
                  </ContactIcon>
                  <div>
                    <ContactLabel>Location</ContactLabel>
                    <ContactValue>{d.personal.location}</ContactValue>
                  </div>
                </ContactItem>
                <ContactItem>
                  <ContactIcon>
                    <Globe size={16} />
                  </ContactIcon>
                  <div>
                    <ContactLabel>Languages</ContactLabel>
                    <ContactValue>Turkish (Native) · English (C2)</ContactValue>
                  </div>
                </ContactItem>
              </div>
              <FlexContainer gap="sm" style={{ marginTop: theme.spacing.lg }}>
                <SocBtn
                  as="a"
                  href={d.personal.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <i className="fab fa-github"></i>
                </SocBtn>
                <SocBtn
                  as="a"
                  href={d.personal.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <i className="fab fa-linkedin-in"></i>
                </SocBtn>
                <SocBtn
                  as="a"
                  href={`mailto:${d.personal.email}`}
                  aria-label="Email"
                >
                  <i className="fas fa-envelope"></i>
                </SocBtn>
              </FlexContainer>
            </CInfo>
          </I>
          <I>
            <CInfo
              style={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: theme.spacing.md,
              }}
            >
              <h3
                style={{
                  fontFamily: theme.typography.headingFont,
                  color: theme.colors.primary,
                  margin: 0,
                  fontSize: "1.05rem",
                }}
              >
                Ready to Build Together?
              </h3>
              <Btn $primary as="a" href={`mailto:${d.personal.email}`}>
                <Mail size={15} /> Send Email
              </Btn>
              <Btn as={Link} to="/ai-demos">
                <Brain size={15} /> AI Demos
              </Btn>
              <CVDownloadButton />
            </CInfo>
          </I>
        </ContactRow>
      </A>
    </Page>
  );
};

export default Home;
