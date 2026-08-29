import { NextResponse } from "next/server";
import { AppError } from "./errors";

export function routeError(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message, ...(error.details ? { details: error.details } : {}) },
      { status: error.status },
    );
  }

  console.error(error);
  return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
}
