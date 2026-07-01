import { Building2 } from "lucide-react";
import Section from "@/components/Section";
import Reveal from "@/components/Reveal";
import { featuredProjects } from "@/data/resume";
import { TONE_CLASSES } from "@/data/tones";

const tone = TONE_CLASSES.violet;

export default function Projects() {
  return (
    <Section
      id="projects"
      eyebrow="Featured Projects"
      title="Selected work"
      description="A closer look at the engagements where I owned the technical design end-to-end."
      tone="violet"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {featuredProjects.map((project, i) => (
          <Reveal key={project.name} delay={Math.min(i * 0.08, 0.32)}>
            <article
              className={`flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-colors ${tone.hoverBorder}`}
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg font-semibold text-foreground">{project.name}</h3>
                <span className="shrink-0 font-mono text-xs text-muted">{project.period}</span>
              </div>
              <p className={`mt-1 flex items-center gap-1.5 text-xs font-medium ${tone.text}`}>
                <Building2 size={13} />
                {project.company}
              </p>

              <p className="mt-4 text-sm leading-relaxed text-muted">{project.description}</p>

              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted">
                {project.highlights.map((point, i) => (
                  <li key={i} className="flex gap-2">
                    <span className={`mt-2 h-1 w-1 shrink-0 rounded-full ${tone.dot}`} />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap gap-2 pt-1">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`rounded-full px-3 py-1 font-mono text-xs ${tone.chipBg} ${tone.chipText}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
