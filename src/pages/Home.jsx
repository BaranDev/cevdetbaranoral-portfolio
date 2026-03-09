import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MotionDiv = motion.div;

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
  FileText,
  ChevronRight,
  Code2,
  Database,
  Cloud,
  Brain,
  Wrench,
  Palette,
} from "lucide-react";
import CVDownloadButton from "../components/ui/CVDownloadButton";
import portfolioData from "../data/portfolioData.json";

/* ── animation ────────────────────────────────── */
const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

const A = ({ children, id, className, ...r }) => (
  <MotionDiv
    id={id}
    className={className}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.12 }}
    variants={stagger}
    {...r}
  >
    {children}
  </MotionDiv>
);
const I = ({ children, className, ...r }) => (
  <MotionDiv
    className={className}
    variants={fadeUp}
    transition={{ duration: 0.4, ease: "easeOut" }}
    {...r}
  >
    {children}
  </MotionDiv>
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

/* ── Tailwind Components replacing Styled Components ──────────────── */

const Page = ({ children }) => (
  <div className="w-full max-w-[1100px] mx-auto px-8 md:px-8">{children}</div>
);

const Hero = ({ children, id }) => (
  <section id={id} className="flex items-center py-12 md:py-8">
    {children}
  </section>
);

const HeroCard = ({ children }) => (
  <div className="p-8 grid grid-cols-1 md:grid-cols-[1fr_180px] gap-8 items-center text-center md:text-left bg-card rounded-2xl shadow-neumorphic">
    {children}
  </div>
);

// Helper for ordering
const HeroText = ({ children }) => (
  <div className="order-2 md:order-1">{children}</div>
);

const AvatarWrap = ({ children }) => (
  <div className="order-1 md:order-2 flex justify-center">{children}</div>
);

const Name = ({ children }) => (
  <h1 className="font-heading text-[clamp(1.6rem,4.5vw,2.6rem)] font-bold tracking-tight mb-1 bg-gradient-to-br from-primary via-accent to-magical text-transparent bg-clip-text">
    {children}
  </h1>
);

const Title = ({ children }) => (
  <p className="text-secondary text-[clamp(0.95rem,2vw,1.15rem)] mb-1.5 font-medium">
    {children}
  </p>
);

const Tagline = ({ children }) => (
  <p className="text-accent italic text-sm mb-4 leading-relaxed">{children}</p>
);

const Bio = ({ children }) => (
  <p className="text-text text-[0.88rem] leading-relaxed mb-4 max-w-[520px] mx-auto md:mx-0">
    {children}
  </p>
);

const Avatar = ({ children }) => (
  <div className="w-[170px] h-[170px] relative mx-auto before:absolute before:-inset-1.5 before:bg-gradient-to-tr before:from-primary before:to-magical before:rounded-full before:-z-10 before:animate-glow">
    {children}
  </div>
);

const AvatarImage = (props) => (
  <img
    className="w-full h-full rounded-full object-cover border-[3px] border-card"
    {...props}
  />
);

const Btn = ({
  as,
  $primary,
  children,
  href,
  to,
  onClick,
  className = "",
  ...props
}) => {
  const classes = `
    inline-flex items-center justify-center gap-1.5 px-[18px] py-2 
    text-[0.82rem] font-semibold rounded-xl transition-all duration-300
    ${
      $primary
        ? "bg-primary text-white shadow-md hover:-translate-y-[2px] hover:animate-glow"
        : "bg-background text-text shadow-neumorphic hover:-translate-y-[2px] hover:animate-glow"
    }
    ${className}
  `;

  if (as === Link && to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }
  if (as === "a" || href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={classes} {...props}>
      {children}
    </button>
  );
};

const BtnGrid = ({ children }) => (
  <div className="flex flex-wrap gap-3 w-full justify-center md:justify-start mt-4">
    {children}
  </div>
);

// Stats
const StatsRow = ({ children }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 my-4">{children}</div>
);

const Stat = ({ children }) => (
  <div className="text-center p-4 bg-card rounded-xl shadow-neumorphic transition-transform duration-300 hover:-translate-y-[3px]">
    {children}
  </div>
);

const StatNum = ({ children }) => (
  <div className="text-xl md:text-2xl font-bold text-primary font-heading">
    {children}
  </div>
);

const StatLbl = ({ children }) => (
  <div className="text-[0.7rem] text-secondary uppercase tracking-wide mt-0.5">
    {children}
  </div>
);

// Section Header
const SH = ({ children, style }) => (
  <h2
    className="flex items-center justify-center gap-2.5 font-heading text-text text-[clamp(1.2rem,3vw,1.6rem)] font-semibold tracking-tight mb-4 text-center sticky top-0 z-10 py-3.5 backdrop-blur-md bg-card/80 rounded-b-xl -mx-4 md:-mx-8 px-4 md:px-8 shadow-sm"
    style={style}
  >
    {children}
  </h2>
);

// Experience
const Timeline = ({ children }) => (
  <div className="relative mt-4 before:absolute before:left-[18px] before:top-0 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-primary before:to-magical">
    {children}
  </div>
);

const Job = ({ children }) => (
  <div className="relative ml-[44px] my-2 p-4 bg-card rounded-xl shadow-neumorphic">
    {children}
  </div>
);

const JobTitle = ({ children }) => (
  <h3 className="font-heading text-primary m-0 mb-0.5 text-[0.95rem] font-semibold">
    {children}
  </h3>
);

const JobMeta = ({ children }) => (
  <div className="text-[0.78rem] text-secondary mb-1">{children}</div>
);

const JobDesc = ({ children }) => (
  <p className="text-[0.82rem] text-text mb-1.5 leading-relaxed">{children}</p>
);

const Chips = ({ children }) => (
  <div className="flex flex-wrap gap-1">{children}</div>
);

const Chip = ({ children }) => (
  <span className="bg-primary/10 text-primary px-2 py-[2px] rounded-xl text-[0.7rem] font-medium border border-primary/20">
    {children}
  </span>
);

const AchRow = ({ children }) => (
  <div className="flex items-center gap-2 mb-[3px] text-[0.8rem]">
    {children}
  </div>
);

const Metric = ({ children }) => (
  <span className="bg-primary/20 text-primary px-2 py-[2px] rounded font-bold text-[0.75rem] min-w-[48px] text-center">
    {children}
  </span>
);

// Projects
const PGrid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4 mt-4">
    {children}
  </div>
);

