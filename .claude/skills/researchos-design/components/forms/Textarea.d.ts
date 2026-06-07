import * as React from "react";

/** Multi-line text field (research goal, decision rationale). */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  rows?: number;
}

export declare function Textarea(props: TextareaProps): JSX.Element;
