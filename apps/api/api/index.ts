import type { IncomingMessage, ServerResponse } from "http";
import app from "../src/app";

let isReady = false;

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (!isReady) {
    await app.ready();
    isReady = true;
  }
  app.server.emit("request", req, res);
}
