/* ResearchOS UI kit — primitives, icons, and fake data.
   Self-contained (no _ds_bundle dependency): thin wrappers over the
   .ros-* classes in styles.css. Exposed on window.ROS for the screens. */

const { useState, useEffect, useRef, useCallback } = React;

/* ---------- Icon (Lucide) ---------- */
function Icon({ name, size = 16, className = "", style = {} }) {
  const ref = useRef(null);
  useEffect(() => {
    const host = ref.current;
    if (host && window.lucide) {
      host.innerHTML = `<i data-lucide="${name}"></i>`;
      window.lucide.createIcons({
        attrs: { width: size, height: size, "stroke-width": 1.5 },
        nameAttr: "data-lucide",
      });
    }
  }, [name, size]);
  return <span ref={ref} className={className} style={{ display: "inline-flex", alignItems: "center", ...style }} />;
}

/* ---------- Primitives (mirror the DS components) ---------- */
function Button({ variant = "primary", size = "md", className = "", children, ...p }) {
  const c = ["ros-btn", `ros-btn--${variant}`, size === "sm" && "ros-btn--sm",
    size === "lg" && "ros-btn--lg", size === "icon" && "ros-btn--icon", className]
    .filter(Boolean).join(" ");
  return <button className={c} {...p}>{children}</button>;
}

function Badge({ variant = "neutral", mono = false, className = "", children, ...p }) {
  const c = ["ros-badge", `ros-badge--${variant}`, mono && "ros-badge--mono", className]
    .filter(Boolean).join(" ");
  return <span className={c} {...p}>{children}</span>;
}

function Card({ interactive, pad, padSm, className = "", children, ...p }) {
  const c = ["ros-card", interactive && "ros-card--interactive", pad && "ros-card--pad",
    padSm && "ros-card--pad-sm", className].filter(Boolean).join(" ");
  return <div className={c} {...p}>{children}</div>;
}
const CardHeader = ({ className = "", children, ...p }) => <div className={["ros-card__header", className].filter(Boolean).join(" ")} {...p}>{children}</div>;
const CardTitle = ({ className = "", children, ...p }) => <div className={["ros-card__title", className].filter(Boolean).join(" ")} {...p}>{children}</div>;
const CardDescription = ({ className = "", children, ...p }) => <div className={["ros-card__desc", className].filter(Boolean).join(" ")} {...p}>{children}</div>;
const CardContent = ({ className = "", children, ...p }) => <div className={["ros-card__content", className].filter(Boolean).join(" ")} {...p}>{children}</div>;
const CardFooter = ({ className = "", children, ...p }) => <div className={["ros-card__footer", className].filter(Boolean).join(" ")} {...p}>{children}</div>;

function Input({ mono, className = "", ...p }) {
  return <input className={["ros-field", mono && "ros-field--mono", className].filter(Boolean).join(" ")} {...p} />;
}
function Textarea({ className = "", ...p }) {
  return <textarea className={["ros-field", className].filter(Boolean).join(" ")} {...p} />;
}
function Checkbox({ checked, onCheckedChange, className = "", ...p }) {
  return <input type="checkbox" className={["ros-check", className].filter(Boolean).join(" ")}
    checked={checked} onChange={(e) => onCheckedChange && onCheckedChange(e.target.checked)} {...p} />;
}
function Separator({ orientation = "horizontal", className = "" }) {
  return <div className={["ros-sep", orientation === "vertical" ? "ros-sep--v" : "ros-sep--h", className].filter(Boolean).join(" ")} />;
}

/* ---------- Domain ---------- */
const FIT_LABEL = { strong: "Strong fit", partial: "Partial fit", poor: "Poor fit" };
function FitScore({ score = "strong", showLabel = true }) {
  return (
    <span className="ros-fit">
      <span className={`ros-fit__dot ros-fit__dot--${score}`} />
      {showLabel && <span className="ros-fit__label">{FIT_LABEL[score]}</span>}
    </span>
  );
}
const PRIO = { critical: ["danger", "critical"], important: ["info", "important"], "nice-to-have": ["neutral", "nice-to-have"] };
function PriorityBadge({ priority = "important" }) {
  const [v, l] = PRIO[priority] || PRIO.important;
  return <Badge variant={v}>{l}</Badge>;
}
const STAT = {
  created: ["neutral", "created"], analyzing: ["info", "analyzing"], researching: ["info", "researching"],
  complete: ["success", "complete"], decided: ["brand", "decided"], failed: ["danger", "failed"],
};
function StatusBadge({ status = "created" }) {
  const [v, l] = STAT[status] || STAT.created;
  return <Badge variant={v} mono>{l}</Badge>;
}
function BudgetPill({ amount, currency = "$", label = "available" }) {
  const f = typeof amount === "number" ? amount.toLocaleString("en-US") : amount;
  return <span className="ros-budget"><span className="ros-budget__dot" />{currency}{f} {label}</span>;
}

function Logo({ variant = "full", size = 26, showTagline, withWordmark = true }) {
  const gid = "rosKitGrad";
  const showMark = variant !== "wordmark";
  const showWord = variant !== "mark" && withWordmark;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: size * 0.34 }}>
      {showMark && (
      <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden="true" style={{ display: "block" }}>
        <defs>
          <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fc4c02" /><stop offset="50%" stopColor="#ef2cc1" /><stop offset="100%" stopColor="#bdbbff" />
          </linearGradient>
        </defs>
        <g transform="translate(64,62)">
          <circle cx="-12" cy="-12" r="40" fill="none" stroke={`url(#${gid})`} strokeWidth="3" />
          <line x1="16" y1="16" x2="42" y2="42" stroke={`url(#${gid})`} strokeWidth="3" strokeLinecap="round" />
          <circle cx="-24" cy="-20" r="3" fill="#fc4c02" opacity="0.9" />
          <circle cx="-4" cy="-28" r="2.5" fill="#ef2cc1" opacity="0.9" />
          <circle cx="-18" cy="-4" r="2" fill="#bdbbff" opacity="0.9" />
        </g>
      </svg>
      )}
      {showWord && (
        <span style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: size * 0.62, letterSpacing: "-0.02em", color: "var(--text)" }}>
            Research<span className="ros-gradient-text">OS</span>
          </span>
          {showTagline && <span style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", fontSize: size * 0.3, letterSpacing: "0.22em", color: "var(--text-muted)", marginTop: 4 }}>AI Procurement Advisor</span>}
        </span>
      )}
    </span>
  );
}

/* ---------- PriceBars (Recharts stand-in — CSS horizontal bars) ---------- */
function PriceBars({ products }) {
  const priced = products.filter((p) => p.price != null);
  if (!priced.length) return null;
  const max = Math.max(...priced.map((p) => p.price));
  return (
    <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
      {priced.map((p) => (
        <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ width: 150, flexShrink: 0, fontSize: 12, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
          <div style={{ flex: 1, height: 18, background: "var(--surface-soft)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ width: `${Math.max(6, (p.price / max) * 100)}%`, height: "100%", background: "var(--info)", borderRadius: "0 4px 4px 0" }} />
          </div>
          <span className="ros-mono" style={{ width: 64, textAlign: "right", fontSize: 12, color: "var(--text-secondary)" }}>${p.price.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}

window.ROSKit = { Icon, Button, Badge, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
  Input, Textarea, Checkbox, Separator,
  FitScore, PriorityBadge, StatusBadge, BudgetPill, Logo, PriceBars,
  useState, useEffect, useRef, useCallback };
