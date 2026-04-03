import { z } from "zod";

export const speciesSchema = z.enum(["DOG", "CAT", "BIRD", "RABBIT", "OTHER"]);
export const petStatusSchema = z.enum(["AVAILABLE", "UNDER_REVIEW", "ADOPTED"]);
export const adoptionStatusSchema = z.enum(["PENDING", "APPROVED", "REJECTED"]);

export const createPetSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  species: speciesSchema,
  breed: z.string().optional(),
  age: z.number().int().positive().optional(),
  description: z.string().optional(),
  imageUrls: z.array(z.string().url()).default([]),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
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
export type CreateAdoptionInput = z.infer<typeof createAdoptionSchema>;
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
