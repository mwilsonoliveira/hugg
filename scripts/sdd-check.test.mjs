import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { validateRepository } from "./sdd-check.mjs";

const foundation = [
  "AGENTS.md",
  ".specify/memory/constitution.md",
  ".specify/templates/spec-template.md",
  ".specify/templates/plan-template.md",
  ".specify/templates/tasks-template.md",
  ".specify/templates/requirements-checklist-template.md",
  ".agents/skills/hugg-sdd/SKILL.md",
  "docs/context/product.md",
  "docs/context/architecture.md",
  "specs/README.md",
];

function put(root, path, content = "# fixture\n") {
  const target = join(root, path);
  mkdirSync(join(target, ".."), { recursive: true });
  writeFileSync(target, content);
}

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "hugg-sdd-"));
  for (const path of foundation) put(root, path);
  return root;
}

function spec({ status = "done", track = "standard" } = {}) {
  return `---
id: "001"
title: "Fixture"
status: ${status}
track: ${track}
created: 2026-08-29
updated: 2026-08-29
---
# Spec
- FR-001: O sistema deve validar a fixture.
- NFR-001: O sistema deve informar falhas.
- SC-001: A validação deve terminar sem erros.
- Decisão: aprovada
`;
}

function validStandard(root, status = "done") {
  put(root, "specs/001-fixture/spec.md", spec({ status }));
  put(root, "specs/001-fixture/plan.md", "# Plano\nFR-001 NFR-001\n- Decisão: aprovada\n");
  put(root, "specs/001-fixture/tasks.md", "# Tarefas\n- [x] T001 [FR-001,NFR-001] Validar fixture.\n");
  put(root, "specs/001-fixture/checklists/requirements.md", "# Checklist\n- [x] Validado.\n");
}

test("aceita uma feature standard concluída e rastreável", () => {
  const root = fixture();
  validStandard(root);
  assert.deepEqual(validateRepository(root), []);
});

test("aceita uma feature fast concluída apenas com spec", () => {
  const root = fixture();
  put(root, "specs/001-fixture/spec.md", spec({ track: "fast" }));
  assert.deepEqual(validateRepository(root), []);
});

test("exige plano quando uma feature standard está planned", () => {
  const root = fixture();
  put(root, "specs/001-fixture/spec.md", spec({ status: "planned" }));
  assert(validateRepository(root).some((error) => error.path.endsWith("plan.md")));
});

test("detecta requisito sem rastreabilidade nas tarefas", () => {
  const root = fixture();
  validStandard(root, "ready");
  put(root, "specs/001-fixture/tasks.md", "# Tarefas\n- [ ] T001 [FR-001] Parcial.\n");
  assert(validateRepository(root).some((error) => error.message.includes("NFR-001")));
});

test("rejeita checkbox pendente em feature done", () => {
  const root = fixture();
  validStandard(root);
  put(root, "specs/001-fixture/checklists/requirements.md", "# Checklist\n- [ ] Pendente.\n");
  assert(validateRepository(root).some((error) => error.message.includes("checkbox pendente")));
});

test("rejeita diretório fora de NNN-kebab-case", () => {
  const root = fixture();
  put(root, "specs/feature_invalida/spec.md", spec());
  assert(validateRepository(root).some((error) => error.message.includes("NNN-kebab-case")));
});