const PCard = ({ children, ...props }) => (
  <div
    className="p-4 bg-card rounded-xl shadow-neumorphic transition-all duration-300 hover:-translate-y-1 hover:animate-glow"
    {...props}
  >
    {children}
  </div>
);

const PHead = ({ children }) => (
  <div className="flex items-center justify-between mb-1">{children}</div>
);

const PTitle = ({ children }) => (
  <h3 className="font-heading text-text m-0 text-[0.95rem] font-semibold">
    {children}
  </h3>
);

const Badge = ({ children }) => (
  <span className="bg-primary/20 text-primary px-2 py-[1px] rounded-xl text-[0.65rem] font-semibold uppercase tracking-wide whitespace-nowrap">
    {children}
  </span>
);

const PAward = ({ children }) => (
  <div className="text-[0.75rem] text-accent font-semibold mb-1.5 flex items-center gap-1">
    {children}
  </div>
);

const PDesc = ({ children }) => (
  <p className="text-[0.8rem] text-text leading-relaxed my-1 mb-2">
    {children}
  </p>
);

const PImpact = ({ children }) => (
  <div className="flex gap-2 my-2 flex-wrap">{children}</div>
);

const PImpactItem = ({ children }) => (
  <div className="text-center min-w-[70px]">{children}</div>
);

const PImpactVal = ({ children }) => (
  <div className="text-[0.85rem] font-bold text-primary font-heading">
    {children}
  </div>
);

const PImpactLbl = ({ children }) => (
  <div className="text-[0.6rem] text-secondary uppercase">{children}</div>
);

const PActions = ({ children }) => (
  <div className="flex gap-1.5 mt-2">{children}</div>
);

const PLink = ({ href, children, ...props }) => (
  <a
    href={href}
    className="inline-flex items-center gap-1 text-[0.75rem] font-semibold text-primary px-2.5 py-1 rounded border border-primary/30 transition-all duration-200 hover:bg-primary/15 hover:-translate-y-[1px]"
    {...props}
  >
    {children}
  </a>
);

