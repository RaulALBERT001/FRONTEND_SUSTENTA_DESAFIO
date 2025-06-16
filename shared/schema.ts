import { z } from "zod";

// Auth schemas
export const loginSchema = z.object({
  username: z.string().min(1, "Nome de usuário é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export const registerSchema = z.object({
  username: z.string().min(1, "Nome de usuário é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export const challengeSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório").max(200, "Título deve ter no máximo 200 caracteres"),
  descricao: z.string().max(2000, "Descrição deve ter no máximo 2000 caracteres").optional(),
  nivelDificuldade: z.string().max(20, "Nível de dificuldade deve ter no máximo 20 caracteres").optional(),
  categoria: z.string().max(100, "Categoria deve ter no máximo 100 caracteres").optional(),
  pontuacaoMaxima: z.number().positive("Pontuação deve ser positiva").optional(),
  tempoEstimado: z.number().positive("Tempo estimado deve ser positivo").optional(),
});

// Types
export type LoginRequest = z.infer<typeof loginSchema>;
export type RegisterRequest = z.infer<typeof registerSchema>;
export type ChallengeRequest = z.infer<typeof challengeSchema>;

export interface AuthResponse {
  token: string | null;
  username: string | null;
  message: string;
}

export interface Challenge {
  id: number;
  titulo: string;
  descricao: string;
  nivelDificuldade: string;
  categoria: string;
  pontuacaoMaxima: number;
  tempoEstimado: number;
  statusAtivo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface InsertUser {
  username: string;
  email: string;
  password: string;
}

export interface ApiError {
  status: number;
  error: string;
  message: string;
  timestamp: string;
  path: string;
  validationErrors?: Record<string, string>;
}
