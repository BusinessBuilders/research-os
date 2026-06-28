/* @ds-bundle: {"format":3,"namespace":"ResearchOSDesignSystem_aa62c9","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"CardHeader","sourcePath":"components/display/Card.jsx"},{"name":"CardTitle","sourcePath":"components/display/Card.jsx"},{"name":"CardDescription","sourcePath":"components/display/Card.jsx"},{"name":"CardContent","sourcePath":"components/display/Card.jsx"},{"name":"CardFooter","sourcePath":"components/display/Card.jsx"},{"name":"Separator","sourcePath":"components/display/Separator.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"BudgetPill","sourcePath":"components/research/BudgetPill.jsx"},{"name":"FitScore","sourcePath":"components/research/FitScore.jsx"},{"name":"PriorityBadge","sourcePath":"components/research/PriorityBadge.jsx"},{"name":"StatusBadge","sourcePath":"components/research/StatusBadge.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"2005a6eebc96","components/brand/Logo.jsx":"fb26213beff5","components/card-kit.js":"196ac2bba072","components/display/Badge.jsx":"0866b7c72917","components/display/Card.jsx":"90cd724b27de","components/display/Separator.jsx":"d19b7e9d9900","components/forms/Checkbox.jsx":"f95405e75d04","components/forms/Input.jsx":"bc8db1a06e25","components/forms/Textarea.jsx":"2dc6e2c4082b","components/research/BudgetPill.jsx":"6e6e2dde82e4","components/research/FitScore.jsx":"70adc424c09a","components/research/PriorityBadge.jsx":"aca3729dc6e6","components/research/StatusBadge.jsx":"bf8f535afeb6","ui_kits/research-os/app.jsx":"756b080b7d61","ui_kits/research-os/data.js":"a84b59a2908d","ui_kits/research-os/kit.jsx":"9e55de3b8f3a","ui_kits/research-os/screens.jsx":"1c9fc64e9537"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ResearchOSDesignSystem_aa62c9 = window.ResearchOSDesignSystem_aa62c9 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/actions/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * ResearchOS Button. Class-based variants resolve against the
 * design-system tokens in styles.css.
 *
 * variant: primary | brand | accent | secondary | outline | ghost | destructive | link
 * size:    sm | md | lg | icon
 */
function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  type = "button",
  className = "",
  children,
  ...props
}) {
  const classes = ["ros-btn", `ros-btn--${variant}`, size === "sm" ? "ros-btn--sm" : "", size === "lg" ? "ros-btn--lg" : "", size === "icon" ? "ros-btn--icon" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    className: classes,
    disabled: disabled
  }, props), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Button.jsx", error: String((e && e.message) || e) }); }

// components/brand/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
let _uid = 0;

/**
 * ResearchOS lockup. variant: "full" (mark + wordmark) | "mark" | "wordmark".
 * size is the mark height in px; wordmark scales with it.
 */
function Logo({
  variant = "full",
  size = 28,
  showTagline = false,
  className = "",
  ...props
}) {
  const gid = `rosGrad${_uid++}`;
  const mark = /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 120 120",
    "aria-hidden": "true",
    style: {
      display: "block",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: gid,
    x1: "0%",
    y1: "0%",
    x2: "100%",
    y2: "100%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#fc4c02"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "50%",
    stopColor: "#ef2cc1"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#bdbbff"
  }))), /*#__PURE__*/React.createElement("g", {
    transform: "translate(64,62)"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "-12",
    cy: "-12",
    r: "40",
    fill: "none",
    stroke: `url(#${gid})`,
    strokeWidth: "3"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "16",
    y1: "16",
    x2: "42",
    y2: "42",
    stroke: `url(#${gid})`,
    strokeWidth: "3",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "-24",
    cy: "-20",
    r: "3",
    fill: "#fc4c02",
    opacity: "0.9"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "-4",
    cy: "-28",
    r: "2.5",
    fill: "#ef2cc1",
    opacity: "0.9"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "-18",
    cy: "-4",
    r: "2",
    fill: "#bdbbff",
    opacity: "0.9"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "-24",
    y1: "-20",
    x2: "-4",
    y2: "-28",
    stroke: "#fff",
    strokeWidth: "0.5",
    opacity: "0.3"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "-4",
    y1: "-28",
    x2: "-18",
    y2: "-4",
    stroke: "#fff",
    strokeWidth: "0.5",
    opacity: "0.3"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "-18",
    y1: "-4",
    x2: "-24",
    y2: "-20",
    stroke: "#fff",
    strokeWidth: "0.5",
    opacity: "0.3"
  })));
  if (variant === "mark") {
    return /*#__PURE__*/React.createElement("span", _extends({
      className: className
    }, props), mark);
  }
  const wordSize = size * 0.62;
  const wordmark = /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      flexDirection: "column",
      lineHeight: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: 600,
      fontSize: wordSize,
      letterSpacing: "-0.02em",
      color: "var(--text)"
    }
  }, "Research", /*#__PURE__*/React.createElement("span", {
    className: "ros-gradient-text"
  }, "OS")), showTagline && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      textTransform: "uppercase",
      fontSize: wordSize * 0.34,
      letterSpacing: "0.22em",
      color: "var(--text-muted)",
      marginTop: 4
    }
  }, "AI Procurement Advisor"));
  if (variant === "wordmark") {
    return /*#__PURE__*/React.createElement("span", _extends({
      className: className
    }, props), wordmark);
  }
  return /*#__PURE__*/React.createElement("span", _extends({
    className: className,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: size * 0.34
    }
  }, props), mark, wordmark);
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/card-kit.js
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* ResearchOS UI kit — primitives, icons, and fake data.
   Self-contained (no _ds_bundle dependency): thin wrappers over the
   .ros-* classes in styles.css. Exposed on window.ROS for the screens. */

const {
  useState,
  useEffect,
  useRef,
  useCallback
} = React;

/* ---------- Icon (Lucide) ---------- */
function Icon({
  name,
  size = 16,
  className = "",
  style = {}
}) {
  const ref = useRef(null);
  useEffect(() => {
    const host = ref.current;
    if (host && window.lucide) {
      host.innerHTML = `<i data-lucide="${name}"></i>`;
      window.lucide.createIcons({
        attrs: {
          width: size,
          height: size,
          "stroke-width": 1.5
        },
        nameAttr: "data-lucide"
      });
    }
  }, [name, size]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    className: className,
    style: {
      display: "inline-flex",
      alignItems: "center",
      ...style
    }
  });
}

