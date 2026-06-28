import React from "react";

/** Single-line text input. Pass `mono` for part numbers / numeric fields. */
export function Input({ mono = false, className = "", type = "text", ...props }) {
  const classes = ["ros-field", mono ? "ros-field--mono" : "", className]
    .filter(Boolean).join(" ");
  return <input type={type} className={classes} {...props} />;
}
