import { listPets as getPets } from "@/server/pets";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  let petImages: [string?, string?, string?] = [];

  try {
    const { data } = await getPets({ page: 1, limit: 50 });
    const urls = data
      .filter((p) => p.imageUrls.length > 0)
      .map((p) => p.imageUrls[0] as string);

    // shuffle e pega até 3
    for (let i = urls.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [urls[i], urls[j]] = [urls[j]!, urls[i]!];
    }
    petImages = [urls[0], urls[1], urls[2]];
  } catch {
    // sem imagens se a API não responder
  }

  const testCredentials = process.env.NODE_ENV === "development"
    ? {
        email: process.env.SEED_ADMIN_EMAIL ?? "admin@hugg.com",
        password: process.env.SEED_ADMIN_PASSWORD ?? "hugg123456",
      }
    : undefined;

  return <LoginForm petImages={petImages} testCredentials={testCredentials} />;
}
