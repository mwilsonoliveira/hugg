import { getPets } from "@/lib/api";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  let petImageUrl: string | undefined;

  try {
    const { data } = await getPets({ page: 1, limit: 20 });
    const petsWithImages = data.filter((p) => p.imageUrls.length > 0);
    if (petsWithImages.length > 0) {
      const random = petsWithImages[Math.floor(Math.random() * petsWithImages.length)];
      petImageUrl = random?.imageUrls[0];
    }
  } catch {
    // sem imagem se a API não responder
  }

  return <LoginForm petImageUrl={petImageUrl} />;
}