/* ---------- Primitives (mirror the DS components) ---------- */
function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...p
}) {
  const c = ["ros-btn", `ros-btn--${variant}`, size === "sm" && "ros-btn--sm", size === "lg" && "ros-btn--lg", size === "icon" && "ros-btn--icon", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("button", _extends({
    className: c
  }, p), children);
}
function Badge({
  variant = "neutral",
  mono = false,
  className = "",
  children,
  ...p
}) {
  const c = ["ros-badge", `ros-badge--${variant}`, mono && "ros-badge--mono", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("span", _extends({
    className: c
  }, p), children);
}
function Card({
  interactive,
  pad,
  padSm,
  className = "",
  children,
  ...p
}) {
  const c = ["ros-card", interactive && "ros-card--interactive", pad && "ros-card--pad", padSm && "ros-card--pad-sm", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("div", _extends({
    className: c
  }, p), children);
}
const CardHeader = ({
  className = "",
  children,
  ...p
}) => /*#__PURE__*/React.createElement("div", _extends({
  className: ["ros-card__header", className].filter(Boolean).join(" ")
}, p), children);
const CardTitle = ({
  className = "",
  children,
  ...p
}) => /*#__PURE__*/React.createElement("div", _extends({
  className: ["ros-card__title", className].filter(Boolean).join(" ")
}, p), children);
const CardDescription = ({
  className = "",
  children,
  ...p
}) => /*#__PURE__*/React.createElement("div", _extends({
  className: ["ros-card__desc", className].filter(Boolean).join(" ")
}, p), children);
const CardContent = ({
  className = "",
  children,
  ...p
}) => /*#__PURE__*/React.createElement("div", _extends({
  className: ["ros-card__content", className].filter(Boolean).join(" ")
}, p), children);
const CardFooter = ({
  className = "",
  children,
  ...p
}) => /*#__PURE__*/React.createElement("div", _extends({
  className: ["ros-card__footer", className].filter(Boolean).join(" ")
}, p), children);
function Input({
  mono,
  className = "",
  ...p
}) {
  return /*#__PURE__*/React.createElement("input", _extends({
    className: ["ros-field", mono && "ros-field--mono", className].filter(Boolean).join(" ")
  }, p));
}
function Textarea({
  className = "",
  ...p
}) {
  return /*#__PURE__*/React.createElement("textarea", _extends({
    className: ["ros-field", className].filter(Boolean).join(" ")
  }, p));
}
function Checkbox({
  checked,
  onCheckedChange,
  className = "",
  ...p
}) {
  return /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    className: ["ros-check", className].filter(Boolean).join(" "),
    checked: checked,
    onChange: e => onCheckedChange && onCheckedChange(e.target.checked)
  }, p));
}
function Separator({
  orientation = "horizontal",
  className = ""
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: ["ros-sep", orientation === "vertical" ? "ros-sep--v" : "ros-sep--h", className].filter(Boolean).join(" ")
  });
}

/* ---------- Domain ---------- */
const FIT_LABEL = {
  strong: "Strong fit",
  partial: "Partial fit",
  poor: "Poor fit"
};
function FitScore({
  score = "strong",
  showLabel = true
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "ros-fit"
  }, /*#__PURE__*/React.createElement("span", {
    className: `ros-fit__dot ros-fit__dot--${score}`
  }), showLabel && /*#__PURE__*/React.createElement("span", {
    className: "ros-fit__label"
  }, FIT_LABEL[score]));
}
const PRIO = {
  critical: ["danger", "critical"],
  important: ["info", "important"],
  "nice-to-have": ["neutral", "nice-to-have"]
};
function PriorityBadge({
  priority = "important"
}) {
  const [v, l] = PRIO[priority] || PRIO.important;
  return /*#__PURE__*/React.createElement(Badge, {
    variant: v
  }, l);
}
const STAT = {
  created: ["neutral", "created"],
  analyzing: ["info", "analyzing"],
  researching: ["info", "researching"],
  complete: ["success", "complete"],
  decided: ["brand", "decided"],
  failed: ["danger", "failed"]
};
function StatusBadge({
  status = "created"
}) {
  const [v, l] = STAT[status] || STAT.created;
  return /*#__PURE__*/React.createElement(Badge, {
    variant: v,
    mono: true
  }, l);
}
function BudgetPill({
  amount,
  currency = "$",
  label = "available"
}) {
  const f = typeof amount === "number" ? amount.toLocaleString("en-US") : amount;
  return /*#__PURE__*/React.createElement("span", {
    className: "ros-budget"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ros-budget__dot"
  }), currency, f, " ", label);
}
function Logo({
  variant = "full",
  size = 26,
  showTagline,
  withWordmark = true
}) {
  const gid = "rosKitGrad";
  const showMark = variant !== "wordmark";
  const showWord = variant !== "mark" && withWordmark;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: size * 0.34
    }
  }, showMark && /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 120 120",
    "aria-hidden": "true",
    style: {
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: gid,
    x1: "0%",
    y1: "0%",
    x2: "100%",
    y2: "100%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#fc4c02"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "50%",
    stopColor: "#ef2cc1"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#bdbbff"
  }))), /*#__PURE__*/React.createElement("g", {
    transform: "translate(64,62)"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "-12",
    cy: "-12",
    r: "40",
    fill: "none",
    stroke: `url(#${gid})`,
    strokeWidth: "3"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "16",
    y1: "16",
    x2: "42",
    y2: "42",
    stroke: `url(#${gid})`,
    strokeWidth: "3",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "-24",
    cy: "-20",
    r: "3",
    fill: "#fc4c02",
    opacity: "0.9"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "-4",
    cy: "-28",
    r: "2.5",
    fill: "#ef2cc1",
    opacity: "0.9"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "-18",
    cy: "-4",
    r: "2",
    fill: "#bdbbff",
    opacity: "0.9"
  }))), showWord && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      flexDirection: "column",
      lineHeight: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: 600,
      fontSize: size * 0.62,
      letterSpacing: "-0.02em",
      color: "var(--text)"
    }
  }, "Research", /*#__PURE__*/React.createElement("span", {
    className: "ros-gradient-text"
  }, "OS")), showTagline && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      textTransform: "uppercase",
      fontSize: size * 0.3,
      letterSpacing: "0.22em",
      color: "var(--text-muted)",
      marginTop: 4
    }
  }, "AI Procurement Advisor")));
}

