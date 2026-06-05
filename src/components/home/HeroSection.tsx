import { motion } from "framer-motion";
import { FolderGit2, Mail } from "lucide-react";
import CVDownloadButton from "../ui/CVDownloadButton";
import { Btn } from "../ui/primitives";
import type { Personal } from "../../types/portfolio";

const scrollTo = (id: string) =>
  requestAnimationFrame(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  });

const HeroSection = ({ personal }: { personal: Personal }) => (
  <section id="home" className="flex items-center py-12 md:py-8">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ width: "100%" }}
    >
      <div className="p-8 grid grid-cols-1 md:grid-cols-[1fr_180px] gap-8 items-center text-center md:text-left bg-card rounded-2xl shadow-neumorphic">
        <div className="order-2 md:order-1">
          <h1 className="font-heading text-[clamp(1.6rem,4.5vw,2.6rem)] font-bold tracking-tight mb-1 bg-gradient-to-br from-primary via-accent to-magical text-transparent bg-clip-text">
            {personal.name}
          </h1>
          <p className="text-secondary text-[clamp(0.95rem,2vw,1.15rem)] mb-1.5 font-medium">
            {personal.title}
          </p>
          <p className="text-accent italic text-sm mb-4 leading-relaxed">
            {personal.tagline}
          </p>
          <p className="text-text text-[0.88rem] leading-relaxed mb-4 max-w-[520px] mx-auto md:mx-0">
            {personal.bio}
          </p>
          <div className="flex flex-wrap gap-3 w-full justify-center md:justify-start mt-4">
            <Btn primary onClick={() => scrollTo("projects")}>
              <FolderGit2 size={15} /> Projects
            </Btn>
            <Btn onClick={() => scrollTo("contact")}>
              <Mail size={15} /> Contact
            </Btn>
            <CVDownloadButton />
          </div>
        </div>
        <div className="order-1 md:order-2 flex justify-center">
          <div className="w-[170px] h-[170px] relative mx-auto before:absolute before:-inset-1.5 before:bg-gradient-to-tr before:from-primary before:to-magical before:rounded-full before:-z-10 before:animate-glow">
            <img
              className="w-full h-full rounded-full object-cover border-[3px] border-card"
              src={personal.profileImage}
              alt={personal.name}
            />
          </div>
        </div>
      </div>
    </motion.div>
  </section>
);

export default HeroSection;
