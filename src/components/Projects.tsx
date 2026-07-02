import Section from "@/components/Section";
import Reveal from "@/components/Reveal";
import ProjectsCarousel from "@/components/ProjectsCarousel";
import { featuredProjects } from "@/data/resume";

export default function Projects() {
  return (
    <Section
      id="projects"
      eyebrow="Featured Projects"
      title="Selected work"
      description="A closer look at the engagements where I owned the technical design end-to-end. Click any card for the full breakdown."
      tone="violet"
    >
      <Reveal>
        <ProjectsCarousel projects={featuredProjects} />
      </Reveal>
    </Section>
  );
}