// Skills
const SGrid = ({ children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-2 mt-4">
    {children}
  </div>
);

const SCat = ({ children }) => (
  <div className="p-4 bg-card rounded-xl shadow-neumorphic">{children}</div>
);

const SCatHead = ({ children }) => (
  <div className="flex items-center gap-2 mb-2">{children}</div>
);

const SCatTitle = ({ children }) => (
  <h4 className="font-heading m-0 text-primary text-[0.85rem] font-semibold">
    {children}
  </h4>
);

const SkillList = ({ children }) => (
  <div className="flex flex-wrap gap-1">{children}</div>
);

// Education
const EduGrid = ({ children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4 mt-4">
    {children}
  </div>
);

const EduCard = ({ children }) => (
  <div className="p-4 bg-card rounded-xl shadow-neumorphic">{children}</div>
);

const EduDegree = ({ children }) => (
  <h3 className="font-heading text-primary m-0 mb-0.5 text-[0.9rem] font-semibold">
    {children}
  </h3>
);

const EduMeta = ({ children }) => (
  <div className="text-[0.78rem] text-secondary mb-1">{children}</div>
);

const EduBadge = ({ children }) => (
  <div className="text-[0.75rem] text-accent font-medium flex flex-wrap gap-1.5 items-center">
    {children}
  </div>
);

// Awards
const AwardRow = ({ children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-2 mt-4">
    {children}
  </div>
);

const AwardCard = ({ children }) => (
  <div className="px-4 py-2 text-[0.82rem] flex items-center gap-2 bg-card rounded-xl shadow-neumorphic">
    {children}
  </div>
);

// Contact
const ContactRow = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">{children}</div>
);

const CInfo = ({ children, style, className = "" }) => (
  <div
    className={`p-8 bg-card rounded-xl shadow-neumorphic ${className}`}
    style={style}
  >
    {children}
  </div>
);

const SocBtn = ({ as, href, children, ...props }) => {
  const Component = as || "button";
  return (
    <Component
      href={href}
      className="w-11 h-11 p-0 rounded-full flex items-center justify-center text-[1.1rem] bg-background text-text shadow-neumorphic hover:animate-glow transition-all duration-300"
      {...props}
    >
      {children}
    </Component>
  );
};

const ContactItem = ({ children }) => (
  <div className="flex items-center gap-3">{children}</div>
);

const ContactIcon = ({ children }) => (
  <div className="w-9 h-9 flex items-center justify-center bg-primary/15 rounded-full text-primary">
    {children}
  </div>
);

const ContactLabel = ({ children }) => (
  <div className="text-[0.72rem] text-secondary">{children}</div>
);

const ContactValue = ({ children }) => (
  <div className="font-medium text-[0.88rem]">{children}</div>
);

/* ── Component ────────────────────────────────── */

const Home = () => {
  const d = portfolioData;
  const featured = d.projects.filter((p) => p.priority === "featured");
  const other = d.projects.filter((p) => p.priority !== "featured");
  const scrollTo = (id) =>
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    });

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
          {p.media?.mock_demo && (
            <PLink
              href={p.media.mock_demo}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Zap size={12} /> Live Board Demo
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
        <MotionDiv
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
                <CVDownloadButton />
              </BtnGrid>
            </HeroText>
            <AvatarWrap>
              <Avatar>
                <AvatarImage
                  src={d.personal.profileImage}
                  alt={d.personal.name}
                />
              </Avatar>
            </AvatarWrap>
          </HeroCard>
        </MotionDiv>
      </Hero>

      {/* Stats */}
      <A id="stats">
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
      <A id="experience" className="py-8">
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
                <div className="mb-1.5">
                  {j.achievements.map((a, i) => (
                    <AchRow key={i}>
                      <Metric>{a.metric}</Metric>
                      <span className="text-text">{a.description}</span>
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
      <A id="projects" className="py-8">
        <I>
          <SH>
            <FolderGit2 size={22} /> Featured Projects
          </SH>
        </I>
        <PGrid>{featured.map(renderProjectCard)}</PGrid>

        {other.length > 0 && (
          <>
            <I>
              <SH style={{ marginTop: "2rem", fontSize: "1.1rem" }}>
                <ChevronRight size={18} /> More Projects
              </SH>
            </I>
            <PGrid>{other.map(renderProjectCard)}</PGrid>
          </>
        )}
      </A>

      {/* Skills */}
      <A id="skills" className="py-8">
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
                    <Icon size={18} className="text-primary" />
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
      <A id="education" className="py-8">
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
      <A className="py-8">
        <I>
          <SH>
            <Award size={22} /> Awards & Certifications
          </SH>
        </I>
        <AwardRow>
          {d.awards.map((a, i) => (
            <I key={i}>
              <AwardCard>
                <Trophy size={14} className="text-primary" />
                <span className="text-text">{a}</span>
              </AwardCard>
            </I>
          ))}
          {d.certifications.map((c, i) => (
            <I key={"c" + i}>
              <AwardCard>
                <FileText size={14} className="text-primary" />
                <span className="text-text">{c}</span>
              </AwardCard>
            </I>
          ))}
        </AwardRow>
      </A>

      {/* Contact */}
      <A id="contact" className="py-12">
        <I>
          <SH>
            <Mail size={22} /> Let's Connect
          </SH>
        </I>
        <ContactRow>
          <I>
            <CInfo>
              <div className="flex flex-col gap-4">
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
              <div className="flex gap-2 mt-6">
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
              </div>
            </CInfo>
          </I>
          <I>
            <CInfo className="text-center flex flex-col items-center justify-center gap-6">
              <h3 className="font-heading text-primary m-0 text-lg font-bold">
                Ready to Build Together?
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
                <Btn
                  $primary
                  as="a"
                  href={`mailto:${d.personal.email}`}
                  className="w-full sm:w-auto"
                >
                  <Mail size={15} /> Send Email
                </Btn>
                <CVDownloadButton className="w-full sm:w-auto" />
              </div>
            </CInfo>
          </I>
        </ContactRow>
      </A>
    </Page>
  );
};

export default Home;
