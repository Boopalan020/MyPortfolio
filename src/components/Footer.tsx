import { contact } from "@/data/resume";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border py-8">
      <div className="section-container flex flex-col items-center justify-between gap-3 text-sm text-muted sm:flex-row">
        <p>
          © {year} {contact.name}. All rights reserved.
        </p>
        <a href={contact.linkedinUrl} target="_blank" rel="noreferrer" className="hover:text-accent">
          {contact.linkedin}
        </a>
      </div>
    </footer>
  );
}
