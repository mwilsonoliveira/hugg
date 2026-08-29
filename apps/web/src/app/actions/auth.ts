"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { LoginInput, RegisterUserInput } from "@hugg/schemas";
import { AUTH_COOKIE, AUTH_COOKIE_OPTIONS, login, register } from "@/server/auth";
import { AppError } from "@/server/errors";

export async function loginAction(data: LoginInput): Promise<{ error: string } | never> {
  try {
    const { token } = await login(data);
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE, token, AUTH_COOKIE_OPTIONS);
  } catch (error) {
    return { error: error instanceof AppError ? error.message : "Não foi possível entrar. Tente novamente." };
  }
  redirect("/");
}

export async function registerAction(data: RegisterUserInput): Promise<{ error: string } | never> {
  try {
    const { token } = await register(data);
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE, token, AUTH_COOKIE_OPTIONS);
  } catch (error) {
    return { error: error instanceof AppError ? error.message : "Não foi possível criar a conta." };
  }
  redirect("/");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
  redirect("/login");
}
