import { jwtDecode } from "jwt-decode";
import { api } from "./api";
import { AuthResponse, User } from "../types";

class AuthService {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    });

    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      const decoded = jwtDecode<User>(response.data.access_token);
      localStorage.setItem("user", JSON.stringify(decoded));
    }

    return response.data;
  }

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  async register(email: string, password: string): Promise<any> {
    return api.post("/auth/register", {
      email,
      password,
    });
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    return JSON.parse(userStr);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const decoded = jwtDecode<{ exp: number }>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return !!(user && user.roles && user.roles.includes(role));
  }
}

export default new AuthService();
