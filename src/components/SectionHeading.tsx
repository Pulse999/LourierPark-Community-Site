
import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: ReactNode;
  text?: string;
  light?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  text,
  light = false,
}: Props) {
  return (
    <div className={`section-heading ${light ? "light" : ""}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}
