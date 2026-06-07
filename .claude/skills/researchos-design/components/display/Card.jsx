import React from "react";

/** Card surface (navy, hairline ring). Set `interactive` for hover lift, `pad`/`padSm` for built-in padding. */
export function Card({ interactive = false, pad = false, padSm = false, className = "", children, ...props }) {
  const classes = [
    "ros-card",
    interactive ? "ros-card--interactive" : "",
    pad ? "ros-card--pad" : "",
    padSm ? "ros-card--pad-sm" : "",
    className,
  ].filter(Boolean).join(" ");
  return <div className={classes} {...props}>{children}</div>;
}

export function CardHeader({ className = "", children, ...props }) {
  return <div className={["ros-card__header", className].filter(Boolean).join(" ")} {...props}>{children}</div>;
}
export function CardTitle({ className = "", children, ...props }) {
  return <div className={["ros-card__title", className].filter(Boolean).join(" ")} {...props}>{children}</div>;
}
export function CardDescription({ className = "", children, ...props }) {
  return <div className={["ros-card__desc", className].filter(Boolean).join(" ")} {...props}>{children}</div>;
}
export function CardContent({ className = "", children, ...props }) {
  return <div className={["ros-card__content", className].filter(Boolean).join(" ")} {...props}>{children}</div>;
}
export function CardFooter({ className = "", children, ...props }) {
  return <div className={["ros-card__footer", className].filter(Boolean).join(" ")} {...props}>{children}</div>;
}
