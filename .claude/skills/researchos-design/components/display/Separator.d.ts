import * as React from "react";

/** 1px hairline divider. */
export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

export declare function Separator(props: SeparatorProps): JSX.Element;
