import { GraduationCap } from "lucide-react";
import Section from "@/components/Section";
import Reveal from "@/components/Reveal";
import { education } from "@/data/resume";
import { TONE_CLASSES } from "@/data/tones";

const tone = TONE_CLASSES.rose;

export default function Education() {
  return (
    <Section id="education" eyebrow="Education" title="Academic background" tone="rose">
      <div className="grid gap-5 sm:grid-cols-3">
        {education.map((entry, i) => (
          <Reveal key={entry.degree} delay={i * 0.1}>
            <div
              className={`rounded-2xl border border-border bg-surface p-6 transition-colors ${tone.hoverBorder}`}
            >
              <div className="flex items-start justify-between gap-3">
                <GraduationCap size={20} className={tone.icon} />
                <span className={`rounded-full px-3 py-1 font-mono text-xs ${tone.chipBg} ${tone.chipText}`}>
                  {entry.score}
                </span>
              </div>
              <h3 className="mt-4 text-sm font-semibold leading-snug text-foreground">{entry.degree}</h3>
              <p className="mt-2 text-sm text-muted">{entry.school}</p>
              <p className="mt-3 font-mono text-xs text-muted">{entry.period}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
