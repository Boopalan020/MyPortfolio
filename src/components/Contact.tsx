import { Download, Mail, MapPin, Phone } from "lucide-react";
import Section from "@/components/Section";
import Reveal from "@/components/Reveal";
import LinkedinIcon from "@/components/icons/LinkedinIcon";
import { contact } from "@/data/resume";
import { TONE_CLASSES } from "@/data/tones";

const tone = TONE_CLASSES.emerald;

const CONTACT_ITEMS = [
  { icon: Mail, label: "Email", value: contact.email, href: `mailto:${contact.email}` },
  { icon: Phone, label: "Phone", value: contact.phone, href: `tel:${contact.phone.replace(/\s+/g, "")}` },
  { icon: LinkedinIcon, label: "LinkedIn", value: contact.linkedin, href: contact.linkedinUrl },
  { icon: MapPin, label: "Location", value: contact.location, href: undefined },
];

export default function Contact() {
  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Let's work together"
      description="Open to SAP BTP / ABAP consulting engagements and full-stack opportunities. Reach out directly or connect on LinkedIn."
      tone="emerald"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {CONTACT_ITEMS.map(({ icon: Icon, label, value, href }, i) => {
          const content = (
            <>
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${tone.chipBg} ${tone.icon}`}
              >
                <Icon size={18} />
              </span>
              <span>
                <span className="block text-xs text-muted">{label}</span>
                <span className="block text-sm font-medium text-foreground">{value}</span>
              </span>
            </>
          );
          return (
            <Reveal key={label} delay={i * 0.08}>
              {href ? (
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  className={`flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition-colors ${tone.hoverBorder}`}
                >
                  {content}
                </a>
              ) : (
                <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5">
                  {content}
                </div>
              )}
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={CONTACT_ITEMS.length * 0.08}>
        <a
          href={contact.resumeUrl}
          download
          className={`mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-[#06111f] transition-transform hover:scale-[1.02] ${tone.solidBg}`}
        >
          <Download size={16} />
          Download Full Resume
        </a>
      </Reveal>
    </Section>
  );
}
