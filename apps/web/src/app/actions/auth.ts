"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { LoginInput, RegisterUserInput } from "@hugg/schemas";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

export async function loginAction(data: LoginInput) {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch {
    throw new Error("Não foi possível conectar ao servidor. Tente novamente.");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Credenciais inválidas");
  }

  const { token } = await res.json();
  const cookieStore = await cookies();
  cookieStore.set("token", token, COOKIE_OPTIONS);
  redirect("/");
}

export async function registerAction(data: RegisterUserInput) {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch {
    throw new Error("Não foi possível conectar ao servidor. Tente novamente.");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Erro ao criar conta");
  }

  const { token } = await res.json();
  const cookieStore = await cookies();
  cookieStore.set("token", token, COOKIE_OPTIONS);
  redirect("/");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  redirect("/login");
}
