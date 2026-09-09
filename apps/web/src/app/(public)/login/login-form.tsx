'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthPanel, type AuthPanelProps } from '@/components/auth-panel';

export function LoginForm(props: Omit<AuthPanelProps, 'onSuccess' | 'source'>) {
  const router = useRouter();
  return <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
    <div className="w-full max-w-[480px] overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <AuthPanel {...props} source="/login" onSuccess={next => { router.push(next); router.refresh(); }} />
      <Link href="/" className="mb-8 block text-center text-sm text-orange-600 hover:underline">Continuar explorando os animais</Link>
    </div>
  </main>;
}
