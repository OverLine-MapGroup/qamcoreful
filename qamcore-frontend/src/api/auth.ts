import { api } from "./client";

export interface JwtAuthenticationResponse {
  accessToken: string;
  refreshToken: string;
  username: string;
  role: "STUDENT" | "PSYCHOLOGIST" | "SCHOOL_ADMIN" | "ADMIN" | "SUPER_ADMIN";
  token?: string;
  orgId?: string;
}

export interface RegisterRequest {
  inviteCode: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export const registerAnonymous = async (data: RegisterRequest): Promise<JwtAuthenticationResponse> => {
  return api("/api/v1/auth/register-anonymous", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const login = async (data: LoginRequest): Promise<JwtAuthenticationResponse> => {
  return api("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const refreshToken = async (): Promise<{}> => {
  return api("/api/v1/auth/refresh-token", {
    method: "POST",
  });
};

export const logout = async (): Promise<{}> => {
  return api("/api/v1/auth/logout", {
    method: "POST",
  });
};
