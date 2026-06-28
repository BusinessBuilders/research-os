/* ResearchOS UI kit — fake data fixtures. window.ROSData */

window.ROSData = {
  emptyDashboard: false,

  sessions: [
    {
      id: "s1", goal: "Upgrade robotics fab to build tendon-driven actuators",
      created_at: "2026-06-06", mode: "goal-driven", budget: 4200,
      status: "researching", needs: 4,
    },
    {
      id: "s2", goal: "Source a benchtop reflow oven for small-run PCBA",
      created_at: "2026-06-04", mode: "product-research", budget: 1500,
      status: "decided", needs: 3,
    },
    {
      id: "s3", goal: "Find the JST connector crimp tool that fits SH 1.0mm",
      created_at: "2026-06-03", mode: "direct-lookup", budget: null,
      status: "complete", needs: 1,
    },
    {
      id: "s4", goal: "Spec a 5-axis CNC for aluminium fixture plates",
      created_at: "2026-05-30", mode: "goal-driven", budget: 38000,
      status: "failed", needs: 5,
    },
  ],

  /* Detail for the active session s1 */
  needs: [
    {
      id: "n1", description: "High-torque servo motor (≥3 N·m, position feedback)",
      rationale: "Tendon actuation needs stall torque headroom and absolute encoders for closed-loop control.",
      priority: "critical", estimated_cost_range: "$180 – $320 / unit", selected: true,
    },
    {
      id: "n2", description: "Spectra / Dyneema tendon line (1.0–1.5mm)",
      rationale: "Low-stretch, high-tensile line transmits force from the motor to the joint.",
      priority: "important", estimated_cost_range: "$25 – $60 / spool", selected: true,
    },
    {
      id: "n3", description: "Low-friction PTFE tendon sheath + routing pulleys",
      rationale: "Keeps routing losses down so motor torque reaches the fingertip.",
      priority: "important", estimated_cost_range: "$40 – $90", selected: true,
    },
    {
      id: "n4", description: "Bench power supply (24V, ≥10A, current limit)",
      rationale: "Drives the servo bus during bring-up with over-current protection.",
      priority: "nice-to-have", estimated_cost_range: "$70 – $160", selected: false,
    },
  ],

  /* Products keyed by need id */
  products: {
    n1: [
      { id: "p1", name: "Dynamixel XM430-W350-T", price: 269.90, source_name: "ROBOTIS",
        fit_score: "strong", fit_rationale: "3.7 N·m stall, 12-bit absolute encoder, TTL bus — ideal for closed-loop tendon drive.",
        risks: ["lead time 2–3 wk"] },
      { id: "p2", name: "Feetech STS3250 Serial Bus Servo", price: 39.50, source_name: "Alibaba",
        fit_score: "partial", fit_rationale: "Cheap and 35 kg·cm, but 1024-step encoder limits fine position control.",
        risks: ["no datasheet", "QC variance"] },
      { id: "p3", name: "Generic MG996R", price: 4.20, source_name: "AliExpress",
        fit_score: "poor", fit_rationale: "Hobby servo — no feedback, plastic gears strip under tendon load.",
        risks: ["no feedback", "low durability"] },
    ],
    n2: [
      { id: "p4", name: "Dyneema SK99 1.2mm (50m)", price: 34.00, source_name: "Marlow",
        fit_score: "strong", fit_rationale: "0.3% stretch at 30% load, 240 kg break — textbook tendon line.", risks: [] },
      { id: "p5", name: "Generic UHMWPE braid 1.0mm", price: 11.90, source_name: "AliExpress",
        fit_score: "partial", fit_rationale: "Works but stretch spec unverified across batches.", risks: ["spec unverified"] },
    ],
    n3: [
      { id: "p6", name: "igus PTFE liner + 8mm pulley kit", price: 58.00, source_name: "igus",
        fit_score: "strong", fit_rationale: "Matched liner/pulley radii minimise capstan losses.", risks: [] },
      { id: "p7", name: "Bowden PTFE tubing (5m)", price: 9.50, source_name: "McMaster-Carr",
        fit_score: "partial", fit_rationale: "Liner only — you'll source pulleys separately.", risks: ["pulleys not included"] },
    ],
  },

  pipeline: [
    { id: "analyzing", label: "Analyzing needs", icon: "sparkles" },
    { id: "searching", label: "Searching sources", icon: "search" },
    { id: "scoring", label: "Scoring fit", icon: "target" },
    { id: "complete", label: "Complete", icon: "circle-check" },
  ],
};
