import { VerifyEmailForm } from "./verify-form";

interface Props {
  searchParams: { email?: string };
}

export default function VerifyEmailPage({ searchParams }: Props) {
  const email = searchParams.email ?? "";
  return <VerifyEmailForm email={email} />;
}
