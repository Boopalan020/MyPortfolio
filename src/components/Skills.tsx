import Section from "@/components/Section";
import Reveal from "@/components/Reveal";
import { skills } from "@/data/resume";
import { TONE_CLASSES } from "@/data/tones";

const tone = TONE_CLASSES.teal;

export default function Skills() {
  return (
    <Section
      id="skills"
      eyebrow="Skills"
      title="Technical toolbox"
      description="A cross-section of ABAP, SAP BTP, and frontend technologies I use to design, build, and ship enterprise solutions."
      tone="teal"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((group, i) => (
          <Reveal key={group.category} delay={Math.min(i * 0.06, 0.36)}>
            <div
              className={`rounded-2xl border border-border bg-surface p-6 transition-colors ${tone.hoverBorder}`}
            >
              <h3 className="text-sm font-semibold text-foreground">{group.category}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${tone.chipBg} ${tone.chipText}`}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
