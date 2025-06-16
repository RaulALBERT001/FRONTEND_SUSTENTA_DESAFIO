import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, registerSchema, challengeSchema, type Challenge } from "@shared/schema";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// JWT Authentication Middleware
interface AuthRequest extends Request {
  userId?: number;
  username?: string;
}

const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.userId = decoded.userId;
    req.username = decoded.username;
    next();
  });
};

// Mock challenges data matching the Java API structure
const mockChallenges: Challenge[] = [
  {
    id: 1,
    titulo: "Reduza o Consumo de Água",
    descricao: "Diminua o uso de água em casa por uma semana",
    nivelDificuldade: "FACIL",
    categoria: "AGUA",
    pontuacaoMaxima: 100,
    tempoEstimado: 7,
    statusAtivo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    titulo: "Use Transporte Público",
    descricao: "Utilize apenas transporte público por 5 dias",
    nivelDificuldade: "MEDIO",
    categoria: "TRANSPORTE",
    pontuacaoMaxima: 200,
    tempoEstimado: 5,
    statusAtivo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let challengeIdCounter = 3;

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes (no authentication required)
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = registerSchema.parse(req.body);
      
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const user = await storage.createUser(userData);
      const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
      
      res.json({ token, username: user.username, message: "User registered successfully" });
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token, username: user.username, message: "Login successful" });
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  // Challenge routes (authentication required)
  app.get("/api/desafios", authenticateToken, (req: AuthRequest, res: Response) => {
    res.json(mockChallenges);
  });

  app.get("/api/desafios/:id", authenticateToken, (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    const challenge = mockChallenges.find(c => c.id === id);
    
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }
    
    res.json(challenge);
  });

  app.post("/api/desafios", authenticateToken, (req: AuthRequest, res: Response) => {
    try {
      const challengeData = challengeSchema.parse(req.body);
      
      const newChallenge: Challenge = {
        id: challengeIdCounter++,
        titulo: challengeData.titulo,
        descricao: challengeData.descricao || "",
        nivelDificuldade: challengeData.nivelDificuldade || "",
        categoria: challengeData.categoria || "",
        pontuacaoMaxima: challengeData.pontuacaoMaxima || 0,
        tempoEstimado: challengeData.tempoEstimado || 0,
        statusAtivo: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      mockChallenges.push(newChallenge);
      res.status(201).json(newChallenge);
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  app.put("/api/desafios/:id", authenticateToken, (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const challengeData = challengeSchema.parse(req.body);
      
      const challengeIndex = mockChallenges.findIndex(c => c.id === id);
      if (challengeIndex === -1) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      
      const updatedChallenge: Challenge = {
        ...mockChallenges[challengeIndex],
        titulo: challengeData.titulo,
        descricao: challengeData.descricao || mockChallenges[challengeIndex].descricao,
        nivelDificuldade: challengeData.nivelDificuldade || mockChallenges[challengeIndex].nivelDificuldade,
        categoria: challengeData.categoria || mockChallenges[challengeIndex].categoria,
        pontuacaoMaxima: challengeData.pontuacaoMaxima || mockChallenges[challengeIndex].pontuacaoMaxima,
        tempoEstimado: challengeData.tempoEstimado || mockChallenges[challengeIndex].tempoEstimado,
        updatedAt: new Date().toISOString(),
      };
      
      mockChallenges[challengeIndex] = updatedChallenge;
      res.json(updatedChallenge);
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  app.delete("/api/desafios/:id", authenticateToken, (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    const challengeIndex = mockChallenges.findIndex(c => c.id === id);
    
    if (challengeIndex === -1) {
      return res.status(404).json({ message: "Challenge not found" });
    }
    
    mockChallenges.splice(challengeIndex, 1);
    res.status(204).send();
  });

  const httpServer = createServer(app);
  return httpServer;
}
