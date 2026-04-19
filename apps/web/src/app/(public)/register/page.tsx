import { getPets } from "@/lib/api";
import { RegisterForm } from "./register-form";

export default async function RegisterPage() {
  let petImages: [string?, string?, string?] = [];

  try {
    const { data } = await getPets({ page: 1, limit: 50 });
    const urls = data
      .filter((p) => p.imageUrls.length > 0)
      .map((p) => p.imageUrls[0] as string);

    for (let i = urls.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [urls[i], urls[j]] = [urls[j]!, urls[i]!];
    }
    petImages = [urls[0], urls[1], urls[2]];
  } catch {
    // sem imagens se a API não responder
  }

  return <RegisterForm petImages={petImages} />;
}
