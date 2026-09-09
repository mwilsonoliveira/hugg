import bcrypt from 'bcryptjs';
import { prisma, type Prisma } from '@hugg/database';
import { AppError } from './errors';
import { signToken } from './auth';
import type { AuthFlow } from './auth-flow';

type GoogleIdentity = { subject: string; email: string; name: string };
const session = (user: { id: string; name: string; email: string }) => {
  const safeUser = { id: user.id, name: user.name, email: user.email };
  return { token: signToken(safeUser), user: safeUser };
};

// Only verified Google claims reach this function. Do not link by email alone.
export async function resolveGoogleAccount(identity: GoogleIdentity) {
  const linked = await prisma.user.findUnique({ where: { googleSubject: identity.subject } });
  if (linked) return { kind: 'session' as const, ...session(linked) };
  // Legacy accounts may have mixed-case emails; reject ambiguity instead of merging.
  const matches = await prisma.$queryRaw<Array<{ id: string }>>`SELECT id FROM User WHERE lower(email) = ${identity.email.toLowerCase()}`;
  if (matches.length > 1) throw new AppError(409, 'Não foi possível vincular esta conta. Entre com e-mail e senha.');
  const existing = matches[0] ? await prisma.user.findUnique({ where: { id: matches[0].id } }) : null;
  if (existing) {
    if (existing.googleSubject || !existing.passwordHash) throw new AppError(409, 'Esta conta já usa outro acesso Google.');
    return { kind: 'link' as const, userId: existing.id, email: existing.email };
  }
  try {
    const user = await prisma.user.create({ data: { name: identity.name, email: identity.email, googleSubject: identity.subject } });
    return { kind: 'session' as const, ...session(user) };
  } catch (error) {
    if ((error as { code?: string }).code === 'P2002') throw new AppError(409, 'A conta mudou durante o acesso. Tente novamente.');
    throw error;
  }
}

export async function confirmGoogleLink(flow: Extract<AuthFlow, { phase: 'link' }>, password: string) {
  const reserved = await prisma.authAttempt.updateMany({ where: { id: flow.id, expiresAt: { gt: new Date() }, attempts: { lt: 5 } }, data: { attempts: { increment: 1 } } });
  if (!reserved.count) throw new AppError(401, 'A confirmação expirou. Continue com Google novamente.');
  const user = await prisma.user.findUnique({ where: { id: flow.userId } });
  if (!user?.passwordHash || user.email !== flow.email || !(await bcrypt.compare(password, user.passwordHash))) throw new AppError(401, 'Senha incorreta. Tente novamente.');
  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const consumed = await tx.authAttempt.deleteMany({ where: { id: flow.id, expiresAt: { gt: new Date() } } });
      if (!consumed.count) throw new AppError(401, 'A confirmação expirou. Continue com Google novamente.');
      const updated = await tx.user.updateMany({ where: { id: user.id, googleSubject: null, passwordHash: user.passwordHash, email: flow.email }, data: { googleSubject: flow.subject } });
      if (updated.count !== 1) throw new AppError(409, 'A conta mudou. Entre novamente.');
    });
  } catch (error) {
    if ((error as { code?: string }).code === 'P2002') throw new AppError(409, 'Este acesso Google já está vinculado. Entre novamente.');
    throw error;
  }
  return session(user);
}
