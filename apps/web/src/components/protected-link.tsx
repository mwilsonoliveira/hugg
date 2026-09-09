'use client';
import Link from 'next/link';
import type { ComponentProps } from 'react';
import type { AuthIntent } from '@hugg/schemas';
import { useAuthModal } from './auth-modal-provider';

export function ProtectedLink({ href, intent, children, onClick, ...props }: Omit<ComponentProps<typeof Link>, 'href'> & { href: string; intent: AuthIntent }) {
  const auth = useAuthModal();
  return <Link {...props} href={href} onClick={event => {
    onClick?.(event);
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (auth && !auth.authenticated) {
      event.preventDefault();
      auth.open({ intent, next: href });
    }
  }}>{children}</Link>;
}
