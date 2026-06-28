import * as React from "react";

export type ButtonVariant =
  | "primary"
  | "brand"
  | "accent"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "link";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

/**
 * Primary interactive control across ResearchOS.
 * @startingPoint section="ResearchOS" subtitle="Button — every variant & size" viewport="700x200"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. `primary` (near-white pill) is the default app action; `brand` is the gradient hero CTA. */
  variant?: ButtonVariant;
  /** Control height. `icon` is a 36px square. */
  size?: ButtonSize;
  children?: React.ReactNode;
}

export declare function Button(props: ButtonProps): JSX.Element;
