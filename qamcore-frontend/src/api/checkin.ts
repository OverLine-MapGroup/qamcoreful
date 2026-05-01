import { api } from "./client";

export interface Question {
  id: string;
  text: string;
  type: string;
  min: number;
  max: number;
  weight: number;
  critical: boolean;
}

export interface ActiveCheckInResponse {
  checkinId: string;
  status: "PENDING";
  deadline: string;
  message: string;
  questions: Question[];
}

export interface CheckInResultRequest {
  checkinId: string;
  answers: Record<string, number>;
}

export interface CheckInResult {
  status: string;
  totalScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
}

export const getActiveCheckIn = async (): Promise<ActiveCheckInResponse> => {
  return api("/api/v1/checkins/active");
};

export const submitCheckIn = async (data: CheckInResultRequest): Promise<CheckInResult> => {
  return api("/api/v1/checkins", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
