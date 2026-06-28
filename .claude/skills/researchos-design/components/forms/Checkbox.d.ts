import * as React from "react";

/** Selection checkbox (gap-analysis needs, product comparison). */
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  checked?: boolean;
  /** Called with the next checked state. */
  onCheckedChange?: (checked: boolean) => void;
}

export declare function Checkbox(props: CheckboxProps): JSX.Element;
