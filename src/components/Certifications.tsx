import { Award, ExternalLink } from "lucide-react";
import Section from "@/components/Section";
import Reveal from "@/components/Reveal";
import { certifications } from "@/data/resume";
import { TONE_CLASSES } from "@/data/tones";

const tone = TONE_CLASSES.blue;
const VISIBLE_SKILLS = 4;

export default function Certifications() {
  return (
    <Section
      id="certifications"
      eyebrow="Certifications"
      title="Verified credentials"
      description="Industry certifications validating hands-on SAP expertise."
      tone="blue"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((cert, i) => {
          const visibleSkills = cert.skills.slice(0, VISIBLE_SKILLS);
          const hiddenSkillCount = cert.skills.length - visibleSkills.length;

          return (
            <Reveal key={cert.name} delay={i * 0.1}>
              <div
                className={`flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-colors ${tone.hoverBorder}`}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={cert.badgeImage}
                    alt={cert.name}
                    width={56}
                    height={56}
                    loading="lazy"
                    className="h-14 w-14 shrink-0 rounded-lg"
                  />
                  <div>
                    <h3 className="text-sm font-semibold leading-snug text-foreground">{cert.name}</h3>
                    <p className={`mt-1 flex items-center gap-1.5 text-xs font-medium ${tone.text}`}>
                      <Award size={13} />
                      {cert.issuer}
                    </p>
                  </div>
                </div>

                <p className="mt-3 font-mono text-xs text-muted">
                  Issued {cert.issueDate}
                  {cert.expiryDate && ` · Expires ${cert.expiryDate}`}
                </p>

                <p className="mt-4 text-sm leading-relaxed text-muted">{cert.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {visibleSkills.map((s) => (
                    <span key={s} className={`rounded-full px-3 py-1 font-mono text-xs ${tone.chipBg} ${tone.chipText}`}>
                      {s}
                    </span>
                  ))}
                  {hiddenSkillCount > 0 && (
                    <span className="rounded-full px-3 py-1 font-mono text-xs text-muted">+{hiddenSkillCount}</span>
                  )}
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 pt-1">
                  {cert.credentialId && (
                    <span className="font-mono text-xs text-muted">{cert.credentialId}</span>
                  )}
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`ml-auto flex items-center gap-1 text-xs font-medium ${tone.text} hover:underline`}
                  >
                    Verify credential
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
