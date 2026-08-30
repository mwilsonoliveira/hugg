import assert from "node:assert/strict";
import test from "node:test";
import {
  getGeolocationErrorMessage,
  reduceMapLoadStatus,
} from "./location-picker-state";

test("representa carregamento, sucesso, falha e nova tentativa do mapa", () => {
  assert.equal(reduceMapLoadStatus("loading", "loaded"), "ready");
  assert.equal(reduceMapLoadStatus("loading", "failed"), "error");
  assert.equal(reduceMapLoadStatus("error", "retry"), "loading");
});

test("distingue os códigos de falha da geolocalização", () => {
  assert.match(getGeolocationErrorMessage(1), /Permissão negada/);
  assert.match(getGeolocationErrorMessage(2), /não está disponível/);
  assert.match(getGeolocationErrorMessage(3), /demorou demais/);
  assert.match(getGeolocationErrorMessage(99), /Não foi possível/);
});
