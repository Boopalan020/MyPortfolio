"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Building2, ChevronRight, Pause, Play, X } from "lucide-react";
import { FeaturedProject } from "@/data/resume";
import { TONE_CLASSES } from "@/data/tones";

const tone = TONE_CLASSES.violet;
const CARD_SECONDS_EACH = 5;
const VISIBLE_TAGS = 3;

export default function ProjectsCarousel({ projects }: { projects: FeaturedProject[] }) {
  const prefersReducedMotion = useReducedMotion();
  const [hovering, setHovering] = useState(false);
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const [activeProject, setActiveProject] = useState<FeaturedProject | null>(null);

  const paused = hovering || manuallyPaused || activeProject !== null;

  const openProject = (project: FeaturedProject) => {
    setActiveProject(project);
  };

  const togglePlaying = () => {
    setManuallyPaused((v) => !v);
  };

  if (prefersReducedMotion) {
    return (
      <>
        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2">
          {projects.map((project) => (
            <ProjectCard key={project.name} project={project} onOpen={openProject} className="snap-start" />
          ))}
        </div>
        <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
      </>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocusCapture={() => setHovering(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setHovering(false);
      }}
    >
      <div
        className="overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, white 6%, white 94%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, white 6%, white 94%, transparent)",
        }}
      >
        <div
          className="animate-marquee flex w-max gap-5"
          style={{
            animationDuration: `${projects.length * CARD_SECONDS_EACH}s`,
            animationPlayState: paused ? "paused" : "running",
          }}
        >
          {[...projects, ...projects].map((project, i) => (
            <ProjectCard
              key={`${project.name}-${i}`}
              project={project}
              hidden={i >= projects.length}
              onOpen={openProject}
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={togglePlaying}
        aria-label={paused ? "Resume auto-scroll" : "Pause auto-scroll"}
        className="absolute -top-12 right-0 inline-flex h-9 w-9 items-center justify-center rounded-full border border-glass-border bg-glass text-muted shadow-[var(--glass-shadow)] backdrop-blur-md backdrop-saturate-150 transition-colors hover:text-foreground"
      >
        {paused ? <Play size={15} /> : <Pause size={15} />}
      </button>

      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </div>
  );
}

function ProjectCard({
  project,
  hidden = false,
  onOpen,
  className,
}: {
  project: FeaturedProject;
  hidden?: boolean;
  onOpen: (project: FeaturedProject) => void;
  className?: string;
}) {
  const visibleTags = project.tags.slice(0, VISIBLE_TAGS);
  const hiddenTagCount = project.tags.length - visibleTags.length;

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-foreground">{project.name}</h3>
        <span className="shrink-0 font-mono text-xs text-muted">{project.period}</span>
      </div>
      <p className={`mt-1 flex items-center gap-1.5 text-xs font-medium ${tone.text}`}>
        <Building2 size={13} />
        {project.company}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {visibleTags.map((t) => (
          <span key={t} className={`rounded-full px-3 py-1 font-mono text-xs ${tone.chipBg} ${tone.chipText}`}>
            {t}
          </span>
        ))}
        {hiddenTagCount > 0 && (
          <span className="rounded-full px-3 py-1 font-mono text-xs text-muted">+{hiddenTagCount}</span>
        )}
      </div>

      <p className={`mt-4 flex items-center gap-1 text-xs font-medium ${tone.text}`}>
        View details
        <ChevronRight size={14} />
      </p>
    </>
  );

  const sharedClassName = `w-[300px] shrink-0 rounded-2xl border border-border bg-surface p-6 text-left transition-colors cursor-pointer sm:w-[340px] ${tone.hoverBorder} ${className ?? ""}`;

  return (
    <button
      type="button"
      onClick={() => onOpen(project)}
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      className={sharedClassName}
    >
      {content}
    </button>
  );
}

function ProjectModal({ project, onClose }: { project: FeaturedProject | null; onClose: () => void }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!project) return;
    previouslyFocused.current = document.activeElement as HTMLElement;
    closeButtonRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-surface p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 id="project-modal-title" className="text-lg font-semibold text-foreground">
              {project.name}
            </h3>
            <p className={`mt-1 flex items-center gap-1.5 text-xs font-medium ${tone.text}`}>
              <Building2 size={13} />
              {project.company}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-full p-1.5 text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        <span className="mt-3 inline-block font-mono text-xs text-muted">{project.period}</span>

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
          {project.tags.map((t) => (
            <span key={t} className={`rounded-full px-3 py-1 font-mono text-xs ${tone.chipBg} ${tone.chipText}`}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
