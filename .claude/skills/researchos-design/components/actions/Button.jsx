import React from "react";

/**
 * ResearchOS Button. Class-based variants resolve against the
 * design-system tokens in styles.css.
 *
 * variant: primary | brand | accent | secondary | outline | ghost | destructive | link
 * size:    sm | md | lg | icon
 */
export function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  type = "button",
  className = "",
  children,
  ...props
}) {
  const classes = [
    "ros-btn",
    `ros-btn--${variant}`,
    size === "sm" ? "ros-btn--sm" : "",
    size === "lg" ? "ros-btn--lg" : "",
    size === "icon" ? "ros-btn--icon" : "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <button type={type} className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
