import * as React from "react";

/** Cash-position pill shown on New Research and in session summaries. */
export interface BudgetPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Numeric amount (formatted with thousands separators) or pre-formatted string. */
  amount: number | string;
  currency?: string;
  /** Trailing word, e.g. "available". */
  label?: string;
}

export declare function BudgetPill(props: BudgetPillProps): JSX.Element;
