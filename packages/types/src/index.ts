export type Species = "DOG" | "CAT" | "BIRD" | "RABBIT" | "OTHER";
export type PetStatus = "AVAILABLE" | "UNDER_REVIEW" | "ADOPTED";
export type Situation = "SHELTER" | "ABANDONED" | "FOSTER";
export type AdoptionStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed?: string;
  age?: number;
  description?: string;
  imageUrls: string[];
  status: PetStatus;
  situation: Situation;
  waitingSince: Date;
  latitude?: number;
  longitude?: number;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Adoption {
  id: string;
  petId: string;
  userId: string;
  status: AdoptionStatus;
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}
