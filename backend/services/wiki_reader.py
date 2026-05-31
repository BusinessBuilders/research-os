from __future__ import annotations

import re
from pathlib import Path


class WikiReader:
    def __init__(self, wiki_path: str):
        self.wiki_path = Path(wiki_path)

    def read_equipment_inventory(self) -> str:
        path = self.wiki_path / "entity-equipment-inventory.md"
        if not path.exists():
            return ""
        text = path.read_text(encoding="utf-8")
        stripped = re.sub(r"^---\n.*?\n---\n", "", text, flags=re.DOTALL)
        return stripped.strip()

    def read_project_page(self, slug: str) -> str:
        path = self.wiki_path / f"{slug}.md"
        if not path.exists():
            return ""
        text = path.read_text(encoding="utf-8")
        stripped = re.sub(r"^---\n.*?\n---\n", "", text, flags=re.DOTALL)
        return stripped.strip()

    def list_decision_pages(self) -> list[dict]:
        decisions = []
        for path in sorted(self.wiki_path.glob("decision-*.md"), reverse=True):
            decisions.append({"slug": path.stem, "path": str(path)})
        return decisions[:50]

    def list_project_pages(self) -> list[str]:
        return [p.stem for p in self.wiki_path.glob("project-*.md")]
