import { api } from "./client";

export interface PsychologistCase {
  caseId: number;
  psychologistName: string;
  message: string;
  communicationLink: string;
  status: string;
  createdAt: string;
  resolvedAt: string | null;
}

export interface Psychologist {
  psychologistId: number;
  name: string;
  bookingUrl: string;
}

export interface CreateComplaintRequest {
  category: "BULLYING" | "DEPRESSION" | "TEACHER" | "INFRASTRUCTURE";
  text: string;
}

export const getStudentActiveCase = async (): Promise<PsychologistCase | null> => {
  try {
    return await api("/api/v1/student/cases/active");
  } catch (error) {
    if (error instanceof Response && error.status === 204) {
      return null;
    }
    throw error;
  }
};

export const getStudentMessages = async (): Promise<PsychologistCase[]> => {
  return api("/api/v1/student/messages");
};

export const createComplaint = async (data: CreateComplaintRequest): Promise<void> => {
  return api("/api/v1/student/complaints", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getPsychologists = async (): Promise<Psychologist[]> => {
  return api("/api/v1/student/psychologists");
};

export const trackBookingClick = async (psychologistId: number): Promise<void> => {
  return api(`/api/v1/student/psychologists/${psychologistId}/book-click`, {
    method: "POST",
  });
};
