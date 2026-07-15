"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { contact } from "@/data/resume";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const photoReveal: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden pt-16 pb-20 sm:pt-36 sm:pb-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60rem 30rem at 50% -10%, rgba(59,167,255,0.16), transparent 60%)",
        }}
      />
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="section-container grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]"
      >
        <div className="order-2 lg:order-1">
          <motion.a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.location)}`}
            target="_blank"
            rel="noreferrer"
            variants={item}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-glass-border bg-glass px-4 py-1.5 font-mono text-sm text-muted shadow-[var(--glass-shadow)] backdrop-blur-md backdrop-saturate-150 transition-colors hover:border-accent/50 hover:text-accent"
          >
            <MapPin size={14} className="text-accent" />
            {contact.location}
          </motion.a>

          <motion.h1
            variants={item}
            className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-6xl"
          >
            {contact.name}
          </motion.h1>
          <motion.p variants={item} className="mt-4 max-w-2xl text-xl font-medium text-accent sm:text-2xl">
            {contact.title}
          </motion.p>
          <motion.p variants={item} className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            Almost five years delivering S/4HANA implementations, BTP automation, and SAP CAP
            integrations — with hands-on techno-functional exposure across SD and MM.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold text-foreground backdrop-blur-md backdrop-saturate-150 transition-transform hover:scale-[1.02]"
              style={{
                background: "color-mix(in srgb, var(--accent) 28%, transparent)",
                borderColor: "color-mix(in srgb, var(--accent) 55%, transparent)",
                boxShadow: "var(--glass-shadow)",
              }}
            >
              View Projects
              <ArrowRight size={16} className="text-accent" />
            </a>
          </motion.div>
        </div>

        <motion.div
          variants={photoReveal}
          className="order-1 relative mx-auto h-56 w-56 shrink-0 sm:h-72 sm:w-72 lg:order-2 lg:mx-0 lg:h-80 lg:w-80"
        >
          <div
            aria-hidden
            className="absolute inset-0 -z-10 scale-110 rounded-full blur-2xl"
            style={{
              background:
                "radial-gradient(circle, rgba(59,167,255,0.35), rgba(59,167,255,0) 70%)",
            }}
          />
          <div className="h-full w-full overflow-hidden rounded-full border-4 border-surface shadow-2xl ring-1 ring-border">
            <Image
              src="/images/profile-v2.jpg"
              alt="Boopalan M"
              width={800}
              height={800}
              priority
              sizes="(min-width: 1024px) 320px, (min-width: 640px) 288px, 224px"
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