/* ---------- PriceBars (Recharts stand-in — CSS horizontal bars) ---------- */
function PriceBars({
  products
}) {
  const priced = products.filter(p => p.price != null);
  if (!priced.length) return null;
  const max = Math.max(...priced.map(p => p.price));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, priced.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.id,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 150,
      flexShrink: 0,
      fontSize: 12,
      color: "var(--text-muted)",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, p.name), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 18,
      background: "var(--surface-soft)",
      borderRadius: 4,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${Math.max(6, p.price / max * 100)}%`,
      height: "100%",
      background: "var(--info)",
      borderRadius: "0 4px 4px 0"
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "ros-mono",
    style: {
      width: 64,
      textAlign: "right",
      fontSize: 12,
      color: "var(--text-secondary)"
    }
  }, "$", p.price.toFixed(2)))));
}
window.ROSKit = {
  Icon,
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Textarea,
  Checkbox,
  Separator,
  FitScore,
  PriorityBadge,
  StatusBadge,
  BudgetPill,
  Logo,
  PriceBars,
  useState,
  useEffect,
  useRef,
  useCallback
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/card-kit.js", error: String((e && e.message) || e) }); }

// components/display/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Badge / pill. variant: neutral | primary | outline | success | warning |
 * danger | info | brand. Set `mono` for uppercase technical labels.
 */
function Badge({
  variant = "neutral",
  mono = false,
  className = "",
  children,
  ...props
}) {
  const classes = ["ros-badge", `ros-badge--${variant}`, mono ? "ros-badge--mono" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("span", _extends({
    className: classes
  }, props), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Card surface (navy, hairline ring). Set `interactive` for hover lift, `pad`/`padSm` for built-in padding. */
function Card({
  interactive = false,
  pad = false,
  padSm = false,
  className = "",
  children,
  ...props
}) {
  const classes = ["ros-card", interactive ? "ros-card--interactive" : "", pad ? "ros-card--pad" : "", padSm ? "ros-card--pad-sm" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("div", _extends({
    className: classes
  }, props), children);
}
function CardHeader({
  className = "",
  children,
  ...props
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ["ros-card__header", className].filter(Boolean).join(" ")
  }, props), children);
}
function CardTitle({
  className = "",
  children,
  ...props
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ["ros-card__title", className].filter(Boolean).join(" ")
  }, props), children);
}
function CardDescription({
  className = "",
  children,
  ...props
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ["ros-card__desc", className].filter(Boolean).join(" ")
  }, props), children);
}
function CardContent({
  className = "",
  children,
  ...props
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ["ros-card__content", className].filter(Boolean).join(" ")
  }, props), children);
}
function CardFooter({
  className = "",
  children,
  ...props
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ["ros-card__footer", className].filter(Boolean).join(" ")
  }, props), children);
}
Object.assign(__ds_scope, { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/Separator.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Hairline divider. orientation: horizontal | vertical. */
function Separator({
  orientation = "horizontal",
  className = "",
  ...props
}) {
  const classes = ["ros-sep", orientation === "vertical" ? "ros-sep--v" : "ros-sep--h", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "separator",
    "aria-orientation": orientation,
    className: classes
  }, props));
}
Object.assign(__ds_scope, { Separator });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Separator.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Checkbox — periwinkle when checked. Use for need / product selection. */
function Checkbox({
  checked,
  onCheckedChange,
  className = "",
  ...props
}) {
  const classes = ["ros-check", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    className: classes,
    checked: checked,
    onChange: e => onCheckedChange && onCheckedChange(e.target.checked)
  }, props));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Single-line text input. Pass `mono` for part numbers / numeric fields. */
function Input({
  mono = false,
  className = "",
  type = "text",
  ...props
}) {
  const classes = ["ros-field", mono ? "ros-field--mono" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("input", _extends({
    type: type,
    className: classes
  }, props));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Multi-line text field. Used for research goals and decision rationale. */
function Textarea({
  rows = 3,
  className = "",
  ...props
}) {
  const classes = ["ros-field", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("textarea", _extends({
    rows: rows,
    className: classes
  }, props));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/research/BudgetPill.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Cash-position pill, e.g. "$4,200 available". Mint, off-gradient accent. */
function BudgetPill({
  amount,
  currency = "$",
  label = "available",
  className = "",
  ...props
}) {
  const formatted = typeof amount === "number" ? amount.toLocaleString("en-US") : amount;
  const classes = ["ros-budget", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("span", _extends({
    className: classes
  }, props), /*#__PURE__*/React.createElement("span", {
    className: "ros-budget__dot"
  }), currency, formatted, " ", label);
}
Object.assign(__ds_scope, { BudgetPill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/research/BudgetPill.jsx", error: String((e && e.message) || e) }); }

// components/research/FitScore.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const LABELS = {
  strong: "Strong fit",
  partial: "Partial fit",
  poor: "Poor fit"
};

/** Product fit indicator — glowing dot + optional label. score: strong | partial | poor. */
function FitScore({
  score = "strong",
  showLabel = true,
  label,
  className = "",
  ...props
}) {
  const classes = ["ros-fit", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("span", _extends({
    className: classes
  }, props), /*#__PURE__*/React.createElement("span", {
    className: `ros-fit__dot ros-fit__dot--${score}`
  }), showLabel && /*#__PURE__*/React.createElement("span", {
    className: "ros-fit__label"
  }, label || LABELS[score]));
}
Object.assign(__ds_scope, { FitScore });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/research/FitScore.jsx", error: String((e && e.message) || e) }); }

// components/research/PriorityBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const MAP = {
  critical: {
    variant: "danger",
    label: "critical"
  },
  important: {
    variant: "info",
    label: "important"
  },
  "nice-to-have": {
    variant: "neutral",
    label: "nice-to-have"
  }
};

/** Need priority pill. priority: critical | important | nice-to-have. */
function PriorityBadge({
  priority = "important",
  ...props
}) {
  const m = MAP[priority] || MAP.important;
  return /*#__PURE__*/React.createElement(__ds_scope.Badge, _extends({
    variant: m.variant
  }, props), m.label);
}
Object.assign(__ds_scope, { PriorityBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/research/PriorityBadge.jsx", error: String((e && e.message) || e) }); }

// components/research/StatusBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const MAP = {
  created: {
    variant: "neutral",
    label: "created"
  },
  analyzing: {
    variant: "info",
    label: "analyzing"
  },
  researching: {
    variant: "info",
    label: "researching"
  },
  complete: {
    variant: "success",
    label: "complete"
  },
  decided: {
    variant: "brand",
    label: "decided"
  },
  failed: {
    variant: "danger",
    label: "failed"
  }
};

/** Research-session status pill. */
function StatusBadge({
  status = "created",
  mono = true,
  ...props
}) {
  const m = MAP[status] || MAP.created;
  return /*#__PURE__*/React.createElement(__ds_scope.Badge, _extends({
    variant: m.variant,
    mono: mono
  }, props), m.label);
}
Object.assign(__ds_scope, { StatusBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/research/StatusBadge.jsx", error: String((e && e.message) || e) }); }

// ui_kits/research-os/app.jsx
try { (() => {
/* ResearchOS UI kit — router + mount. */

(function () {
  const {
    useState
  } = window.ROS;
  const S = window.ROSScreens;
  function App() {
    const [route, setRoute] = useState("dashboard");
    const [empty, setEmpty] = useState(false);
    const [goal, setGoal] = useState("upgrade my robotics fab setup to build tendon-driven actuators");
    const [budget, setBudget] = useState("4200");
    const [selectedNeeds, setSelectedNeeds] = useState(new Set(["n1", "n2", "n3"]));
    const [selectedProducts, setSelectedProducts] = useState(new Set(["p1", "p4", "p6"]));
    const nav = r => {
      setRoute(r);
      window.scrollTo({
        top: 0,
        behavior: "instant" in window ? "instant" : "auto"
      });
    };
    let screen;
    switch (route) {
      case "new":
        screen = /*#__PURE__*/React.createElement(S.NewResearchScreen, {
          nav: nav,
          goal: goal,
          setGoal: setGoal,
          budget: budget,
          setBudget: setBudget
        });
        break;
      case "detail":
        screen = /*#__PURE__*/React.createElement(S.SessionDetailScreen, {
          nav: nav
        });
        break;
      case "gaps":
        screen = /*#__PURE__*/React.createElement(S.GapsScreen, {
          nav: nav,
          selectedNeeds: selectedNeeds,
          setSelectedNeeds: setSelectedNeeds
        });
        break;
      case "results":
        screen = /*#__PURE__*/React.createElement(S.ResultsScreen, {
          nav: nav,
          selectedNeeds: selectedNeeds,
          selectedProducts: selectedProducts,
          setSelectedProducts: setSelectedProducts
        });
        break;
      case "decision":
        screen = /*#__PURE__*/React.createElement(S.DecisionScreen, {
          nav: nav,
          selectedProducts: selectedProducts
        });
        break;
      default:
        screen = /*#__PURE__*/React.createElement(S.DashboardScreen, {
          nav: nav,
          empty: empty,
          setEmpty: setEmpty
        });
    }
    return /*#__PURE__*/React.createElement(S.AppShell, {
      route: route,
      nav: nav
    }, screen);
  }
  ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/research-os/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/research-os/data.js
try { (() => {
/* ResearchOS UI kit — fake data fixtures. window.ROSData */

window.ROSData = {
  emptyDashboard: false,
  sessions: [{
    id: "s1",
    goal: "Upgrade robotics fab to build tendon-driven actuators",
    created_at: "2026-06-06",
    mode: "goal-driven",
    budget: 4200,
    status: "researching",
    needs: 4
  }, {
    id: "s2",
    goal: "Source a benchtop reflow oven for small-run PCBA",
    created_at: "2026-06-04",
    mode: "product-research",
    budget: 1500,
    status: "decided",
    needs: 3
  }, {
    id: "s3",
    goal: "Find the JST connector crimp tool that fits SH 1.0mm",
    created_at: "2026-06-03",
    mode: "direct-lookup",
    budget: null,
    status: "complete",
    needs: 1
  }, {
    id: "s4",
    goal: "Spec a 5-axis CNC for aluminium fixture plates",
    created_at: "2026-05-30",
    mode: "goal-driven",
    budget: 38000,
    status: "failed",
    needs: 5
  }],
  /* Detail for the active session s1 */
  needs: [{
    id: "n1",
    description: "High-torque servo motor (≥3 N·m, position feedback)",
    rationale: "Tendon actuation needs stall torque headroom and absolute encoders for closed-loop control.",
    priority: "critical",
    estimated_cost_range: "$180 – $320 / unit",
    selected: true
  }, {
    id: "n2",
    description: "Spectra / Dyneema tendon line (1.0–1.5mm)",
    rationale: "Low-stretch, high-tensile line transmits force from the motor to the joint.",
    priority: "important",
    estimated_cost_range: "$25 – $60 / spool",
    selected: true
  }, {
    id: "n3",
    description: "Low-friction PTFE tendon sheath + routing pulleys",
    rationale: "Keeps routing losses down so motor torque reaches the fingertip.",
    priority: "important",
    estimated_cost_range: "$40 – $90",
    selected: true
  }, {
    id: "n4",
    description: "Bench power supply (24V, ≥10A, current limit)",
    rationale: "Drives the servo bus during bring-up with over-current protection.",
    priority: "nice-to-have",
    estimated_cost_range: "$70 – $160",
    selected: false
  }],
  /* Products keyed by need id */
  products: {
    n1: [{
      id: "p1",
      name: "Dynamixel XM430-W350-T",
      price: 269.90,
      source_name: "ROBOTIS",
      fit_score: "strong",
      fit_rationale: "3.7 N·m stall, 12-bit absolute encoder, TTL bus — ideal for closed-loop tendon drive.",
      risks: ["lead time 2–3 wk"]
    }, {
      id: "p2",
      name: "Feetech STS3250 Serial Bus Servo",
      price: 39.50,
      source_name: "Alibaba",
      fit_score: "partial",
      fit_rationale: "Cheap and 35 kg·cm, but 1024-step encoder limits fine position control.",
      risks: ["no datasheet", "QC variance"]
    }, {
      id: "p3",
      name: "Generic MG996R",
      price: 4.20,
      source_name: "AliExpress",
      fit_score: "poor",
      fit_rationale: "Hobby servo — no feedback, plastic gears strip under tendon load.",
      risks: ["no feedback", "low durability"]
    }],
    n2: [{
      id: "p4",
      name: "Dyneema SK99 1.2mm (50m)",
      price: 34.00,
      source_name: "Marlow",
      fit_score: "strong",
      fit_rationale: "0.3% stretch at 30% load, 240 kg break — textbook tendon line.",
      risks: []
    }, {
      id: "p5",
      name: "Generic UHMWPE braid 1.0mm",
      price: 11.90,
      source_name: "AliExpress",
      fit_score: "partial",
      fit_rationale: "Works but stretch spec unverified across batches.",
      risks: ["spec unverified"]
    }],
    n3: [{
      id: "p6",
      name: "igus PTFE liner + 8mm pulley kit",
      price: 58.00,
      source_name: "igus",
      fit_score: "strong",
      fit_rationale: "Matched liner/pulley radii minimise capstan losses.",
      risks: []
    }, {
      id: "p7",
      name: "Bowden PTFE tubing (5m)",
      price: 9.50,
      source_name: "McMaster-Carr",
      fit_score: "partial",
      fit_rationale: "Liner only — you'll source pulleys separately.",
      risks: ["pulleys not included"]
    }]
  },
  pipeline: [{
    id: "analyzing",
    label: "Analyzing needs",
    icon: "sparkles"
  }, {
    id: "searching",
    label: "Searching sources",
    icon: "search"
  }, {
    id: "scoring",
    label: "Scoring fit",
    icon: "target"
  }, {
    id: "complete",
    label: "Complete",
    icon: "circle-check"
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/research-os/data.js", error: String((e && e.message) || e) }); }

// ui_kits/research-os/kit.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* ResearchOS UI kit — primitives, icons, and fake data.
   Self-contained (no _ds_bundle dependency): thin wrappers over the
   .ros-* classes in styles.css. Exposed on window.ROS for the screens. */

const {
  useState,
  useEffect,
  useRef,
  useCallback
} = React;

/* ---------- Icon (Lucide) ---------- */
function Icon({
  name,
  size = 16,
  className = "",
  style = {}
}) {
  const ref = useRef(null);
  useEffect(() => {
    const host = ref.current;
    if (host && window.lucide) {
      host.innerHTML = `<i data-lucide="${name}"></i>`;
      window.lucide.createIcons({
        attrs: {
          width: size,
          height: size,
          "stroke-width": 1.5
        },
        nameAttr: "data-lucide"
      });
    }
  }, [name, size]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    className: className,
    style: {
      display: "inline-flex",
      alignItems: "center",
      ...style
    }
  });
}

/* ---------- Primitives (mirror the DS components) ---------- */
function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...p
}) {
  const c = ["ros-btn", `ros-btn--${variant}`, size === "sm" && "ros-btn--sm", size === "lg" && "ros-btn--lg", size === "icon" && "ros-btn--icon", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("button", _extends({
    className: c
  }, p), children);
}
function Badge({
  variant = "neutral",
  mono = false,
  className = "",
  children,
  ...p
}) {
  const c = ["ros-badge", `ros-badge--${variant}`, mono && "ros-badge--mono", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("span", _extends({
    className: c
  }, p), children);
}
function Card({
  interactive,
  pad,
  padSm,
  className = "",
  children,
  ...p
}) {
  const c = ["ros-card", interactive && "ros-card--interactive", pad && "ros-card--pad", padSm && "ros-card--pad-sm", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("div", _extends({
    className: c
  }, p), children);
}
function Input({
  mono,
  className = "",
  ...p
}) {
  return /*#__PURE__*/React.createElement("input", _extends({
    className: ["ros-field", mono && "ros-field--mono", className].filter(Boolean).join(" ")
  }, p));
}
function Textarea({
  className = "",
  ...p
}) {
  return /*#__PURE__*/React.createElement("textarea", _extends({
    className: ["ros-field", className].filter(Boolean).join(" ")
  }, p));
}
function Checkbox({
  checked,
  onCheckedChange,
  className = "",
  ...p
}) {
  return /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    className: ["ros-check", className].filter(Boolean).join(" "),
    checked: checked,
    onChange: e => onCheckedChange && onCheckedChange(e.target.checked)
  }, p));
}
function Separator({
  orientation = "horizontal",
  className = ""
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: ["ros-sep", orientation === "vertical" ? "ros-sep--v" : "ros-sep--h", className].filter(Boolean).join(" ")
  });
}

/* ---------- Domain ---------- */
const FIT_LABEL = {
  strong: "Strong fit",
  partial: "Partial fit",
  poor: "Poor fit"
};
function FitScore({
  score = "strong",
  showLabel = true
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "ros-fit"
  }, /*#__PURE__*/React.createElement("span", {
    className: `ros-fit__dot ros-fit__dot--${score}`
  }), showLabel && /*#__PURE__*/React.createElement("span", {
    className: "ros-fit__label"
  }, FIT_LABEL[score]));
}
const PRIO = {
  critical: ["danger", "critical"],
  important: ["info", "important"],
  "nice-to-have": ["neutral", "nice-to-have"]
};
function PriorityBadge({
  priority = "important"
}) {
  const [v, l] = PRIO[priority] || PRIO.important;
  return /*#__PURE__*/React.createElement(Badge, {
    variant: v
  }, l);
}
const STAT = {
  created: ["neutral", "created"],
  analyzing: ["info", "analyzing"],
  researching: ["info", "researching"],
  complete: ["success", "complete"],
  decided: ["brand", "decided"],
  failed: ["danger", "failed"]
};
function StatusBadge({
  status = "created"
}) {
  const [v, l] = STAT[status] || STAT.created;
  return /*#__PURE__*/React.createElement(Badge, {
    variant: v,
    mono: true
  }, l);
}
function BudgetPill({
  amount,
  currency = "$",
  label = "available"
}) {
  const f = typeof amount === "number" ? amount.toLocaleString("en-US") : amount;
  return /*#__PURE__*/React.createElement("span", {
    className: "ros-budget"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ros-budget__dot"
  }), currency, f, " ", label);
}
function Logo({
  size = 26,
  showTagline,
  withWordmark = true
}) {
  const gid = "rosKitGrad";
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: size * 0.34
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 120 120",
    "aria-hidden": "true",
    style: {
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: gid,
    x1: "0%",
    y1: "0%",
    x2: "100%",
    y2: "100%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#fc4c02"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "50%",
    stopColor: "#ef2cc1"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#bdbbff"
  }))), /*#__PURE__*/React.createElement("g", {
    transform: "translate(64,62)"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "-12",
    cy: "-12",
    r: "40",
    fill: "none",
    stroke: `url(#${gid})`,
    strokeWidth: "3"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "16",
    y1: "16",
    x2: "42",
    y2: "42",
    stroke: `url(#${gid})`,
    strokeWidth: "3",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "-24",
    cy: "-20",
    r: "3",
    fill: "#fc4c02",
    opacity: "0.9"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "-4",
    cy: "-28",
    r: "2.5",
    fill: "#ef2cc1",
    opacity: "0.9"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "-18",
    cy: "-4",
    r: "2",
    fill: "#bdbbff",
    opacity: "0.9"
  }))), withWordmark && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      flexDirection: "column",
      lineHeight: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: 600,
      fontSize: size * 0.62,
      letterSpacing: "-0.02em",
      color: "var(--text)"
    }
  }, "Research", /*#__PURE__*/React.createElement("span", {
    className: "ros-gradient-text"
  }, "OS")), showTagline && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      textTransform: "uppercase",
      fontSize: size * 0.3,
      letterSpacing: "0.22em",
      color: "var(--text-muted)",
      marginTop: 4
    }
  }, "AI Procurement Advisor")));
}

