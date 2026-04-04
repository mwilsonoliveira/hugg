import { z } from "zod";

export const speciesSchema = z.enum(["DOG", "CAT", "BIRD", "RABBIT", "OTHER"]);
export const petStatusSchema = z.enum(["AVAILABLE", "UNDER_REVIEW", "ADOPTED"]);
export const situationSchema = z.enum(["SHELTER", "ABANDONED", "FOSTER", "STREET"]);
export const adoptionStatusSchema = z.enum(["PENDING", "APPROVED", "REJECTED"]);

export const createPetSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  species: speciesSchema,
  situation: situationSchema,
  breed: z.string().optional(),
  age: z.coerce.number().int().min(0, "Idade inválida").optional(),
  description: z.string().min(1, "Descrição é obrigatória"),
  imageUrls: z.array(z.string()).min(1, "Adicione pelo menos uma foto"),
  waitingSince: z.coerce.date({ required_error: "Data é obrigatória" }),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const updatePetSchema = createPetSchema.partial();

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
