/* ResearchOS UI kit — router + mount. */

(function () {
  const { useState } = window.ROS;
  const S = window.ROSScreens;

  function App() {
    const [route, setRoute] = useState("dashboard");
    const [empty, setEmpty] = useState(false);
    const [goal, setGoal] = useState("upgrade my robotics fab setup to build tendon-driven actuators");
    const [budget, setBudget] = useState("4200");
    const [selectedNeeds, setSelectedNeeds] = useState(new Set(["n1", "n2", "n3"]));
    const [selectedProducts, setSelectedProducts] = useState(new Set(["p1", "p4", "p6"]));

    const nav = (r) => { setRoute(r); window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" }); };

    let screen;
    switch (route) {
      case "new": screen = <S.NewResearchScreen nav={nav} goal={goal} setGoal={setGoal} budget={budget} setBudget={setBudget} />; break;
      case "detail": screen = <S.SessionDetailScreen nav={nav} />; break;
      case "gaps": screen = <S.GapsScreen nav={nav} selectedNeeds={selectedNeeds} setSelectedNeeds={setSelectedNeeds} />; break;
      case "results": screen = <S.ResultsScreen nav={nav} selectedNeeds={selectedNeeds} selectedProducts={selectedProducts} setSelectedProducts={setSelectedProducts} />; break;
      case "decision": screen = <S.DecisionScreen nav={nav} selectedProducts={selectedProducts} />; break;
      default: screen = <S.DashboardScreen nav={nav} empty={empty} setEmpty={setEmpty} />;
    }
    return <S.AppShell route={route} nav={nav}>{screen}</S.AppShell>;
  }

  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
})();
