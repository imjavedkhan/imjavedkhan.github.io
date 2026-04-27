import { type ReactNode, type ElementType, type CSSProperties } from "react";
import { useReveal } from "@/hooks/useReveal";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  /** stagger children by this many ms via [data-stagger] children */
  stagger?: number;
  variant?: "up" | "fade" | "left" | "right" | "scale";
  style?: CSSProperties;
};

export function Reveal({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
  stagger,
  variant = "up",
  style,
}: RevealProps) {
  const { ref, shown } = useReveal<HTMLElement>();

  return (
    <Tag
      ref={ref as never}
      data-reveal={shown ? "in" : "out"}
      data-reveal-variant={variant}
      style={{
        ...style,
        ...(delay ? { transitionDelay: `${delay}ms`, animationDelay: `${delay}ms` } : null),
        ...(stagger ? ({ ["--reveal-stagger" as never]: `${stagger}ms` } as CSSProperties) : null),
      }}
      className={className}
    >
      {children}
    </Tag>
  );
}
