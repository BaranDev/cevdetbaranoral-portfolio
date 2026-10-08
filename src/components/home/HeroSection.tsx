import { motion } from "framer-motion";
import { FolderGit2, Mail, MapPin } from "lucide-react";
import CVDownloadButton from "../ui/CVDownloadButton";
import CastlePanel from "../ui/castle/CastlePanel";
import { Btn } from "../ui/primitives";
import type { Personal } from "../../types/portfolio";

const scrollTo = (id: string) =>
  requestAnimationFrame(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  });

const HeroSection = ({ personal }: { personal: Personal }) => {
  return (
    <section id="home" className="flex items-center pt-16 sm:pt-24 pb-12 md:pb-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: "100%" }}
      >
        <CastlePanel>

        <div className="relative isolate bg-card rounded-2xl pixel-frame overflow-hidden p-8 lg:pr-[300px] xl:pr-[370px] text-center lg:text-left">
          {/* Canopy light behind the portrait: the subject wears all black, so
              on the dark theme this glow is what keeps him off the card. */}
          <div
            aria-hidden
            className="hidden lg:block absolute -z-10 right-[70px] bottom-0 w-[300px] h-[300px] rounded-full bg-primary/25 blur-3xl"
          />
          <div
            aria-hidden
            className="hidden lg:block absolute -z-10 right-[30px] bottom-[110px] w-[160px] h-[160px] rounded-full bg-glow/20 blur-2xl"
          />

          {/* Mobile: a cropped band above the text. */}
          <img
            className="lg:hidden -mx-8 -mt-8 mb-5 w-[calc(100%+4rem)] max-w-none h-[300px] object-cover object-[50%_10%]"
            src={personal.portraitImage}
            alt={personal.name}
            width={741}
            height={1100}
            fetchPriority="high"
          />

          <p className="flex items-center justify-center lg:justify-start gap-1.5 font-ornament text-[1.05rem] tracking-[0.08em] text-secondary mb-3">
            <MapPin size={12} className="shrink-0" />
            {personal.location}
          </p>

          <h1 className="font-heading text-[clamp(1.6rem,4.5vw,2.6rem)] font-bold tracking-tight mb-1 bg-gradient-to-br from-primary via-accent to-magical text-transparent bg-clip-text">
            {personal.name}
          </h1>
          <p className="text-secondary text-[clamp(1.05rem,2vw,1.25rem)] mb-1.5 font-medium">
            {personal.title}
          </p>
          <p className="text-accent italic text-[0.95rem] mb-4 leading-relaxed">
            {personal.tagline}
          </p>
          <p className="text-text text-[0.95rem] leading-relaxed mb-4 max-w-[520px] mx-auto lg:mx-0">
            {personal.bio}
          </p>
          <div className="flex flex-wrap gap-3 w-full justify-center lg:justify-start mt-4">
            <Btn primary onClick={() => scrollTo("projects")}>
              <FolderGit2 size={15} /> Projects
            </Btn>
            <Btn onClick={() => scrollTo("contact")}>
              <Mail size={15} /> Contact
            </Btn>
            <CVDownloadButton />
          </div>

          {/* Desktop: portrait stands on the card floor, capped so it never outgrows the hero. */}
          <motion.img
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="hidden lg:block absolute -z-10 right-2 xl:right-6 bottom-0 h-full max-h-[430px] w-auto max-w-none pointer-events-none select-none"
            src={personal.portraitImage}
            alt={personal.name}
            width={741}
            height={1100}
            fetchPriority="high"
          />
        </div>
        </CastlePanel>
      </motion.div>
    </section>
  );
};

export default HeroSection;
