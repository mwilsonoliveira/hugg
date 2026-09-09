'use client';

import { FcGoogle } from 'react-icons/fc';
import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, registerUserSchema, type RegisterUserInput, type AuthIntent } from '@hugg/schemas';
import { authenticateAction, confirmGoogleLinkAction, cancelAuthFlowAction } from '@/app/actions/auth';
import { HuggLogo } from './hugg-logo';
import { safeReturnTo } from '@/lib/auth-navigation';

export type AuthView = 'choice' | 'login' | 'register' | 'link';
export interface AuthPanelProps {
  intent: AuthIntent;
  next: string;
  source: string;
  googleEnabled: boolean;
  initialView?: AuthView;
  initialError?: string;
  linkEmail?: string;
  imageUrl?: string;
  onSuccess: (next: string) => void;
  testCredentials?: { email: string; password: string };
}
export const authTitles: Record<AuthIntent, string> = {
  create: 'Entre no Hugg para cadastrar um animal',
  edit: 'Entre no Hugg para editar esse pet',
  'sign-in': 'Entre no Hugg',
};
export function authFeedback(value: string | null) {
  if (value === 'google-cancelled') return 'O acesso com Google foi cancelado. Você pode tentar novamente ou usar e-mail.';
  if (value === 'google-error') return 'Não foi possível entrar com Google. Tente novamente ou use e-mail.';
  return undefined;
}

export function AuthPanel(props: AuthPanelProps) {
  const [view, setView] = useState<AuthView>(props.initialView ?? 'choice');
  const [error, setError] = useState(props.initialError);
  const [busy, setBusy] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<RegisterUserInput>({ resolver: zodResolver(view === 'register' ? registerUserSchema : loginSchema) });
  useEffect(() => { heading.current?.focus(); }, [view]);
  const changeView = (next: AuthView) => { setError(undefined); setView(next); };
  const submit = handleSubmit(async data => {
    setBusy(true); setError(undefined);
    try {
      const result = await authenticateAction(view === 'register' ? 'register' : 'login', data);
      if ('error' in result) setError(result.error);
      else props.onSuccess(safeReturnTo(props.next));
    } catch { setError('Não foi possível conectar. Tente novamente.'); }
    finally { setBusy(false); }
  });
  const googleHref = '/api/auth/google?' + new URLSearchParams({ next: safeReturnTo(props.next), source: props.source, intent: props.intent });
  const inputClass = 'w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400';
  const primaryClass = 'w-full rounded-full bg-orange-500 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500 focus-visible:outline-offset-2';
  const showMethods = view === 'choice' || view === 'login';
  return (
    <div className="px-6 py-8 sm:px-10 sm:py-10">
      <div className="mb-5 flex justify-center">
        {props.imageUrl ? <img src={props.imageUrl} alt="" className="h-20 w-16 rounded-xl object-cover" /> : <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50"><HuggLogo className="h-9 w-9 text-orange-500" /></div>}
      </div>
      <h2 id="auth-modal-title" ref={heading} tabIndex={-1} className="text-center text-2xl font-bold leading-tight text-gray-900 outline-none">{view === 'register' ? 'Crie sua conta no Hugg' : view === 'link' ? 'Confirme sua conta' : authTitles[props.intent]}</h2>
      <p id="auth-modal-description" className="mt-3 text-center text-sm text-gray-600">{view === 'link' ? `Já existe uma conta para ${props.linkEmail ?? 'este e-mail'}. Confirme sua senha para vinculá-la ao Google.` : 'Ajude milhares de pets a encontrarem um lar'}</p>
      <div className="mt-7 space-y-3">
        {view === 'choice' && <button type="button" className={primaryClass} onClick={() => changeView('register')}>Continuar com e-mail</button>}
        {(view === 'register' || view === 'login') && <form onSubmit={submit} className="space-y-4" noValidate>
          {view === 'register' && <label className="block text-sm font-medium text-gray-700">Nome<input autoComplete="name" {...register('name')} className={`${inputClass} mt-1`} aria-invalid={!!errors.name} />{errors.name && <span className="text-xs text-red-600">{errors.name.message}</span>}</label>}
          <label className="block text-sm font-medium text-gray-700">E-mail<input type="email" autoComplete="email" {...register('email')} className={`${inputClass} mt-1`} aria-invalid={!!errors.email} />{errors.email && <span className="text-xs text-red-600">{errors.email.message}</span>}</label>
          <label className="block text-sm font-medium text-gray-700">Senha<input type="password" autoComplete={view === 'register' ? 'new-password' : 'current-password'} {...register('password')} className={`${inputClass} mt-1`} aria-invalid={!!errors.password} />{errors.password && <span className="text-xs text-red-600">{errors.password.message}</span>}</label>
          {view === 'register' && <p className="text-xs text-gray-500">Use uma senha com pelo menos 8 caracteres.</p>}
          {props.testCredentials && view === 'login' && <button type="button" className="text-xs text-orange-700 underline" onClick={() => { setValue('email', props.testCredentials!.email); setValue('password', props.testCredentials!.password); }}>Preencher credenciais de teste local</button>}
          <button className={primaryClass} disabled={busy}>{busy ? 'Aguarde...' : view === 'register' ? 'Criar conta' : 'Entrar'}</button>
        </form>}
        {view === 'link' && <form className="space-y-4" onSubmit={async event => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setBusy(true); setError(undefined);
          try {
            const result = await confirmGoogleLinkAction({ password: data.get('password') });
            if ('error' in result) setError(result.error); else props.onSuccess(result.next);
          } catch { setError('Não foi possível conectar. Tente novamente.'); }
          finally { setBusy(false); }
        }}>
          <label className="block text-sm font-medium text-gray-700">Senha da sua conta<input name="password" type="password" autoComplete="current-password" required maxLength={1024} className={`${inputClass} mt-1`} /></label>
          <button className={primaryClass} disabled={busy}>{busy ? 'Confirmando...' : 'Confirmar e vincular Google'}</button>
        </form>}
        {showMethods && <>
          {props.googleEnabled ? <a href={googleHref} aria-disabled={busy} onClick={event => { if (busy) event.preventDefault(); }} className="flex w-full items-center justify-center gap-3 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"><FcGoogle aria-hidden="true" size={20} />Continuar com Google</a> : <><button type="button" disabled className="w-full rounded-full border border-gray-200 px-4 py-3 text-sm text-gray-400">Continuar com Google</button><p className="text-center text-xs text-gray-500">Google indisponível no momento. Continue com e-mail.</p></>}
        </>}
        {error && <p role="alert" className="text-center text-sm text-red-600">{error}</p>}
      </div>
      <div className="mt-6 space-y-3 text-center text-sm text-gray-600">
        {(view === 'choice' || view === 'register') && <p>Já tem uma conta? <button type="button" disabled={busy} className="font-semibold text-gray-900 hover:underline" onClick={() => changeView('login')}>Entrar</button></p>}
        {view === 'login' && <p>Ainda não tem conta? <button type="button" disabled={busy} className="font-semibold text-gray-900 hover:underline" onClick={() => changeView('register')}>Criar conta</button></p>}
        {view !== 'choice' && <button type="button" disabled={busy} className="text-gray-500 hover:underline" onClick={async () => {
          if (view === 'link') {
            setBusy(true);
            try { await cancelAuthFlowAction(); }
            catch { setError('Não foi possível voltar. Tente novamente.'); return; }
            finally { setBusy(false); }
          }
          changeView('choice');
        }}>Voltar</button>}
      </div>
    </div>
  );
}
