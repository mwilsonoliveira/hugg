"use client";

import { useState, useRef } from "react";
import { verifyOtpAction, resendOtpAction } from "@/app/actions/auth";
import { FaPaw } from "react-icons/fa";
import Link from "next/link";

interface Props {
  email: string;
}

export function VerifyEmailForm({ email }: Props) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [resendMsg, setResendMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...digits];
    next[index] = value.slice(-1);
    setDigits(next);
    if (value && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(""));
      inputs.current[5]?.focus();
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < 6) return;
    setError(null);
    setIsSubmitting(true);
    const result = await verifyOtpAction({ email, code });
    if (result?.error) {
      setError(result.error);
      setIsSubmitting(false);
    }
  };

  const onResend = async () => {
    setResendMsg(null);
    setError(null);
    setIsResending(true);
    const result = await resendOtpAction(email);
    setIsResending(false);
    if (result.error) setError(result.error);
    else setResendMsg("Novo código enviado para seu e-mail.");
  };

  const code = digits.join("");

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-1.5">
              hugg <FaPaw className="w-5 h-5 -rotate-6 text-orange-500" />
            </h1>
            <p className="text-sm text-gray-700 mt-3 font-medium">Confirme seu e-mail</p>
            <p className="text-sm text-gray-500 mt-1">
              Enviamos um código de 6 dígitos para{" "}
              <span className="font-medium text-gray-700">{email}</span>
            </p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-6">
            <div className="flex justify-center gap-2" onPaste={handlePaste}>
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-11 h-12 text-center text-lg font-semibold border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
              ))}
            </div>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            {resendMsg && <p className="text-sm text-green-600 text-center">{resendMsg}</p>}

            <button
              type="submit"
              disabled={isSubmitting || code.length < 6}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting && (
                <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
              {isSubmitting ? "Verificando..." : "Confirmar"}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-gray-400">
            Não recebeu o código?{" "}
            <button
              onClick={onResend}
              disabled={isResending}
              className="text-orange-500 hover:underline disabled:opacity-60"
            >
              {isResending ? "Enviando..." : "Reenviar"}
            </button>
          </p>

          <p className="mt-3 text-center text-xs text-gray-400">
            <Link href="/login" className="text-orange-500 hover:underline">
              Voltar ao login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
