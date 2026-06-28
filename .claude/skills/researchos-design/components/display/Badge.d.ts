import * as React from "react";

export type BadgeVariant =
  | "neutral" | "primary" | "outline"
  | "success" | "warning" | "danger" | "info" | "brand";

/**
 * Compact status / category pill.
 * @startingPoint section="ResearchOS" subtitle="Badges — status, fit & priority pills" viewport="700x180"
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  /** Uppercase monospace label (status codes, technical tags). */
  mono?: boolean;
  children?: React.ReactNode;
}

export declare function Badge(props: BadgeProps): JSX.Element;
