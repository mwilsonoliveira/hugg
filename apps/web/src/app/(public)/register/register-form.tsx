"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUserSchema, type RegisterUserInput } from "@hugg/schemas";
import { registerAction } from "@/app/actions/auth";
import { FaPaw } from "react-icons/fa";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

interface RegisterFormProps {
  petImages?: [string?, string?, string?];
}

export function RegisterForm({ petImages = [] }: RegisterFormProps) {
  const [leftUrl, centerUrl, rightUrl] = petImages;
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterUserInput>({
    resolver: zodResolver(registerUserSchema),
  });

  const onSubmit = async (data: RegisterUserInput) => {
    setError(null);
    const result = await registerAction(data);
    if (result?.error) setError(result.error);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {(leftUrl || centerUrl || rightUrl) && (
          <div className="flex justify-center items-end mb-[-2.5rem]">
            <div className={`relative z-0 translate-x-5 transition-opacity ${leftUrl ? "opacity-100" : "opacity-0"}`}>
              <div className="w-14 h-14 rounded-full border-4 border-white shadow-sm overflow-hidden bg-gray-100">
                {leftUrl && <img src={leftUrl} alt="Pet" className="w-full h-full object-cover" />}
              </div>
            </div>
            <div className="relative z-10">
              <div className="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100">
                {centerUrl && <img src={centerUrl} alt="Pet" className="w-full h-full object-cover" />}
              </div>
            </div>
            <div className={`relative z-0 -translate-x-5 transition-opacity ${rightUrl ? "opacity-100" : "opacity-0"}`}>
              <div className="w-14 h-14 rounded-full border-4 border-white shadow-sm overflow-hidden bg-gray-100">
                {rightUrl && <img src={rightUrl} alt="Pet" className="w-full h-full object-cover" />}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 pt-14">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-1.5">
              hugg <FaPaw className="w-5 h-5 -rotate-6 text-orange-500" />
            </h1>
            <p className="text-sm text-gray-500 mt-1">Crie sua conta e encontre um novo amigo.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Nome completo
              </label>
              <input
                id="name"
                type="text"
                placeholder="Seu nome"
                {...register("name")}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

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
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Telefone <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="(00) 00000-0000"
                {...register("phone")}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  {...register("password")}
                  className="w-full px-3 py-2 pr-10 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

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
              {isSubmitting ? "Criando conta..." : "Criar conta"}
            </button>

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">ou</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <a
              href={`${API_URL}/api/auth/google`}
              className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-700 text-sm font-medium py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continuar com Google
            </a>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-orange-500 hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
