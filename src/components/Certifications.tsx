"use client";

import { useState } from "react";
import { Award, ExternalLink, RotateCw } from "lucide-react";
import Section from "@/components/Section";
import Reveal from "@/components/Reveal";
import { certifications } from "@/data/resume";
import { TONE_CLASSES } from "@/data/tones";

const tone = TONE_CLASSES.blue;

export default function Certifications() {
  const [flipped, setFlipped] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(i)) {
        next.delete(i);
      } else {
        next.add(i);
      }
      return next;
    });
  };

  return (
    <Section
      id="certifications"
      eyebrow="Certifications"
      title="Verified credentials"
      description="Industry certifications validating hands-on SAP expertise. Click a card to flip it."
      tone="blue"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((cert, i) => {
          const isFlipped = flipped.has(i);

          return (
            <Reveal key={cert.name} delay={i * 0.1} className="h-full">
              <div className="cert-flip-outer h-[420px]">
                <div
                  role="button"
                  tabIndex={0}
                  aria-pressed={isFlipped}
                  aria-label={`${isFlipped ? "Hide" : "Show"} details for ${cert.name}`}
                  onClick={() => toggle(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggle(i);
                    }
                  }}
                  className={`cert-flip-card h-full cursor-pointer rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    isFlipped ? "is-flipped" : ""
                  }`}
                >
                  <div className="cert-flip-inner h-full">
                    {/* Front */}
                    <div
                      className={`cert-flip-face flex h-full flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-surface p-6 text-center transition-colors ${tone.hoverBorder}`}
                    >
                      <div className="relative flex items-center justify-center">
                        <div className="absolute h-52 w-52 rounded-full bg-accent/20 blur-2xl" aria-hidden="true" />
                        <img
                          src={cert.badgeImage}
                          alt={cert.name}
                          width={176}
                          height={176}
                          loading="lazy"
                          className="relative h-44 w-44 rounded-2xl object-cover shadow-lg shadow-black/30 ring-1 ring-border"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold leading-snug text-foreground">{cert.name}</h3>
                        <p className={`mt-2 flex items-center justify-center gap-1.5 text-xs font-medium ${tone.text}`}>
                          <Award size={13} />
                          {cert.issuer}
                        </p>
                        <p className="mt-1 font-mono text-xs text-muted">
                          Issued {cert.issueDate}
                          {cert.expiryDate && ` · Expires ${cert.expiryDate}`}
                        </p>
                      </div>
                      <p className="flex items-center justify-center gap-1.5 font-mono text-[11px] text-muted">
                        <RotateCw size={12} />
                        Click to flip
                      </p>
                    </div>

                    {/* Back */}
                    <div className="cert-flip-face cert-flip-back flex h-full flex-col rounded-2xl border border-border bg-surface p-6">
                      <h3 className="shrink-0 text-sm font-semibold leading-snug text-foreground">{cert.name}</h3>

                      <div className="mt-3 min-h-0 flex-1 overflow-y-auto pr-1">
                        <p className="text-sm leading-relaxed text-muted">{cert.description}</p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {cert.skills.map((s) => (
                            <span
                              key={s}
                              className={`rounded-full px-3 py-1 font-mono text-xs ${tone.chipBg} ${tone.chipText}`}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-3 flex shrink-0 items-center justify-between gap-3 border-t border-border pt-4">
                        {cert.credentialId && (
                          <span className="font-mono text-xs text-muted">{cert.credentialId}</span>
                        )}
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className={`ml-auto flex items-center gap-1 text-xs font-medium ${tone.text} hover:underline`}
                        >
                          Verify credential
                          <ExternalLink size={13} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
