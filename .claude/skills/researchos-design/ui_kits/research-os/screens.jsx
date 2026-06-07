/* ResearchOS UI kit — screens + app shell. window.ROSScreens */

(function () {
  const { Icon, Button, Badge, Card, Input, Textarea, Checkbox, Separator,
    FitScore, PriorityBadge, StatusBadge, BudgetPill, Logo, PriceBars,
    useState, useEffect, useRef } = window.ROS;
  const D = window.ROSData;

  const modeLabel = { "goal-driven": "goal-driven", "product-research": "product research", "direct-lookup": "direct lookup" };

  /* ============ App shell ============ */
  function AppShell({ route, nav, children }) {
    const link = (id, label) => (
      <button onClick={() => nav(id)}
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0,
          fontSize: 13, fontFamily: "var(--font-sans)", whiteSpace: "nowrap",
          color: route === id ? "var(--text)" : "var(--text-muted)" }}>
        {label}
      </button>
    );
    return (
      <div style={{ minHeight: "100%", background: "var(--canvas)" }}>
        <header style={{ position: "sticky", top: 0, zIndex: 10, height: "var(--header-h)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 24px", borderBottom: "1px solid var(--hairline)",
          background: "rgba(1,1,32,0.72)", backdropFilter: "blur(12px)" }}>
          <button onClick={() => nav("dashboard")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <Logo size={24} />
          </button>
          <nav style={{ display: "flex", gap: 22, alignItems: "center" }}>
            {link("dashboard", "Dashboard")}
            {link("new", "New Research")}
            <Button size="sm" variant="brand" onClick={() => nav("new")}>
              <Icon name="plus" size={14} /> New
            </Button>
          </nav>
        </header>
        <main style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "32px 24px 96px" }}>
          {children}
        </main>
        <button title="Ask the advisor" style={{ position: "fixed", right: 24, bottom: 24, width: 52, height: 52,
          borderRadius: "9999px", border: "none", cursor: "pointer", color: "#fff",
          background: "var(--brand-gradient)", boxShadow: "var(--glow-brand), var(--elev-2)",
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="sparkles" size={22} />
        </button>
      </div>
    );
  }

  function PageHead({ eyebrow, title, sub, actions }) {
    return (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 24 }}>
        <div>
          {eyebrow && <div className="ros-eyebrow" style={{ marginBottom: 8 }}>{eyebrow}</div>}
          <h1 style={{ margin: 0, fontSize: "var(--text-h1)", letterSpacing: "var(--text-h1-ls)", fontWeight: 600 }}>{title}</h1>
          {sub && <p style={{ margin: "8px 0 0", color: "var(--text-muted)", fontSize: 14, maxWidth: 620 }}>{sub}</p>}
        </div>
        {actions}
      </div>
    );
  }

  /* ============ 1 · Dashboard ============ */
  function DashboardScreen({ nav, empty, setEmpty }) {
    return (
      <div>
        <PageHead
          eyebrow="Sessions"
          title="Research Sessions"
          actions={<div style={{ display: "flex", gap: 8 }}>
            <Button variant="outline" size="sm" onClick={() => setEmpty(!empty)}>
              <Icon name="eye" size={14} /> {empty ? "Show demo data" : "Empty state"}
            </Button>
            <Button variant="brand" onClick={() => nav("new")}><Icon name="plus" size={15} /> New Research</Button>
          </div>}
        />
        {empty ? (
          <Card pad style={{ textAlign: "center", padding: "56px 24px" }}>
            <div style={{ display: "inline-flex", marginBottom: 16 }}><Logo variant="mark" size={40} withWordmark={false} /></div>
            <h2 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 600 }}>No research sessions yet</h2>
            <p style={{ margin: "0 0 18px", color: "var(--text-muted)", fontSize: 14 }}>
              Describe a goal and the advisor will identify what you need, search sources, and score the fit.
            </p>
            <Button variant="brand" onClick={() => nav("new")}><Icon name="plus" size={15} /> Start your first research</Button>
          </Card>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 14 }}>
            {D.sessions.map((s) => (
              <Card key={s.id} interactive
                onClick={() => nav(s.id === "s1" ? "detail" : s.status === "complete" || s.status === "decided" ? "results" : "detail")}>
                <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 12, height: "100%" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                    <span className="ros-eyebrow">{modeLabel[s.mode]}</span>
                    <StatusBadge status={s.status} />
                  </div>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 600, lineHeight: 1.35, letterSpacing: "-0.01em", flex: 1 }}>{s.goal}</p>
                  <Separator />
                  <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Icon name="calendar" size={13} />{s.created_at}</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}><Icon name="list-checks" size={13} />{s.needs} {s.needs === 1 ? "need" : "needs"}</span>
                    {s.budget != null && <span style={{ marginLeft: "auto" }} className="ros-mono">${s.budget.toLocaleString()}</span>}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ============ 2 · New Research ============ */
  function NewResearchScreen({ nav, goal, setGoal, budget, setBudget }) {
    const cash = 4200;
    return (
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <PageHead eyebrow="New session" title="What are you researching?"
          sub="One goal, one budget. The advisor handles the rest." />
        <Card pad>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
            <BudgetPill amount={cash} />
          </div>
          <label className="ros-label">What are you looking for?</label>
          <Textarea rows={4} value={goal} onChange={(e) => setGoal(e.target.value)}
            placeholder="upgrade my robotics fab setup to build tendon-driven actuators…" />
          <p className="ros-hint">Describe a goal, a product to research, or a part to look up.</p>

          <div style={{ marginTop: 18 }}>
            <label className="ros-label">Budget (optional)</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)", fontFamily: "var(--font-mono)", fontSize: 13 }}>$</span>
              <Input type="number" mono value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="500" style={{ paddingLeft: 24 }} />
            </div>
          </div>

          <div style={{ marginTop: 22, display: "flex", justifyContent: "flex-end" }}>
            <Button variant="brand" size="lg" disabled={!goal.trim()} onClick={() => nav("detail")}>
              <Icon name="sparkles" size={16} /> Start Research
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  /* ============ 3 · Session Detail (pipeline) ============ */
  function SessionDetailScreen({ nav }) {
    const [stage, setStage] = useState(0);      // index into pipeline
    const [elapsed, setElapsed] = useState(0);
    const [cancelled, setCancelled] = useState(false);
    const done = stage >= D.pipeline.length - 1;

    useEffect(() => {
      if (cancelled || done) return;
      const t = setTimeout(() => setStage((s) => s + 1), 1600);
      return () => clearTimeout(t);
    }, [stage, cancelled, done]);

    useEffect(() => {
      if (cancelled || done) return;
      const i = setInterval(() => setElapsed((e) => e + 1), 1000);
      return () => clearInterval(i);
    }, [cancelled, done]);

    const needStatus = (idx) => {
      // map pipeline progress onto the four needs
      if (cancelled) return "pending";
      if (done) return "complete";
      const reached = Math.min(stage, 3);
      if (idx < reached) return "complete";
      if (idx === reached) return stage >= 2 ? "evaluating" : "searching";
      return "pending";
    };
    const NEED_ICON = { complete: ["circle-check", "var(--success-text)"], searching: ["loader", "var(--info-text)"],
      evaluating: ["loader", "var(--warning-text)"], pending: ["circle", "var(--text-faint)"], failed: ["circle-x", "var(--danger-text)"] };

    return (
      <div>
        <PageHead eyebrow="goal-driven · running" title="Upgrade robotics fab"
          sub="Build tendon-driven actuators · $4,200 budget" />

        {/* pipeline rail */}
        <Card pad style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
                {cancelled ? "Research cancelled" : done ? "Pipeline complete" : "Researching…"}
              </p>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-muted)" }} className="ros-mono">
                {Math.min(stage + (done ? 0 : 0), 4)}/4 needs · {Math.floor(elapsed / 60)}m {elapsed % 60}s elapsed
              </p>
            </div>
            {!done && !cancelled ? (
              <Button variant="outline" size="sm" onClick={() => setCancelled(true)}><Icon name="x" size={14} /> Cancel</Button>
            ) : (
              <Button variant="outline" size="sm" onClick={() => { setCancelled(false); setStage(0); setElapsed(0); }}>
                <Icon name="rotate-cw" size={14} /> Re-run
              </Button>
            )}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            {D.pipeline.map((p, i) => {
              const state = cancelled ? "idle" : i < stage || done ? "done" : i === stage ? "active" : "idle";
              const col = state === "done" ? "var(--success-text)" : state === "active" ? "var(--brand-periwinkle)" : "var(--text-faint)";
              return (
                <div key={p.id} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ height: 3, borderRadius: 2, background: state === "idle" ? "var(--surface-soft)" : "currentColor", color: col, opacity: state === "active" ? 0.9 : 1 }} />
                  <div style={{ display: "flex", alignItems: "center", gap: 7, color: col, fontSize: 12 }}>
                    <Icon name={p.icon} size={14} className={state === "active" ? "ros-spin" : ""} />
                    <span style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 10 }}>{p.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* needs list */}
        <div className="ros-eyebrow" style={{ marginBottom: 10 }}>Identified needs</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {D.needs.map((n, i) => {
            const st = needStatus(i);
            const [ic, col] = NEED_ICON[st];
            return (
              <Card key={n.id} padSm>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ color: col, display: "inline-flex" }}><Icon name={ic} size={16} className={st === "searching" || st === "evaluating" ? "ros-spin" : ""} /></span>
                  <span style={{ flex: 1, minWidth: 0, fontSize: 14, color: st === "complete" ? "var(--text)" : "var(--text-secondary)" }}>{n.description}</span>
                  {st === "complete" && <span className="ros-mono" style={{ fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap", flexShrink: 0 }}>{(D.products[n.id] || []).length || 0} products</span>}
                  {(st === "searching" || st === "evaluating") && <Badge variant={st === "evaluating" ? "warning" : "info"} mono>{st}</Badge>}
                </div>
              </Card>
            );
          })}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 22 }}>
          <Button variant={done ? "brand" : "secondary"} disabled={!done && !cancelled} onClick={() => nav("gaps")}>
            Continue to gap analysis <Icon name="chevron-right" size={15} />
          </Button>
        </div>
      </div>
    );
  }

  /* ============ 4 · Gap Analysis ============ */
  function GapsScreen({ nav, selectedNeeds, setSelectedNeeds }) {
    const toggle = (id) => {
      const next = new Set(selectedNeeds);
      next.has(id) ? next.delete(id) : next.add(id);
      setSelectedNeeds(next);
    };
    return (
      <div>
        <PageHead eyebrow="Gap analysis" title="What you'll need"
          sub="Qwen broke the goal into needs and scored each against your budget. Pick the ones to research." />
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
          {D.needs.map((n) => (
            <Card key={n.id} padSm>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <Checkbox checked={selectedNeeds.has(n.id)} onCheckedChange={() => toggle(n.id)} style={{ marginTop: 2 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, justifyContent: "space-between" }}>
                    <div style={{ flex: 1, minWidth: 0, fontSize: 14, fontWeight: 600, lineHeight: 1.4 }}>
                      {n.description}
                      <span style={{ display: "inline-flex", verticalAlign: "middle", marginLeft: 8 }}><PriorityBadge priority={n.priority} /></span>
                    </div>
                    <span className="ros-mono" style={{ fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap", flexShrink: 0, marginTop: 2 }}>{n.estimated_cost_range}</span>
                  </div>
                  <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>{n.rationale}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{selectedNeeds.size} of {D.needs.length} selected</span>
          <Button variant="brand" disabled={selectedNeeds.size === 0} onClick={() => nav("results")}>
            <Icon name="search" size={15} /> Research {selectedNeeds.size} Selected
          </Button>
        </div>
      </div>
    );
  }

  /* ============ 5 · Results ============ */
  function ProductRow({ p, checked, onToggle }) {
    return (
      <Card padSm interactive={false}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <Checkbox checked={checked} onCheckedChange={onToggle} style={{ marginTop: 3 }} />
          <div style={{ width: 44, height: 44, borderRadius: 8, background: "var(--surface-soft)", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-faint)", boxShadow: "var(--ring-hairline)" }}>
            <Icon name="package" size={18} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                <FitScore score={p.fit_score} showLabel={false} />
                <span style={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</span>
              </div>
              <span className="ros-mono" style={{ fontSize: 13, color: "var(--text-secondary)", whiteSpace: "nowrap", flexShrink: 0 }}>{p.price != null ? `$${p.price.toFixed(2)}` : "Price N/A"}</span>
            </div>
            <div style={{ marginTop: 3, fontSize: 12, color: "var(--text-muted)" }}>{p.source_name}</div>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>{p.fit_rationale}</p>
            {p.risks.length > 0 && (
              <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                {p.risks.map((r, i) => <Badge key={i} variant="outline"><Icon name="triangle-alert" size={11} /> {r}</Badge>)}
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }

  function ResultsScreen({ nav, selectedNeeds, selectedProducts, setSelectedProducts }) {
    const toggle = (id) => {
      const next = new Set(selectedProducts);
      next.has(id) ? next.delete(id) : next.add(id);
      setSelectedProducts(next);
    };
    const needs = D.needs.filter((n) => selectedNeeds.has(n.id) && D.products[n.id]);
    return (
      <div>
        <PageHead eyebrow="Results" title="Products found"
          sub="Upgrade robotics fab · scored against your goal and budget" />
        {needs.map((n) => (
          <div key={n.id} style={{ marginBottom: 30 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, minWidth: 0 }}>{n.description}</h2>
              <span style={{ flexShrink: 0 }}><Badge variant="neutral">{D.products[n.id].length} found</Badge></span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {D.products[n.id].map((p) => (
                <ProductRow key={p.id} p={p} checked={selectedProducts.has(p.id)} onToggle={() => toggle(p.id)} />
              ))}
            </div>
            <Card padSm style={{ marginTop: 12 }}>
              <div className="ros-eyebrow" style={{ marginBottom: 4 }}><Icon name="bar-chart-3" size={12} /> Price comparison</div>
              <PriceBars products={D.products[n.id]} />
            </Card>
            <Separator className="" />
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{selectedProducts.size} products selected</span>
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="outline" onClick={() => nav("gaps")}><Icon name="rotate-cw" size={14} /> Re-research</Button>
            <Button variant="brand" disabled={selectedProducts.size === 0} onClick={() => nav("decision")}>
              Decide on Winners <Icon name="chevron-right" size={15} />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ============ 6 · Decision ============ */
  function DecisionScreen({ nav, selectedProducts }) {
    const [saved, setSaved] = useState(false);
    const [rationale, setRationale] = useState("");
    const all = Object.values(D.products).flat();
    const chosen = all.filter((p) => selectedProducts.has(p.id));
    const total = chosen.reduce((s, p) => s + (p.price || 0), 0);
    const budget = 4200;

    if (saved) {
      return (
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center", paddingTop: 24 }}>
          <div style={{ display: "inline-flex", width: 56, height: 56, borderRadius: "9999px", alignItems: "center", justifyContent: "center",
            background: "var(--success-soft)", color: "var(--success-text)", marginBottom: 18, boxShadow: "0 0 24px rgba(34,197,94,0.25)" }}>
            <Icon name="circle-check" size={28} />
          </div>
          <h1 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 600 }}>Decision written to wiki</h1>
          <p style={{ margin: "0 0 18px", color: "var(--text-muted)", fontSize: 14 }}>A durable record was committed for the next person (or agent) who searches this.</p>
          <code style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--brand-periwinkle)",
            background: "var(--surface-input)", padding: "10px 14px", borderRadius: 8, boxShadow: "var(--ring-hairline)", marginBottom: 20 }}>
            wiki/decisions/project-eve-humanoid-robot/actuators.md
          </code>
          <Button variant="outline" onClick={() => nav("dashboard")}><Icon name="arrow-left" size={14} /> Back to dashboard</Button>
        </div>
      );
    }

    return (
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <PageHead eyebrow="Decision" title="Finalize & commit"
          sub="Review the picks, then write a decision record to the wiki." />
        <Card pad style={{ marginBottom: 18 }}>
          <div className="ros-eyebrow" style={{ marginBottom: 12 }}>Selected products</div>
          {chosen.length === 0 && <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No products selected.</p>}
          {chosen.map((p) => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: "1px solid var(--hairline)" }}>
              <FitScore score={p.fit_score} showLabel={false} />
              <span style={{ flex: 1, fontSize: 14 }}>{p.name}</span>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{p.source_name}</span>
              <span className="ros-mono" style={{ fontSize: 13, width: 78, textAlign: "right" }}>${(p.price || 0).toFixed(2)}</span>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Total</span>
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="ros-mono" style={{ fontSize: 16, fontWeight: 600 }}>${total.toFixed(2)}</span>
              <Badge variant={total <= budget ? "success" : "danger"}>{total <= budget ? `under $${budget.toLocaleString()}` : "over budget"}</Badge>
            </span>
          </div>
        </Card>

        <Card pad style={{ marginBottom: 18 }}>
          <div className="ros-eyebrow" style={{ marginBottom: 10 }}><Icon name="scroll-text" size={12} /> Decision record preview</div>
          <ul style={{ margin: 0, paddingLeft: 18, color: "var(--text-muted)", fontSize: 13, lineHeight: 1.9 }}>
            <li>Goal, budget, and the {chosen.length} chosen part{chosen.length !== 1 ? "s" : ""} with prices &amp; sources</li>
            <li>Fit score and rationale captured per product</li>
            <li>Your rationale + project slug, committed to the team wiki</li>
          </ul>
        </Card>

        <label className="ros-label">Rationale</label>
        <Textarea rows={3} value={rationale} onChange={(e) => setRationale(e.target.value)} placeholder="Why these picks? (e.g. encoder resolution justified the price premium)" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
          <div><label className="ros-label">Project (wiki slug)</label><Input mono defaultValue="project-eve-humanoid-robot" /></div>
          <div><label className="ros-label">Budget category</label><Input mono defaultValue="robotics-rd" /></div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 22 }}>
          <Button variant="outline" onClick={() => nav("results")}><Icon name="arrow-left" size={14} /> Back</Button>
          <Button variant="brand" disabled={chosen.length === 0} onClick={() => setSaved(true)}>
            <Icon name="check" size={15} /> Write Decision to Wiki
          </Button>
        </div>
      </div>
    );
  }

  window.ROSScreens = { AppShell, DashboardScreen, NewResearchScreen, SessionDetailScreen, GapsScreen, ResultsScreen, DecisionScreen };
})();
