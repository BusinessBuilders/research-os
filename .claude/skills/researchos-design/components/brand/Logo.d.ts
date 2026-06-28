import * as React from "react";

/**
 * ResearchOS logo lockup (mark + wordmark). Mark is inline SVG so it
 * carries no asset-path dependency.
 * @startingPoint section="ResearchOS" subtitle="Logo — mark, wordmark, lockup" viewport="700x200"
 */
export interface LogoProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "full" | "mark" | "wordmark";
  /** Mark height in px; wordmark scales from it. */
  size?: number;
  showTagline?: boolean;
}

export declare function Logo(props: LogoProps): JSX.Element;
