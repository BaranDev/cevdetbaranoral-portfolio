import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 rounded-t-2xl bg-card p-8 border-t border-primary/10 shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.1)] relative overflow-hidden">
      {/* Glow effect background */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="flex flex-wrap gap-8 justify-between max-w-[1200px] mx-auto">
        <div className="flex-1 min-w-[200px] mb-6 md:mb-0">
          <h3 className="text-lg font-semibold mb-4 text-primary">Portfolio</h3>
          <p className="text-text/90 leading-relaxed mb-6 max-w-sm">
            A showcase of my skills, projects, and experience as a Software
            Engineering undergraduate with expertise in AI technologies and
            full-stack development.
          </p>

          <div className="flex gap-4 mt-4">
            {[
              {
                href: "https://github.com/BaranDev",
                icon: "fab fa-github",
                label: "GitHub",
              },
              {
                href: "https://linkedin.com/in/cevdetbaranoral",
                icon: "fab fa-linkedin-in",
                label: "LinkedIn",
              },
              {
                href: "https://cevdetbaran.com",
                icon: "fas fa-globe",
                label: "Website",
              },
              {
                href: "mailto:cevdetbaranoral@gmail.com",
                icon: "fas fa-envelope",
                label: "Email",
              },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-background shadow-sm text-primary transition-all duration-300 hover:shadow-md hover:scale-110 hover:text-accent border border-primary/10"
              >
                <i className={link.icon}></i>
              </a>
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-[200px] mb-6 md:mb-0">
          <h3 className="text-lg font-semibold mb-4 text-primary">
            Quick Links
          </h3>
          <div className="flex flex-col gap-2">
            {[
              { to: "/", label: "Home" },
              { to: "/#projects", label: "Projects" },
              { to: "/#skills", label: "Skills" },
              { to: "/#experience", label: "Experience" },
              { to: "/#contact", label: "Contact" },
              { to: "/ai-demos", label: "AI Demos" },
            ].map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-text hover:text-primary hover:translate-x-1 transition-all duration-200 block py-1"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-[200px]">
          <h3 className="text-lg font-semibold mb-4 text-primary">Contact</h3>
          <p className="flex items-center gap-3 mb-3 text-text">
            <i className="fas fa-map-marker-alt text-primary/80"></i>
            Famagusta, Cyprus
          </p>

          <p className="flex items-center gap-3 mb-3 text-text">
            <i className="fas fa-envelope text-primary/80"></i>
            cevdetbaranoral@gmail.com
          </p>
        </div>
      </div>

      <div className="my-8 w-full h-[1px] bg-gradient-to-r from-transparent via-text/10 to-transparent" />

      <p className="text-center text-secondary text-sm">
        © {currentYear} Cevdet Baran Oral. All rights reserved. Designed with
        React and Neumorphism.
      </p>
    </footer>
  );
};

export default Footer;
