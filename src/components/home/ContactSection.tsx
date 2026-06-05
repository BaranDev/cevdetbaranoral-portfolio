import {
  Mail,
  MapPin,
  Globe,
  Github,
  Linkedin,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { AnimatedSection, AnimatedItem } from "../ui/animation";
import { SectionHeading, Btn } from "../ui/primitives";
import CVDownloadButton from "../ui/CVDownloadButton";
import type { Personal } from "../../types/portfolio";

const ContactItem = ({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
}) => (
  <div className="flex items-center gap-3">
    <div className="w-9 h-9 flex items-center justify-center bg-primary/15 rounded-full text-primary">
      <Icon size={16} />
    </div>
    <div>
      <div className="text-[0.72rem] text-secondary">{label}</div>
      <div className="font-medium text-[0.88rem]">{children}</div>
    </div>
  </div>
);

const SocialButton = ({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="w-11 h-11 p-0 rounded-full flex items-center justify-center text-[1.1rem] bg-background text-text shadow-neumorphic hover:animate-glow transition-all duration-300"
  >
    <Icon size={18} />
  </a>
);

const ContactSection = ({ personal }: { personal: Personal }) => (
  <AnimatedSection id="contact" className="py-12">
    <SectionHeading>
      <Mail size={22} /> Let's Connect
    </SectionHeading>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
      <AnimatedItem>
        <div className="p-8 bg-card rounded-xl shadow-neumorphic">
          <div className="flex flex-col gap-4">
            <ContactItem icon={Mail} label="Email">
              {personal.email}
            </ContactItem>
            <ContactItem icon={MapPin} label="Location">
              {personal.location}
            </ContactItem>
            <ContactItem icon={Globe} label="Languages">
              Turkish (Native) · English (C2)
            </ContactItem>
          </div>
          <div className="flex gap-2 mt-6">
            <SocialButton
              href={personal.socialLinks.github}
              label="GitHub"
              icon={Github}
            />
            <SocialButton
              href={personal.socialLinks.linkedin}
              label="LinkedIn"
              icon={Linkedin}
            />
          </div>
        </div>
      </AnimatedItem>
      <AnimatedItem>
        <div className="p-8 bg-card rounded-xl shadow-neumorphic text-center flex flex-col items-center justify-center gap-6">
          <h3 className="font-heading text-primary m-0 text-lg font-bold">
            Ready to Build Together?
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
            <Btn
              primary
              href={`mailto:${personal.email}`}
              className="w-full sm:w-auto"
            >
              <Mail size={15} /> Send Email
            </Btn>
            <CVDownloadButton className="w-full sm:w-auto" />
          </div>
        </div>
      </AnimatedItem>
    </div>
  </AnimatedSection>
);

export default ContactSection;
