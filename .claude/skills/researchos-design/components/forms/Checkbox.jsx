import React from "react";

/** Checkbox — periwinkle when checked. Use for need / product selection. */
export function Checkbox({ checked, onCheckedChange, className = "", ...props }) {
  const classes = ["ros-check", className].filter(Boolean).join(" ");
  return (
    <input
      type="checkbox"
      className={classes}
      checked={checked}
      onChange={(e) => onCheckedChange && onCheckedChange(e.target.checked)}
      {...props}
    />
  );
}
