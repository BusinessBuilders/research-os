import React from "react";

/** Cash-position pill, e.g. "$4,200 available". Mint, off-gradient accent. */
export function BudgetPill({ amount, currency = "$", label = "available", className = "", ...props }) {
  const formatted = typeof amount === "number"
    ? amount.toLocaleString("en-US")
    : amount;
  const classes = ["ros-budget", className].filter(Boolean).join(" ");
  return (
    <span className={classes} {...props}>
      <span className="ros-budget__dot" />
      {currency}{formatted} {label}
    </span>
  );
}
