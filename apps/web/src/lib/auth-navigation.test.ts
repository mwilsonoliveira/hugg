import assert from "node:assert/strict";
import test from "node:test";
import { loginHref, safeReturnTo } from "./auth-navigation";

test("preserva destinos das páginas do site, inclusive query e fragmento", () => {
  for (const path of ["/", "/?search=gato", "/pets/new", "/pets/abc-123", "/pets/abc-123/edit", "/pets/new?from=home#form"]) {
    assert.equal(safeReturnTo(path), path);
    const login = new URL(loginHref(path), "https://hugg.test");
    assert.equal(login.pathname, "/login");
    assert.equal(login.searchParams.get("next"), path);
  }
});

test("rejeita redirecionamentos externos, caminhos ambíguos e rotas fora do site", () => {
  for (const path of [undefined, null, ["/pets/new"], "", "https://evil.test", "//evil.test", "/\\evil.test", "/%2f%2fevil.test", "/pets/%2e%2e/login", "/pets/../login", "/pets/abc%2fedit", "/login?next=/pets/new", "/api/auth/me", "/health", "/maintenance", "/profile", "/home", "/pets/abc/delete", "/pets/abc\n/edit"]) {
    assert.equal(safeReturnTo(path), "/", String(path));
  }
});
