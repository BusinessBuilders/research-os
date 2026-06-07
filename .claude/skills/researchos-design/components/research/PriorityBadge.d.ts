import * as React from "react";

export type Priority = "critical" | "important" | "nice-to-have";

/** Need priority pill. critical=red, important=blue, nice-to-have=neutral. */
export interface PriorityBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  priority?: Priority;
}

export declare function PriorityBadge(props: PriorityBadgeProps): JSX.Element;