/* ---------- PriceBars (Recharts stand-in — CSS horizontal bars) ---------- */
function PriceBars({
  products
}) {
  const priced = products.filter(p => p.price != null);
  if (!priced.length) return null;
  const max = Math.max(...priced.map(p => p.price));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, priced.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.id,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 150,
      flexShrink: 0,
      fontSize: 12,
      color: "var(--text-muted)",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, p.name), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 18,
      background: "var(--surface-soft)",
      borderRadius: 4,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${Math.max(6, p.price / max * 100)}%`,
      height: "100%",
      background: "var(--info)",
      borderRadius: "0 4px 4px 0"
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "ros-mono",
    style: {
      width: 64,
      textAlign: "right",
      fontSize: 12,
      color: "var(--text-secondary)"
    }
  }, "$", p.price.toFixed(2)))));
}
window.ROS = {
  Icon,
  Button,
  Badge,
  Card,
  Input,
  Textarea,
  Checkbox,
  Separator,
  FitScore,
  PriorityBadge,
  StatusBadge,
  BudgetPill,
  Logo,
  PriceBars,
  useState,
  useEffect,
  useRef,
  useCallback
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/research-os/kit.jsx", error: String((e && e.message) || e) }); }

// ui_kits/research-os/screens.jsx
try { (() => {
/* ResearchOS UI kit — screens + app shell. window.ROSScreens */

(function () {
  const {
    Icon,
    Button,
    Badge,
    Card,
    Input,
    Textarea,
    Checkbox,
    Separator,
    FitScore,
    PriorityBadge,
    StatusBadge,
    BudgetPill,
    Logo,
    PriceBars,
    useState,
    useEffect,
    useRef
  } = window.ROS;
  const D = window.ROSData;
  const modeLabel = {
    "goal-driven": "goal-driven",
    "product-research": "product research",
    "direct-lookup": "direct lookup"
  };

  /* ============ App shell ============ */
  function AppShell({
    route,
    nav,
    children
  }) {
    const link = (id, label) => /*#__PURE__*/React.createElement("button", {
      onClick: () => nav(id),
      style: {
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        fontSize: 13,
        fontFamily: "var(--font-sans)",
        whiteSpace: "nowrap",
        color: route === id ? "var(--text)" : "var(--text-muted)"
      }
    }, label);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        minHeight: "100%",
        background: "var(--canvas)"
      }
    }, /*#__PURE__*/React.createElement("header", {
      style: {
        position: "sticky",
        top: 0,
        zIndex: 10,
        height: "var(--header-h)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        borderBottom: "1px solid var(--hairline)",
        background: "rgba(1,1,32,0.72)",
        backdropFilter: "blur(12px)"
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => nav("dashboard"),
      style: {
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0
      }
    }, /*#__PURE__*/React.createElement(Logo, {
      size: 24
    })), /*#__PURE__*/React.createElement("nav", {
      style: {
        display: "flex",
        gap: 22,
        alignItems: "center"
      }
    }, link("dashboard", "Dashboard"), link("new", "New Research"), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "brand",
      onClick: () => nav("new")
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 14
    }), " New"))), /*#__PURE__*/React.createElement("main", {
      style: {
        maxWidth: "var(--container-max)",
        margin: "0 auto",
        padding: "32px 24px 96px"
      }
    }, children), /*#__PURE__*/React.createElement("button", {
      title: "Ask the advisor",
      style: {
        position: "fixed",
        right: 24,
        bottom: 24,
        width: 52,
        height: 52,
        borderRadius: "9999px",
        border: "none",
        cursor: "pointer",
        color: "#fff",
        background: "var(--brand-gradient)",
        boxShadow: "var(--glow-brand), var(--elev-2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "sparkles",
      size: 22
    })));
  }
  function PageHead({
    eyebrow,
    title,
    sub,
    actions
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 16,
        marginBottom: 24
      }
    }, /*#__PURE__*/React.createElement("div", null, eyebrow && /*#__PURE__*/React.createElement("div", {
      className: "ros-eyebrow",
      style: {
        marginBottom: 8
      }
    }, eyebrow), /*#__PURE__*/React.createElement("h1", {
      style: {
        margin: 0,
        fontSize: "var(--text-h1)",
        letterSpacing: "var(--text-h1-ls)",
        fontWeight: 600
      }
    }, title), sub && /*#__PURE__*/React.createElement("p", {
      style: {
        margin: "8px 0 0",
        color: "var(--text-muted)",
        fontSize: 14,
        maxWidth: 620
      }
    }, sub)), actions);
  }

  /* ============ 1 · Dashboard ============ */
  function DashboardScreen({
    nav,
    empty,
    setEmpty
  }) {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHead, {
      eyebrow: "Sessions",
      title: "Research Sessions",
      actions: /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          gap: 8
        }
      }, /*#__PURE__*/React.createElement(Button, {
        variant: "outline",
        size: "sm",
        onClick: () => setEmpty(!empty)
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "eye",
        size: 14
      }), " ", empty ? "Show demo data" : "Empty state"), /*#__PURE__*/React.createElement(Button, {
        variant: "brand",
        onClick: () => nav("new")
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "plus",
        size: 15
      }), " New Research"))
    }), empty ? /*#__PURE__*/React.createElement(Card, {
      pad: true,
      style: {
        textAlign: "center",
        padding: "56px 24px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "inline-flex",
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement(Logo, {
      variant: "mark",
      size: 40,
      withWordmark: false
    })), /*#__PURE__*/React.createElement("h2", {
      style: {
        margin: "0 0 6px",
        fontSize: 18,
        fontWeight: 600
      }
    }, "No research sessions yet"), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: "0 0 18px",
        color: "var(--text-muted)",
        fontSize: 14
      }
    }, "Describe a goal and the advisor will identify what you need, search sources, and score the fit."), /*#__PURE__*/React.createElement(Button, {
      variant: "brand",
      onClick: () => nav("new")
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 15
    }), " Start your first research")) : /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
        gap: 14
      }
    }, D.sessions.map(s => /*#__PURE__*/React.createElement(Card, {
      key: s.id,
      interactive: true,
      onClick: () => nav(s.id === "s1" ? "detail" : s.status === "complete" || s.status === "decided" ? "results" : "detail")
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 18,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        height: "100%"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "ros-eyebrow"
    }, modeLabel[s.mode]), /*#__PURE__*/React.createElement(StatusBadge, {
      status: s.status
    })), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontSize: 15,
        fontWeight: 600,
        lineHeight: 1.35,
        letterSpacing: "-0.01em",
        flex: 1
      }
    }, s.goal), /*#__PURE__*/React.createElement(Separator, null), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 14,
        fontSize: 12,
        color: "var(--text-muted)",
        whiteSpace: "nowrap"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 5
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "calendar",
      size: 13
    }), s.created_at), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        whiteSpace: "nowrap"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "list-checks",
      size: 13
    }), s.needs, " ", s.needs === 1 ? "need" : "needs"), s.budget != null && /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: "auto"
      },
      className: "ros-mono"
    }, "$", s.budget.toLocaleString())))))));
  }

  /* ============ 2 · New Research ============ */
  function NewResearchScreen({
    nav,
    goal,
    setGoal,
    budget,
    setBudget
  }) {
    const cash = 4200;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 640,
        margin: "0 auto"
      }
    }, /*#__PURE__*/React.createElement(PageHead, {
      eyebrow: "New session",
      title: "What are you researching?",
      sub: "One goal, one budget. The advisor handles the rest."
    }), /*#__PURE__*/React.createElement(Card, {
      pad: true
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement(BudgetPill, {
      amount: cash
    })), /*#__PURE__*/React.createElement("label", {
      className: "ros-label"
    }, "What are you looking for?"), /*#__PURE__*/React.createElement(Textarea, {
      rows: 4,
      value: goal,
      onChange: e => setGoal(e.target.value),
      placeholder: "upgrade my robotics fab setup to build tendon-driven actuators\u2026"
    }), /*#__PURE__*/React.createElement("p", {
      className: "ros-hint"
    }, "Describe a goal, a product to research, or a part to look up."), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 18
      }
    }, /*#__PURE__*/React.createElement("label", {
      className: "ros-label"
    }, "Budget (optional)"), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        left: 12,
        top: "50%",
        transform: "translateY(-50%)",
        color: "var(--text-faint)",
        fontFamily: "var(--font-mono)",
        fontSize: 13
      }
    }, "$"), /*#__PURE__*/React.createElement(Input, {
      type: "number",
      mono: true,
      value: budget,
      onChange: e => setBudget(e.target.value),
      placeholder: "500",
      style: {
        paddingLeft: 24
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 22,
        display: "flex",
        justifyContent: "flex-end"
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "brand",
      size: "lg",
      disabled: !goal.trim(),
      onClick: () => nav("detail")
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "sparkles",
      size: 16
    }), " Start Research"))));
  }

  /* ============ 3 · Session Detail (pipeline) ============ */
  function SessionDetailScreen({
    nav
  }) {
    const [stage, setStage] = useState(0); // index into pipeline
    const [elapsed, setElapsed] = useState(0);
    const [cancelled, setCancelled] = useState(false);
    const done = stage >= D.pipeline.length - 1;
    useEffect(() => {
      if (cancelled || done) return;
      const t = setTimeout(() => setStage(s => s + 1), 1600);
      return () => clearTimeout(t);
    }, [stage, cancelled, done]);
    useEffect(() => {
      if (cancelled || done) return;
      const i = setInterval(() => setElapsed(e => e + 1), 1000);
      return () => clearInterval(i);
    }, [cancelled, done]);
    const needStatus = idx => {
      // map pipeline progress onto the four needs
      if (cancelled) return "pending";
      if (done) return "complete";
      const reached = Math.min(stage, 3);
      if (idx < reached) return "complete";
      if (idx === reached) return stage >= 2 ? "evaluating" : "searching";
      return "pending";
    };
    const NEED_ICON = {
      complete: ["circle-check", "var(--success-text)"],
      searching: ["loader", "var(--info-text)"],
      evaluating: ["loader", "var(--warning-text)"],
      pending: ["circle", "var(--text-faint)"],
      failed: ["circle-x", "var(--danger-text)"]
    };
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHead, {
      eyebrow: "goal-driven \xB7 running",
      title: "Upgrade robotics fab",
      sub: "Build tendon-driven actuators \xB7 $4,200 budget"
    }), /*#__PURE__*/React.createElement(Card, {
      pad: true,
      style: {
        marginBottom: 18
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 18
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontSize: 16,
        fontWeight: 600
      }
    }, cancelled ? "Research cancelled" : done ? "Pipeline complete" : "Researching…"), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: "4px 0 0",
        fontSize: 13,
        color: "var(--text-muted)"
      },
      className: "ros-mono"
    }, Math.min(stage + (done ? 0 : 0), 4), "/4 needs \xB7 ", Math.floor(elapsed / 60), "m ", elapsed % 60, "s elapsed")), !done && !cancelled ? /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      size: "sm",
      onClick: () => setCancelled(true)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "x",
      size: 14
    }), " Cancel") : /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      size: "sm",
      onClick: () => {
        setCancelled(false);
        setStage(0);
        setElapsed(0);
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "rotate-cw",
      size: 14
    }), " Re-run")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8
      }
    }, D.pipeline.map((p, i) => {
      const state = cancelled ? "idle" : i < stage || done ? "done" : i === stage ? "active" : "idle";
      const col = state === "done" ? "var(--success-text)" : state === "active" ? "var(--brand-periwinkle)" : "var(--text-faint)";
      return /*#__PURE__*/React.createElement("div", {
        key: p.id,
        style: {
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 8
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          height: 3,
          borderRadius: 2,
          background: state === "idle" ? "var(--surface-soft)" : "currentColor",
          color: col,
          opacity: state === "active" ? 0.9 : 1
        }
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 7,
          color: col,
          fontSize: 12
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: p.icon,
        size: 14,
        className: state === "active" ? "ros-spin" : ""
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: "var(--font-mono)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          fontSize: 10
        }
      }, p.label)));
    }))), /*#__PURE__*/React.createElement("div", {
      className: "ros-eyebrow",
      style: {
        marginBottom: 10
      }
    }, "Identified needs"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 8
      }
    }, D.needs.map((n, i) => {
      const st = needStatus(i);
      const [ic, col] = NEED_ICON[st];
      return /*#__PURE__*/React.createElement(Card, {
        key: n.id,
        padSm: true
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 12
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          color: col,
          display: "inline-flex"
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: ic,
        size: 16,
        className: st === "searching" || st === "evaluating" ? "ros-spin" : ""
      })), /*#__PURE__*/React.createElement("span", {
        style: {
          flex: 1,
          minWidth: 0,
          fontSize: 14,
          color: st === "complete" ? "var(--text)" : "var(--text-secondary)"
        }
      }, n.description), st === "complete" && /*#__PURE__*/React.createElement("span", {
        className: "ros-mono",
        style: {
          fontSize: 12,
          color: "var(--text-muted)",
          whiteSpace: "nowrap",
          flexShrink: 0
        }
      }, (D.products[n.id] || []).length || 0, " products"), (st === "searching" || st === "evaluating") && /*#__PURE__*/React.createElement(Badge, {
        variant: st === "evaluating" ? "warning" : "info",
        mono: true
      }, st)));
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "flex-end",
        marginTop: 22
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: done ? "brand" : "secondary",
      disabled: !done && !cancelled,
      onClick: () => nav("gaps")
    }, "Continue to gap analysis ", /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 15
    }))));
  }

  /* ============ 4 · Gap Analysis ============ */
  function GapsScreen({
    nav,
    selectedNeeds,
    setSelectedNeeds
  }) {
    const toggle = id => {
      const next = new Set(selectedNeeds);
      next.has(id) ? next.delete(id) : next.add(id);
      setSelectedNeeds(next);
    };
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHead, {
      eyebrow: "Gap analysis",
      title: "What you'll need",
      sub: "Qwen broke the goal into needs and scored each against your budget. Pick the ones to research."
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
        marginBottom: 22
      }
    }, D.needs.map(n => /*#__PURE__*/React.createElement(Card, {
      key: n.id,
      padSm: true
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 12,
        alignItems: "flex-start"
      }
    }, /*#__PURE__*/React.createElement(Checkbox, {
      checked: selectedNeeds.has(n.id),
      onCheckedChange: () => toggle(n.id),
      style: {
        marginTop: 2
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        justifyContent: "space-between"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0,
        fontSize: 14,
        fontWeight: 600,
        lineHeight: 1.4
      }
    }, n.description, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        verticalAlign: "middle",
        marginLeft: 8
      }
    }, /*#__PURE__*/React.createElement(PriorityBadge, {
      priority: n.priority
    }))), /*#__PURE__*/React.createElement("span", {
      className: "ros-mono",
      style: {
        fontSize: 12,
        color: "var(--text-muted)",
        whiteSpace: "nowrap",
        flexShrink: 0,
        marginTop: 2
      }
    }, n.estimated_cost_range)), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: "6px 0 0",
        fontSize: 13,
        color: "var(--text-muted)",
        lineHeight: 1.5
      }
    }, n.rationale)))))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        color: "var(--text-muted)"
      }
    }, selectedNeeds.size, " of ", D.needs.length, " selected"), /*#__PURE__*/React.createElement(Button, {
      variant: "brand",
      disabled: selectedNeeds.size === 0,
      onClick: () => nav("results")
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 15
    }), " Research ", selectedNeeds.size, " Selected")));
  }

  /* ============ 5 · Results ============ */
  function ProductRow({
    p,
    checked,
    onToggle
  }) {
    return /*#__PURE__*/React.createElement(Card, {
      padSm: true,
      interactive: false
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 12,
        alignItems: "flex-start"
      }
    }, /*#__PURE__*/React.createElement(Checkbox, {
      checked: checked,
      onCheckedChange: onToggle,
      style: {
        marginTop: 3
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 44,
        height: 44,
        borderRadius: 8,
        background: "var(--surface-soft)",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text-faint)",
        boxShadow: "var(--ring-hairline)"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "package",
      size: 18
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        justifyContent: "space-between"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement(FitScore, {
      score: p.fit_score,
      showLabel: false
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14,
        fontWeight: 600,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    }, p.name)), /*#__PURE__*/React.createElement("span", {
      className: "ros-mono",
      style: {
        fontSize: 13,
        color: "var(--text-secondary)",
        whiteSpace: "nowrap",
        flexShrink: 0
      }
    }, p.price != null ? `$${p.price.toFixed(2)}` : "Price N/A")), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 3,
        fontSize: 12,
        color: "var(--text-muted)"
      }
    }, p.source_name), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: "6px 0 0",
        fontSize: 13,
        color: "var(--text-muted)",
        lineHeight: 1.5
      }
    }, p.fit_rationale), p.risks.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 6,
        marginTop: 8,
        flexWrap: "wrap"
      }
    }, p.risks.map((r, i) => /*#__PURE__*/React.createElement(Badge, {
      key: i,
      variant: "outline"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "triangle-alert",
      size: 11
    }), " ", r))))));
  }
  function ResultsScreen({
    nav,
    selectedNeeds,
    selectedProducts,
    setSelectedProducts
  }) {
    const toggle = id => {
      const next = new Set(selectedProducts);
      next.has(id) ? next.delete(id) : next.add(id);
      setSelectedProducts(next);
    };
    const needs = D.needs.filter(n => selectedNeeds.has(n.id) && D.products[n.id]);
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHead, {
      eyebrow: "Results",
      title: "Products found",
      sub: "Upgrade robotics fab \xB7 scored against your goal and budget"
    }), needs.map(n => /*#__PURE__*/React.createElement("div", {
      key: n.id,
      style: {
        marginBottom: 30
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "baseline",
        gap: 10,
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        margin: 0,
        fontSize: 16,
        fontWeight: 600,
        minWidth: 0
      }
    }, n.description), /*#__PURE__*/React.createElement("span", {
      style: {
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      variant: "neutral"
    }, D.products[n.id].length, " found"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 8
      }
    }, D.products[n.id].map(p => /*#__PURE__*/React.createElement(ProductRow, {
      key: p.id,
      p: p,
      checked: selectedProducts.has(p.id),
      onToggle: () => toggle(p.id)
    }))), /*#__PURE__*/React.createElement(Card, {
      padSm: true,
      style: {
        marginTop: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "ros-eyebrow",
      style: {
        marginBottom: 4
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "bar-chart-3",
      size: 12
    }), " Price comparison"), /*#__PURE__*/React.createElement(PriceBars, {
      products: D.products[n.id]
    })), /*#__PURE__*/React.createElement(Separator, {
      className: ""
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        color: "var(--text-muted)"
      }
    }, selectedProducts.size, " products selected"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      onClick: () => nav("gaps")
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "rotate-cw",
      size: 14
    }), " Re-research"), /*#__PURE__*/React.createElement(Button, {
      variant: "brand",
      disabled: selectedProducts.size === 0,
      onClick: () => nav("decision")
    }, "Decide on Winners ", /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 15
    })))));
  }

  /* ============ 6 · Decision ============ */
  function DecisionScreen({
    nav,
    selectedProducts
  }) {
    const [saved, setSaved] = useState(false);
    const [rationale, setRationale] = useState("");
    const all = Object.values(D.products).flat();
    const chosen = all.filter(p => selectedProducts.has(p.id));
    const total = chosen.reduce((s, p) => s + (p.price || 0), 0);
    const budget = 4200;
    if (saved) {
      return /*#__PURE__*/React.createElement("div", {
        style: {
          maxWidth: 560,
          margin: "0 auto",
          textAlign: "center",
          paddingTop: 24
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: "inline-flex",
          width: 56,
          height: 56,
          borderRadius: "9999px",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--success-soft)",
          color: "var(--success-text)",
          marginBottom: 18,
          boxShadow: "0 0 24px rgba(34,197,94,0.25)"
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "circle-check",
        size: 28
      })), /*#__PURE__*/React.createElement("h1", {
        style: {
          margin: "0 0 8px",
          fontSize: 22,
          fontWeight: 600
        }
      }, "Decision written to wiki"), /*#__PURE__*/React.createElement("p", {
        style: {
          margin: "0 0 18px",
          color: "var(--text-muted)",
          fontSize: 14
        }
      }, "A durable record was committed for the next person (or agent) who searches this."), /*#__PURE__*/React.createElement("code", {
        style: {
          display: "block",
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          color: "var(--brand-periwinkle)",
          background: "var(--surface-input)",
          padding: "10px 14px",
          borderRadius: 8,
          boxShadow: "var(--ring-hairline)",
          marginBottom: 20
        }
      }, "wiki/decisions/project-eve-humanoid-robot/actuators.md"), /*#__PURE__*/React.createElement(Button, {
        variant: "outline",
        onClick: () => nav("dashboard")
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "arrow-left",
        size: 14
      }), " Back to dashboard"));
    }
    return /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 640,
        margin: "0 auto"
      }
    }, /*#__PURE__*/React.createElement(PageHead, {
      eyebrow: "Decision",
      title: "Finalize & commit",
      sub: "Review the picks, then write a decision record to the wiki."
    }), /*#__PURE__*/React.createElement(Card, {
      pad: true,
      style: {
        marginBottom: 18
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "ros-eyebrow",
      style: {
        marginBottom: 12
      }
    }, "Selected products"), chosen.length === 0 && /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-muted)",
        fontSize: 14
      }
    }, "No products selected."), chosen.map(p => /*#__PURE__*/React.createElement("div", {
      key: p.id,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "9px 0",
        borderBottom: "1px solid var(--hairline)"
      }
    }, /*#__PURE__*/React.createElement(FitScore, {
      score: p.fit_score,
      showLabel: false
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontSize: 14
      }
    }, p.name), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: "var(--text-muted)"
      }
    }, p.source_name), /*#__PURE__*/React.createElement("span", {
      className: "ros-mono",
      style: {
        fontSize: 13,
        width: 78,
        textAlign: "right"
      }
    }, "$", (p.price || 0).toFixed(2)))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 14
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14,
        fontWeight: 600
      }
    }, "Total"), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "ros-mono",
      style: {
        fontSize: 16,
        fontWeight: 600
      }
    }, "$", total.toFixed(2)), /*#__PURE__*/React.createElement(Badge, {
      variant: total <= budget ? "success" : "danger"
    }, total <= budget ? `under $${budget.toLocaleString()}` : "over budget")))), /*#__PURE__*/React.createElement(Card, {
      pad: true,
      style: {
        marginBottom: 18
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "ros-eyebrow",
      style: {
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "scroll-text",
      size: 12
    }), " Decision record preview"), /*#__PURE__*/React.createElement("ul", {
      style: {
        margin: 0,
        paddingLeft: 18,
        color: "var(--text-muted)",
        fontSize: 13,
        lineHeight: 1.9
      }
    }, /*#__PURE__*/React.createElement("li", null, "Goal, budget, and the ", chosen.length, " chosen part", chosen.length !== 1 ? "s" : "", " with prices & sources"), /*#__PURE__*/React.createElement("li", null, "Fit score and rationale captured per product"), /*#__PURE__*/React.createElement("li", null, "Your rationale + project slug, committed to the team wiki"))), /*#__PURE__*/React.createElement("label", {
      className: "ros-label"
    }, "Rationale"), /*#__PURE__*/React.createElement(Textarea, {
      rows: 3,
      value: rationale,
      onChange: e => setRationale(e.target.value),
      placeholder: "Why these picks? (e.g. encoder resolution justified the price premium)"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12,
        marginTop: 14
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      className: "ros-label"
    }, "Project (wiki slug)"), /*#__PURE__*/React.createElement(Input, {
      mono: true,
      defaultValue: "project-eve-humanoid-robot"
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      className: "ros-label"
    }, "Budget category"), /*#__PURE__*/React.createElement(Input, {
      mono: true,
      defaultValue: "robotics-rd"
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "flex-end",
        gap: 8,
        marginTop: 22
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      onClick: () => nav("results")
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-left",
      size: 14
    }), " Back"), /*#__PURE__*/React.createElement(Button, {
      variant: "brand",
      disabled: chosen.length === 0,
      onClick: () => setSaved(true)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 15
    }), " Write Decision to Wiki")));
  }
  window.ROSScreens = {
    AppShell,
    DashboardScreen,
    NewResearchScreen,
    SessionDetailScreen,
    GapsScreen,
    ResultsScreen,
    DecisionScreen
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/research-os/screens.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.CardHeader = __ds_scope.CardHeader;

__ds_ns.CardTitle = __ds_scope.CardTitle;

__ds_ns.CardDescription = __ds_scope.CardDescription;

__ds_ns.CardContent = __ds_scope.CardContent;

__ds_ns.CardFooter = __ds_scope.CardFooter;

__ds_ns.Separator = __ds_scope.Separator;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.BudgetPill = __ds_scope.BudgetPill;

__ds_ns.FitScore = __ds_scope.FitScore;

__ds_ns.PriorityBadge = __ds_scope.PriorityBadge;

__ds_ns.StatusBadge = __ds_scope.StatusBadge;

})();
