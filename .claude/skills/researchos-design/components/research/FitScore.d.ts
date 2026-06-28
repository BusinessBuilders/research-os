import * as React from "react";

export type FitLevel = "strong" | "partial" | "poor";

/**
 * Product↔need fit indicator. strong=green, partial=amber, poor=red.
 * @startingPoint section="ResearchOS" subtitle="Domain primitives — fit, priority, status, budget" viewport="700x200"
 */
export interface FitScoreProps extends React.HTMLAttributes<HTMLSpanElement> {
  score?: FitLevel;
  showLabel?: boolean;
  /** Override the default label text. */
  label?: string;
}

export declare function FitScore(props: FitScoreProps): JSX.Element;
