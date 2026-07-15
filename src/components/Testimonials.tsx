"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Section from "@/components/Section";
import { testimonials } from "@/data/resume";
import { TONE_CLASSES } from "@/data/tones";

const tone = TONE_CLASSES.teal;
const AUTO_ADVANCE_SECONDS = 7;

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Testimonials() {
  const prefersReducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const count = testimonials.length;

  const goTo = (i: number) => setIndex((i + count) % count);
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  useEffect(() => {
    if (paused || count <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), AUTO_ADVANCE_SECONDS * 1000);
    return () => clearInterval(id);
  }, [paused, count]);

  if (count === 0) return null;

  const current = testimonials[index];

  return (
    <Section
      id="testimonials"
      eyebrow="Testimonials"
      title="What colleagues say"
      description="Feedback from people I've worked alongside, shared on LinkedIn."
      tone="teal"
    >
      <div
        className="relative mx-auto max-w-2xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
        }}
      >
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-8 sm:p-10">
          <Quote className={`h-8 w-8 ${tone.text}`} aria-hidden="true" />

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="mt-4 text-base leading-relaxed text-foreground sm:text-lg">
                &ldquo;{current.quote}&rdquo;
              </p>

              <div className="mt-6 flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-[#06111f] ${tone.solidBg}`}
                  aria-hidden="true"
                >
                  {initials(current.name)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{current.name}</p>
                  <p className="text-xs text-muted">
                    {current.title} · {current.company}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {count > 1 && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous testimonial"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:text-foreground"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex items-center gap-2">
              {testimonials.map((t, i) => (
                <button
                  key={`${t.name}-${i}`}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Show testimonial from ${t.name}`}
                  aria-current={i === index}
                  className={`h-2 w-2 rounded-full transition-colors ${i === index ? tone.dot : "bg-border"}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              aria-label="Next testimonial"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:text-foreground"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </Section>
  );
}
