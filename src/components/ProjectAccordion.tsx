"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ExperienceProject } from "@/data/resume";
import { Tone, TONE_CLASSES } from "@/data/tones";

export default function ProjectAccordion({
  project,
  defaultOpen = false,
  tone = "amber",
}: {
  project: ExperienceProject;
  defaultOpen?: boolean;
  tone?: Tone;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const toneClasses = TONE_CLASSES[tone];

  return (
    <div className="rounded-xl border border-border bg-background/40">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
      >
        <span>
          <span className="block text-sm font-semibold text-foreground">{project.name}</span>
          <span className="mt-0.5 block font-mono text-xs text-muted">{project.period}</span>
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-muted transition-transform ${open ? `rotate-180 ${toneClasses.icon}` : ""}`}
        />
      </button>
      {open && (
        <ul className="space-y-2 px-4 pb-4 text-sm leading-relaxed text-muted">
          {project.bullets.map((bullet, i) => (
            <li key={i} className="flex gap-2">
              <span className={`mt-2 h-1 w-1 shrink-0 rounded-full ${toneClasses.dot}`} />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
