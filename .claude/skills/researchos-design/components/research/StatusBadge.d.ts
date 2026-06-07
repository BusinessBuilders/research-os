import * as React from "react";

export type SessionStatus =
  | "created" | "analyzing" | "researching" | "complete" | "decided" | "failed";

/** Research-session lifecycle pill (uppercase mono by default). */
export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: SessionStatus;
  mono?: boolean;
}

export declare function StatusBadge(props: StatusBadgeProps): JSX.Element;
