import { z } from "zod";

export const BREEDS_BY_SPECIES = {
  DOG: [
    "Akita",
    "American Bully",
    "Basenji",
    "Beagle",
    "Bichon Frisé",
    "Border Collie",
    "Boxer",
    "Bull Terrier",
    "Bulldog Inglês",
    "Chihuahua",
    "Chow Chow",
    "Cocker Spaniel",
    "Dachshund",
    "Dálmata",
    "Dobermann",
    "Fila Brasileiro",
    "Golden Retriever",
    "Husky Siberiano",
    "Labrador Retriever",
    "Lhasa Apso",
    "Maltês",
    "Pastor Alemão",
    "Pastor Australiano",
    "Pinscher Miniatura",
    "Pit Bull Terrier",
    "Poodle",
    "Pug",
    "Rottweiler",
    "Schnauzer",
    "Shar-Pei",
    "Shih Tzu",
    "Spitz Alemão",
    "Weimaraner",
    "Yorkshire Terrier",
  ],
  CAT: [
    "Abissínio",
    "Angorá Turco",
    "Azul Russo",
    "Bengal",
    "Birmanês",
    "Bombay",
    "British Shorthair",
    "Devon Rex",
    "Esfinge (Sphynx)",
    "Maine Coon",
    "Norueguês da Floresta",
    "Persa",
    "Ragdoll",
    "Scottish Fold",
    "Siamês",
    "SRD (Sem Raça Definida)",
  ],
  BIRD: [
    "Agapornis (Pássaro do Amor)",
    "Arara Azul",
    "Arara Vermelha",
    "Cacatua",
    "Calopsita",
    "Canário",
    "Coleirinho",
    "Curiós",
    "Manon",
    "Papagaio Verdadeiro",
    "Periquito Australiano",
    "Pintassilgo",
    "Rosella",
    "Trinca-ferro",
  ],
  RABBIT: [
    "Angorá",
    "Dutch (Holandês)",
    "Fuzzy Lop",
    "Gigante de Flandres",
    "Holland Lop",
    "Leão (Lionhead)",
    "Mini Lop",
    "Mini Rex",
    "Nova Zelândia",
    "Rex",
  ],
  OTHER: [],
} as const;

export type Species = keyof typeof BREEDS_BY_SPECIES;

export const speciesSchema = z.enum(["DOG", "CAT", "BIRD", "RABBIT", "OTHER"], {
  errorMap: () => ({ message: "Espécie é obrigatória" }),
});
export const petStatusSchema = z.enum(["AVAILABLE", "UNDER_REVIEW", "ADOPTED"]);
export const situationSchema = z.enum(["SHELTER", "ABANDONED", "FOSTER", "STREET"], {
  errorMap: () => ({ message: "Situação é obrigatória" }),
});
export const adoptionStatusSchema = z.enum(["PENDING", "APPROVED", "REJECTED"]);

const SPECIES_WITH_BREEDS = ["DOG", "CAT", "BIRD", "RABBIT"] as const;

const petBaseSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  species: speciesSchema,
  situation: situationSchema,
  breed: z.string().optional(),
  age: z.coerce
    .number({ invalid_type_error: "Informe um número válido" })
    .int("Informe um número inteiro")
    .min(0, "Idade inválida")
    .optional()
    .or(z.literal(NaN).transform(() => undefined)),
  description: z.string().min(1, "Descrição é obrigatória"),
  imageUrls: z.array(z.string()).min(1, "Adicione pelo menos uma foto"),
  waitingSince: z.coerce.date({
    required_error: "Informe uma data",
    invalid_type_error: "Informe uma data",
  }),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const createPetSchema = petBaseSchema.superRefine((data, ctx) => {
  const needsBreed = (SPECIES_WITH_BREEDS as readonly string[]).includes(data.species);
  if (needsBreed && !data.breed) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Selecione a raça ou marque Sem raça definida",
      path: ["breed"],
    });
  }
});

export const updatePetSchema = petBaseSchema.extend({
  breed: z.string().nullable().optional(),
}).partial();

export const listPetsQuerySchema = z.object({
  search: z.string().optional(),
  waitingFilter: z.enum(["7", "30", "90", "90+"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(6),
});

export const petResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  species: speciesSchema,
  breed: z.string().nullable(),
  age: z.number().nullable(),
  description: z.string().nullable(),
  imageUrls: z.array(z.string()),
  status: petStatusSchema,
  situation: situationSchema,
  waitingSince: z.coerce.date(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  createdById: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const paginatedPetsSchema = z.object({
  data: z.array(petResponseSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export const createAdoptionSchema = z.object({
  petId: z.string().cuid(),
  message: z.string().optional(),
});

export const registerUserSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export type CreatePetInput = z.infer<typeof createPetSchema>;
export type UpdatePetInput = z.infer<typeof updatePetSchema>;
export type ListPetsQuery = z.infer<typeof listPetsQuerySchema>;
export type PetResponse = z.infer<typeof petResponseSchema>;
export type PaginatedPets = z.infer<typeof paginatedPetsSchema>;
export type CreateAdoptionInput = z.infer<typeof createAdoptionSchema>;
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
