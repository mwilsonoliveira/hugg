"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { LoginInput, RegisterUserInput } from "@hugg/schemas";
import { AUTH_COOKIE, AUTH_COOKIE_OPTIONS, login, register } from "@/server/auth";
import { safeReturnTo } from "@/lib/auth-navigation";
import { AppError } from "@/server/errors";

function logAuthFailure(operation: "login" | "register", error: unknown) {
  if (error instanceof AppError) return;
  console.error("[auth] unexpected server action failure", {
    operation,
    errorName: error instanceof Error ? error.name : "UnknownError",
    errorMessage: error instanceof Error ? error.message : String(error),
  });
}

export async function loginAction(data: LoginInput, next?: string): Promise<{ error: string } | never> {
  try {
    const { token } = await login(data);
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE, token, AUTH_COOKIE_OPTIONS);
  } catch (error) {
    logAuthFailure("login", error);
    return { error: error instanceof AppError ? error.message : "Não foi possível entrar. Tente novamente." };
  }
  redirect(safeReturnTo(next));
}

export async function registerAction(data: RegisterUserInput, next?: string): Promise<{ error: string } | never> {
  try {
    const { token } = await register(data);
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE, token, AUTH_COOKIE_OPTIONS);
  } catch (error) {
    logAuthFailure("register", error);
    return { error: error instanceof AppError ? error.message : "Não foi possível criar a conta." };
  }
  redirect(safeReturnTo(next));
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
  redirect("/");
}

export async function authenticateAction(mode: 'login' | 'register', data: LoginInput | RegisterUserInput): Promise<{ ok: true } | { error: string }> {
  try {
    const result = mode === 'register' ? await register(data as RegisterUserInput) : await login(data);
    cookies().set(AUTH_COOKIE, result.token, AUTH_COOKIE_OPTIONS);
    await cancelAuthFlowAction();
    return { ok: true };
  } catch (error) {
    logAuthFailure(mode, error);
    return { error: error instanceof AppError ? error.message : 'Não foi possível continuar. Tente novamente.' };
  }
}

export async function confirmGoogleLinkAction(data: unknown): Promise<{ ok: true; next: string } | { error: string }> {
  try {
    const { googleLinkSchema } = await import('@hugg/schemas');
    const parsed = googleLinkSchema.safeParse(data);
    if (!parsed.success) return { error: 'Informe sua senha.' };
    const { readAuthFlow } = await import('@/server/google-auth');
    const { confirmGoogleLink } = await import('@/server/google-accounts');
    const { FLOW_COOKIE } = await import('@/server/auth-flow');
    const flow = readAuthFlow();
    if (!flow || flow.phase !== 'link') return { error: 'A confirmação expirou. Continue com Google novamente.' };
    const result = await confirmGoogleLink(flow, parsed.data.password);
    cookies().set(AUTH_COOKIE, result.token, AUTH_COOKIE_OPTIONS);
    cookies().delete(FLOW_COOKIE);
    return { ok: true, next: safeReturnTo(flow.next) };
  } catch (error) {
    return { error: error instanceof AppError ? error.message : 'Não foi possível vincular sua conta. Tente novamente.' };
  }
}

export async function cancelAuthFlowAction() {
  const { readAuthFlow } = await import('@/server/google-auth');
  const { FLOW_COOKIE } = await import('@/server/auth-flow');
  const { prisma } = await import('@hugg/database');
  const flow = readAuthFlow();
  cookies().delete(FLOW_COOKIE);
  if (flow) await prisma.authAttempt.deleteMany({ where: { id: flow.id } });
}
