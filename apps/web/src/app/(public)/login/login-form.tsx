"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@hugg/schemas";
import { loginAction } from "@/app/actions/auth";
import { FaPaw } from "react-icons/fa";

interface LoginFormProps {
  petImages?: [string?, string?, string?];
}

export function LoginForm({ petImages = [] }: LoginFormProps) {
  const [leftUrl, centerUrl, rightUrl] = petImages;
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setError(null);
    const result = await loginAction(data);
    if (result?.error) setError(result.error);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {(leftUrl || centerUrl || rightUrl) && (
          <div className="flex justify-center items-end mb-[-2.5rem]">
            {/* Esquerda */}
            <div className={`relative z-0 translate-x-5 transition-opacity ${leftUrl ? "opacity-100" : "opacity-0"}`}>
              <div className="w-14 h-14 rounded-full border-4 border-white shadow-sm overflow-hidden bg-gray-100">
                {leftUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={leftUrl} alt="Pet" className="w-full h-full object-cover" />
                )}
              </div>
            </div>

            {/* Centro */}
            <div className="relative z-10">
              <div className="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100">
                {centerUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={centerUrl} alt="Pet" className="w-full h-full object-cover" />
                )}
              </div>
            </div>

            {/* Direita */}
            <div className={`relative z-0 -translate-x-5 transition-opacity ${rightUrl ? "opacity-100" : "opacity-0"}`}>
              <div className="w-14 h-14 rounded-full border-4 border-white shadow-sm overflow-hidden bg-gray-100">
                {rightUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={rightUrl} alt="Pet" className="w-full h-full object-cover" />
                )}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 pt-14">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-1.5">
              hugg <FaPaw className="w-5 h-5 -rotate-6 text-orange-500" />
            </h1>
            <p className="text-sm text-gray-500 mt-1">Entre na sua conta para continuar.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                {...register("email")}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting && (
                <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">
            Ainda não tem conta?{" "}
            <a href="#" className="text-orange-500 hover:underline">
              Criar conta
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
