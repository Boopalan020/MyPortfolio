import { ReactNode } from "react";
import { Tone, TONE_CLASSES } from "@/data/tones";
import Reveal from "@/components/Reveal";

interface SectionProps {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  tone?: Tone;
  children: ReactNode;
  className?: string;
}

export default function Section({
  id,
  eyebrow,
  title,
  description,
  tone = "blue",
  children,
  className,
}: SectionProps) {
  const toneClasses = TONE_CLASSES[tone];
  return (
    <section id={id} className={`scroll-mt-24 py-20 sm:py-24 ${className ?? ""}`}>
      <div className="section-container">
        <Reveal className="mb-12 max-w-2xl">
          {eyebrow && (
            <p className={`mb-3 font-mono text-sm font-medium tracking-wide ${toneClasses.text}`}>
              {eyebrow}
            </p>
          )}
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h2>
          {description && <p className="mt-4 text-base leading-relaxed text-muted">{description}</p>}
        </Reveal>
        {children}
      </div>
    </section>
  );
}
