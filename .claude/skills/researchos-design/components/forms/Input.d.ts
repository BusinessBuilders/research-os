import * as React from "react";

/**
 * Single-line form field on the navy canvas.
 * @startingPoint section="ResearchOS" subtitle="Form fields — input, textarea, checkbox" viewport="700x260"
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Render in the monospace family (part numbers, prices, slugs). */
  mono?: boolean;
}

export declare function Input(props: InputProps): JSX.Element;
