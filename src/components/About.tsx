import Section from "@/components/Section";
import Reveal from "@/components/Reveal";
import { summary } from "@/data/resume";

const STATS = [
  { label: "Years of experience", value: "5+" },
  { label: "Companies", value: "2" },
  { label: "Client engagements", value: "8+" },
  { label: "BTP services used", value: "10+" },
];

export default function About() {
  return (
    <Section id="about" eyebrow="About" title="Techno-functional SAP consultant">
      <div className="grid gap-12 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <p className="text-base leading-relaxed text-muted">{summary}</p>
        </Reveal>
        <dl className="grid grid-cols-2 gap-6">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08}>
              <div className="rounded-2xl border border-glass-border bg-glass p-5 backdrop-blur-md backdrop-saturate-150 shadow-[var(--glass-shadow)]">
                <dt className="text-sm text-muted">{stat.label}</dt>
                <dd className="mt-1 font-mono text-2xl font-semibold text-accent">{stat.value}</dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </Section>
  );
}
