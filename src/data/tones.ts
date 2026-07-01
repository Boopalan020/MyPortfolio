export type Tone = "blue" | "teal" | "amber" | "violet" | "rose" | "emerald";

interface ToneClasses {
  /** Eyebrow label / section heading accent text */
  text: string;
  /** Icon fill/stroke color */
  icon: string;
  /** Solid border color, e.g. timeline node ring */
  border: string;
  /** Hover border used on cards */
  hoverBorder: string;
  /** Soft tinted chip/badge background */
  chipBg: string;
  /** Chip text color (pairs with chipBg) */
  chipText: string;
  /** Small bullet/dot accents */
  dot: string;
  /** Solid background for primary CTA buttons */
  solidBg: string;
}

export const TONE_CLASSES: Record<Tone, ToneClasses> = {
  blue: {
    text: "text-accent",
    icon: "text-accent",
    border: "border-accent",
    hoverBorder: "hover:border-accent/50",
    chipBg: "bg-accent-soft",
    chipText: "text-accent-strong",
    dot: "bg-accent",
    solidBg: "bg-accent",
  },
  teal: {
    text: "text-teal",
    icon: "text-teal",
    border: "border-teal",
    hoverBorder: "hover:border-teal/50",
    chipBg: "bg-teal-soft",
    chipText: "text-teal-strong",
    dot: "bg-teal",
    solidBg: "bg-teal",
  },
  amber: {
    text: "text-amber",
    icon: "text-amber",
    border: "border-amber",
    hoverBorder: "hover:border-amber/50",
    chipBg: "bg-amber-soft",
    chipText: "text-amber-strong",
    dot: "bg-amber",
    solidBg: "bg-amber",
  },
  violet: {
    text: "text-violet",
    icon: "text-violet",
    border: "border-violet",
    hoverBorder: "hover:border-violet/50",
    chipBg: "bg-violet-soft",
    chipText: "text-violet-strong",
    dot: "bg-violet",
    solidBg: "bg-violet",
  },
  rose: {
    text: "text-rose",
    icon: "text-rose",
    border: "border-rose",
    hoverBorder: "hover:border-rose/50",
    chipBg: "bg-rose-soft",
    chipText: "text-rose-strong",
    dot: "bg-rose",
    solidBg: "bg-rose",
  },
  emerald: {
    text: "text-emerald",
    icon: "text-emerald",
    border: "border-emerald",
    hoverBorder: "hover:border-emerald/50",
    chipBg: "bg-emerald-soft",
    chipText: "text-emerald-strong",
    dot: "bg-emerald",
    solidBg: "bg-emerald",
  },
};
