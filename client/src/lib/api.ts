import { LoginRequest, RegisterRequest, ChallengeRequest, AuthResponse, Challenge } from "@shared/schema";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("sustenta_jwt_token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: response.statusText || "Request failed",
          status: response.status,
        }));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      // Handle 204 No Content responses
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      console.error("API Request failed:", error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  // Challenge endpoints
  async getChallenges(): Promise<Challenge[]> {
    return this.request<Challenge[]>("/api/desafios");
  }

  async getChallenge(id: number): Promise<Challenge> {
    return this.request<Challenge>(`/api/desafios/${id}`);
  }

  async createChallenge(challengeData: ChallengeRequest): Promise<Challenge> {
    return this.request<Challenge>("/api/desafios", {
      method: "POST",
      body: JSON.stringify(challengeData),
    });
  }

  async updateChallenge(id: number, challengeData: ChallengeRequest): Promise<Challenge> {
    return this.request<Challenge>(`/api/desafios/${id}`, {
      method: "PUT",
      body: JSON.stringify(challengeData),
    });
  }

  async deleteChallenge(id: number): Promise<void> {
    return this.request<void>(`/api/desafios/${id}`, {
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient();
