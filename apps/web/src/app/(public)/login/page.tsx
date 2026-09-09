import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { safeReturnTo } from '@/lib/auth-navigation';
import { googleEnabled, readAuthFlow } from '@/server/google-auth';
import { LoginForm } from './login-form';

export default async function LoginPage({ searchParams }: { searchParams: { next?: string | string[]; auth?: string } }) {
  const next = safeReturnTo(searchParams.next);
  if (await getCurrentUser()) redirect(next);
  const flow = readAuthFlow();
  const linking = searchParams.auth === 'google-link' && flow?.phase === 'link';
  const initialError = searchParams.auth === 'google-cancelled' ? 'O acesso com Google foi cancelado. Você pode tentar novamente ou usar e-mail.'
    : searchParams.auth === 'google-error' || (searchParams.auth === 'google-link' && !linking) ? 'Não foi possível entrar com Google. Tente novamente ou use e-mail.' : undefined;
  const testCredentials = process.env.NODE_ENV === 'development' ? { email: process.env.SEED_ADMIN_EMAIL ?? 'admin@hugg.com', password: process.env.SEED_ADMIN_PASSWORD ?? 'hugg123456' } : undefined;
  return <LoginForm next={linking ? flow.next : next} intent={next === '/pets/new' ? 'create' : next.endsWith('/edit') ? 'edit' : 'sign-in'} googleEnabled={googleEnabled()} initialView={linking ? 'link' : 'login'} initialError={initialError} linkEmail={linking ? flow.email : undefined} testCredentials={testCredentials} />;
}
