import { Briefcase, MapPin } from "lucide-react";
import Section from "@/components/Section";
import Reveal from "@/components/Reveal";
import ProjectAccordion from "@/components/ProjectAccordion";
import { experience } from "@/data/resume";
import { TONE_CLASSES } from "@/data/tones";

const tone = TONE_CLASSES.amber;

export default function Experience() {
  return (
    <Section
      id="experience"
      eyebrow="Experience"
      title="Where I've worked"
      description="Two companies, eight-plus client engagements — spanning ABAP development, SAP BTP automation, and S/4HANA migrations."
      tone="amber"
    >
      <div className="relative space-y-10 border-l border-border pl-8">
        {experience.map((entry, index) => (
          <Reveal key={entry.company} delay={index * 0.1}>
            <div className="relative">
              <span
                className={`absolute -left-[2.35rem] flex h-6 w-6 items-center justify-center rounded-full border bg-background ${tone.border}`}
              >
                <Briefcase size={12} className={tone.icon} />
              </span>

              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-lg font-semibold text-foreground">{entry.company}</h3>
                <span className={`font-mono text-sm ${tone.text}`}>{entry.period}</span>
              </div>
              <p className="mt-1 text-sm font-medium text-muted">{entry.role}</p>
              {entry.location && (
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                  <MapPin size={12} />
                  {entry.location}
                </p>
              )}

              <div className="mt-5 space-y-3">
                {entry.projects.map((project, i) => (
                  <ProjectAccordion key={project.name} project={project} defaultOpen={index === 0 && i === 0} />
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
