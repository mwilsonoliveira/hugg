import assert from "node:assert/strict";
import test from "node:test";
import { normalizeSearchText } from "./normalize";

test("normaliza caixa, espaços e acentos para busca no SQLite", () => {
  assert.equal(normalizeSearchText("  São Bernardo  "), "sao bernardo");
  assert.equal(normalizeSearchText("DÁLMATA"), "dalmata");
});

test("mantém ausência de valor como null", () => {
  assert.equal(normalizeSearchText(undefined), null);
  assert.equal(normalizeSearchText(null), null);
  assert.equal(normalizeSearchText(""), null);
});
