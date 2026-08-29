#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";

const STATUSES = new Set([
  "draft",
  "approved",
  "planned",
  "ready",
  "implementing",
  "done",
  "superseded",
]);
const TRACKS = new Set(["standard", "fast"]);
const STANDARD_PLAN_STATUSES = new Set(["planned", "ready", "implementing", "done"]);
const STANDARD_EXECUTION_STATUSES = new Set(["ready", "implementing", "done"]);

const FOUNDATION_FILES = [
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

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return null;

  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const entry = line.match(/^([a-zA-Z][\w-]*):\s*(.*?)\s*$/);
    if (!entry) continue;
    data[entry[1]] = entry[2].replace(/^(["'])(.*)\1$/, "$2");
  }
  return data;
}

function declarations(content, kindPattern) {
  const matcher = new RegExp(`^\\s*-\\s*(${kindPattern}-\\d{3}):`, "gm");
  return [...content.matchAll(matcher)].map((match) => match[1]);
}

function duplicates(values) {
  const seen = new Set();
  const repeated = new Set();
  for (const value of values) {
    if (seen.has(value)) repeated.add(value);
    seen.add(value);
  }
  return [...repeated];
}

function read(root, relativePath) {
  return readFileSync(resolve(root, relativePath), "utf8");
}

function allMarkdownFiles(directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const target = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...allMarkdownFiles(target));
    else if (entry.isFile() && entry.name.endsWith(".md")) files.push(target);
  }
  return files;
}

export function validateRepository(rootDirectory) {
  const root = resolve(rootDirectory);
  const errors = [];
  const add = (path, message) => errors.push({ path, message });

  for (const path of FOUNDATION_FILES) {
    if (!existsSync(resolve(root, path))) add(path, "arquivo obrigatório da fundação SDD ausente");
  }

  const specsRoot = resolve(root, "specs");
  if (!existsSync(specsRoot)) {
    add("specs", "diretório de especificações ausente");
    return errors;
  }

  const featureNames = readdirSync(specsRoot).filter((name) => {
    const target = resolve(specsRoot, name);
    return statSync(target).isDirectory();
  });

  for (const featureName of featureNames) {
    const featurePath = `specs/${featureName}`;
    const featureDirectory = resolve(root, featurePath);
    if (!/^\d{3}-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(featureName)) {
      add(featurePath, "o diretório deve seguir NNN-kebab-case");
      continue;
    }

    const specPath = `${featurePath}/spec.md`;
    if (!existsSync(resolve(root, specPath))) {
      add(specPath, "spec.md ausente");
      continue;
    }

    const spec = read(root, specPath);
    const metadata = parseFrontmatter(spec);
    if (!metadata) {
      add(specPath, "frontmatter YAML ausente ou inválido");
      continue;
    }

    for (const field of ["id", "title", "status", "track", "created", "updated"]) {
      if (!metadata[field]) add(specPath, `campo obrigatório ausente no frontmatter: ${field}`);
    }

    const directoryId = featureName.slice(0, 3);
    if (metadata.id && metadata.id !== directoryId) {
      add(specPath, `id ${metadata.id} não corresponde ao diretório ${directoryId}`);
    }
    if (metadata.status && !STATUSES.has(metadata.status)) {
      add(specPath, `status inválido: ${metadata.status}`);
    }
    if (metadata.track && !TRACKS.has(metadata.track)) {
      add(specPath, `track inválido: ${metadata.track}`);
    }
    for (const field of ["created", "updated"]) {
      if (metadata[field] && !/^\d{4}-\d{2}-\d{2}$/.test(metadata[field])) {
        add(specPath, `${field} deve usar YYYY-MM-DD`);
      }
    }

    const functional = declarations(spec, "FR");
    const nonFunctional = declarations(spec, "NFR");
    const success = declarations(spec, "SC");
    if (functional.length === 0) add(specPath, "declare ao menos um requisito FR-###");
    if (success.length === 0) add(specPath, "declare ao menos um critério SC-###");
    for (const repeated of duplicates([...functional, ...nonFunctional, ...success])) {
      add(specPath, `ID declarado mais de uma vez: ${repeated}`);
    }

    const status = metadata.status;
    const track = metadata.track;
    const planPath = `${featurePath}/plan.md`;
    const tasksPath = `${featurePath}/tasks.md`;
    const checklistPath = `${featurePath}/checklists/requirements.md`;

    if (track === "standard" && STANDARD_PLAN_STATUSES.has(status)) {
      if (!existsSync(resolve(root, planPath))) {
        add(planPath, `plan.md é obrigatório no status ${status}`);
      } else {
        const plan = read(root, planPath);
        for (const requirement of [...functional, ...nonFunctional]) {
          if (!plan.includes(requirement)) add(planPath, `rastreabilidade ausente para ${requirement}`);
        }
      }
    }

    if (track === "standard" && STANDARD_EXECUTION_STATUSES.has(status)) {
      if (!existsSync(resolve(root, tasksPath))) {
        add(tasksPath, `tasks.md é obrigatório no status ${status}`);
      } else {
        const tasks = read(root, tasksPath);
        const taskIds = [...tasks.matchAll(/^\s*- \[[ xX]\]\s+(T\d{3})\b/gm)].map((match) => match[1]);
        if (taskIds.length === 0) add(tasksPath, "nenhuma tarefa T### encontrada");
        for (const repeated of duplicates(taskIds)) add(tasksPath, `tarefa duplicada: ${repeated}`);
        for (const requirement of [...functional, ...nonFunctional]) {
          if (!tasks.includes(requirement)) add(tasksPath, `nenhuma tarefa referencia ${requirement}`);
        }
      }
      if (!existsSync(resolve(root, checklistPath))) {
        add(checklistPath, `checklist é obrigatório no status ${status}`);
      }
    }

    if (status === "done") {
      for (const markdownPath of allMarkdownFiles(featureDirectory)) {
        const content = readFileSync(markdownPath, "utf8");
        if (/^- \[ \]/m.test(content)) {
          add(markdownPath.slice(root.length + 1), "feature done possui checkbox pendente");
        }
      }
      if (/Decisão:\s*pendente/i.test(spec)) add(specPath, "feature done possui aprovação pendente");
      if (existsSync(resolve(root, planPath))) {
        const plan = read(root, planPath);
        if (/Decisão:\s*pendente/i.test(plan)) add(planPath, "feature done possui aprovação pendente");
      }
    }
  }

  return errors;
}

function runCli() {
  const root = process.argv[2] ? resolve(process.argv[2]) : process.cwd();
  const errors = validateRepository(root);
  if (errors.length > 0) {
    console.error(`SDD inválido: ${errors.length} problema(s).`);
    for (const error of errors) console.error(`- ${error.path}: ${error.message}`);
    process.exitCode = 1;
    return;
  }
  console.log(`SDD válido em ${basename(root)}.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) runCli();

