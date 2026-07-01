"use client";

import { useEffect, useState } from "react";
import { Download, Menu, X } from "lucide-react";
import { contact } from "@/data/resume";
import ThemeToggle from "@/components/ThemeToggle";
import Logo from "@/components/Logo";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("about");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map((link) => document.querySelector(link.href));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((section) => section && observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors backdrop-blur-md backdrop-saturate-150 ${
        scrolled ? "border-glass-border bg-glass" : "border-transparent bg-transparent"
      }`}
    >
      <nav className="section-container flex h-16 items-center justify-between">
        <a href="#" aria-label="Boopalan M — home">
          <Logo size={40} />
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-foreground ${
                  activeSection === link.href.slice(1) ? "text-accent" : "text-muted"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <a
            href={contact.resumeUrl}
            download
            className="inline-flex items-center gap-2 rounded-full border border-glass-border bg-glass px-4 py-2 text-sm font-medium text-foreground shadow-[var(--glass-shadow)] backdrop-blur-md backdrop-saturate-150 transition-colors hover:border-accent hover:text-accent"
          >
            <Download size={16} />
            Resume
          </a>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Toggle navigation menu"
            className="text-foreground"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-glass-border bg-glass backdrop-blur-md backdrop-saturate-150 md:hidden">
          <ul className="section-container flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 text-base font-medium text-muted hover:bg-surface hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={contact.resumeUrl}
                download
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center gap-2 rounded-lg bg-accent px-3 py-3 text-base font-medium text-[#06111f]"
              >
                <Download size={18} />
                Download Resume
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
