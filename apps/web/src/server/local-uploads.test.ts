import assert from "node:assert/strict";
import test from "node:test";
import {
  MAX_LOCAL_UPLOAD_BYTES,
  createLocalUploadName,
  isValidLocalUploadName,
  localUploadPath,
  validateLocalUpload,
} from "./local-uploads";

test("aceita apenas imagens suportadas dentro do limite", () => {
  assert.doesNotThrow(() => validateLocalUpload({ type: "image/jpeg", size: MAX_LOCAL_UPLOAD_BYTES }));
  assert.throws(() => validateLocalUpload({ type: "image/gif", size: 10 }), /Formato/);
  assert.throws(() => validateLocalUpload({ type: "image/png", size: MAX_LOCAL_UPLOAD_BYTES + 1 }), /5 MB/);
});

test("gera nomes seguros e rejeita path traversal", () => {
  const name = createLocalUploadName("image/webp");
  assert.equal(isValidLocalUploadName(name), true);
  assert.equal(isValidLocalUploadName("../../secret.webp"), false);
  assert.throws(() => localUploadPath("../../secret.webp"), /inválido/);
});
