from __future__ import annotations

import json
import re
from pathlib import Path

from jinja2 import Environment, FileSystemLoader

from core.models import Decision, ProductCard, ResearchSession


class WikiWriter:
    def __init__(self, wiki_path: str, template_dir: str):
        self.wiki_path = Path(wiki_path)
        self.env = Environment(
            loader=FileSystemLoader(template_dir),
            keep_trailing_newline=True,
        )

    def generate_decision_page(
        self,
        session: ResearchSession,
        decision: Decision,
        all_products: list[ProductCard],
    ) -> str:
        template = self.env.get_template("decision.md.j2")
        title = self._make_title(decision)
        summary = self._make_summary(decision)
        needs_addressed_yaml = json.dumps(decision.needs_addressed)

        return template.render(
            session=session,
            decision=decision,
            all_products=all_products,
            title=title,
            summary=summary,
            needs_addressed_yaml=needs_addressed_yaml,
            needs_addressed=decision.needs_addressed,
        )

    def write_decision_page(
        self,
        session: ResearchSession,
        decision: Decision,
        all_products: list[ProductCard],
    ) -> Path:
        content = self.generate_decision_page(session, decision, all_products)
        slug = re.sub(r"[^a-z0-9]+", "-", decision.needs_addressed[0].lower()) if decision.needs_addressed else "misc"
        filename = f"decision-{decision.decision_date}-{slug}.md"
        path = self.wiki_path / filename
        path.write_text(content, encoding="utf-8")
        return path

    def _make_title(self, decision: Decision) -> str:
        if decision.selected_products:
            return decision.selected_products[0].name
        return "Purchase Decision"

    def _make_summary(self, decision: Decision) -> str:
        names = [p.name for p in decision.selected_products[:3]]
        return f"Selected {", ".join(names)} for {", ".join(decision.needs_addressed)}."
