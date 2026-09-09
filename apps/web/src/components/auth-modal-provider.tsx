'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authIntentSchema, type AuthIntent } from '@hugg/schemas';
import { cancelAuthFlowAction } from '@/app/actions/auth';
import { safeReturnTo } from '@/lib/auth-navigation';
import { AuthPanel, authFeedback, type AuthView } from './auth-panel';

interface AuthRequest { intent: AuthIntent; next: string; view?: AuthView; imageUrl?: string }
type OpenAuthRequest = AuthRequest & { source: string; error?: string };
const AuthModalContext = createContext<{ authenticated: boolean; open: (request: AuthRequest) => void } | null>(null);
export const useAuthModal = () => useContext(AuthModalContext);
export function AuthModalProvider({ children, authenticated, googleEnabled, linkEmail }: { children: ReactNode; authenticated: boolean; googleEnabled: boolean; linkEmail?: string }) {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const [request, setRequest] = useState<OpenAuthRequest | null>(null);
  const activeRequest = useRef<OpenAuthRequest | null>(null);
  const show = (value: OpenAuthRequest) => { activeRequest.current = value; setRequest(value); };
  const open = (next: AuthRequest) => {
    trigger.current = document.activeElement as HTMLElement;
    show({ ...next, next: safeReturnTo(next.next), source: location.pathname + location.search + location.hash });
  };
  useEffect(() => {
    const url = new URL(location.href);
    const feedback = url.searchParams.get('auth');
    if (!feedback) return;
    const next = safeReturnTo(url.searchParams.get('next'));
    const intent = authIntentSchema.catch('sign-in').parse(url.searchParams.get('intent'));
    url.searchParams.delete('auth'); url.searchParams.delete('next'); url.searchParams.delete('intent');
    history.replaceState(history.state, '', url.pathname + url.search + url.hash);
    show({ intent, next, source: url.pathname + url.search + url.hash, view: feedback === 'google-link' && linkEmail ? 'link' : 'choice', error: authFeedback(feedback) ?? (feedback === 'google-link' && !linkEmail ? 'A confirmação expirou. Continue com Google novamente.' : undefined) });
  }, [linkEmail]);
  useEffect(() => {
    if (!request || !dialog.current) return;
    const element = dialog.current;
    element.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { element.close(); document.body.style.overflow = previousOverflow; trigger.current?.focus(); };
  }, [request]);
  const close = () => {
    activeRequest.current = null;
    dialog.current?.close();
    setRequest(null);
    void cancelAuthFlowAction().catch(() => {});
  };
  return <AuthModalContext.Provider value={{ authenticated, open }}>
    {children}
    {request && <dialog ref={dialog} aria-labelledby="auth-modal-title" aria-describedby="auth-modal-description" onCancel={event => { event.preventDefault(); close(); }} onKeyDown={event => {
      if (event.key !== 'Tab' || event.ctrlKey || event.altKey) return;
      const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]')).filter(element => element.getClientRects().length > 0);
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (!first || !last) { event.preventDefault(); return; }
      if (event.shiftKey && (document.activeElement === first || !controls.includes(document.activeElement as HTMLElement))) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !controls.includes(document.activeElement as HTMLElement))) {
        event.preventDefault(); first.focus();
      }
    }} onClick={event => {
      if (event.target !== dialog.current) return;
      const bounds = dialog.current.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close();
    }} className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-[480px] overflow-y-auto rounded-3xl border-0 bg-white p-0 text-gray-900 shadow-2xl backdrop:bg-black/50">
      <button type="button" aria-label="Fechar autenticação" onClick={close} className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full text-xl text-gray-500 hover:bg-gray-100 focus-visible:outline focus-visible:outline-orange-500">×</button>
      <AuthPanel intent={request.intent} next={request.next} source={request.source} googleEnabled={googleEnabled} initialView={request.view} initialError={request.error} imageUrl={request.imageUrl} linkEmail={linkEmail} onSuccess={next => {
        // A completed request after the user closed the dialog must not resume the action.
        const resume = activeRequest.current === request && dialog.current?.open;
        if (activeRequest.current === request) {
          activeRequest.current = null;
          dialog.current?.close(); setRequest(null);
        }
        if (resume) router.push(next);
        router.refresh();
      }} />
    </dialog>}
  </AuthModalContext.Provider>;
}
