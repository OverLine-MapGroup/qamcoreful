import { api } from "./client";
import { Complaint, PaginatedResponse, ResolveComplaintRequest } from "./psychologist";

export interface SchoolAdminStaffResponse {
  username: string;
  password: string;
  role: string;
}

export interface Staff {
  id: number;
  username: string;
  password: string;
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

export interface Group {
  id: number;
  name: string;
  curatorName: string;
}

export interface CreateStaffRequest {
  fullName: string;
  role: "STUDENT" | "TEACHER" | "ADMIN" | "PSYCHOLOGIST" | "SCHOOL_ADMIN" | "SUPER_ADMIN";
}

export interface CreateGroupRequest {
  name: string;
  curatorId?: number | null;
}

export interface GenerateCodesRequest {
  amount: number;
  groupId: number;
}

export interface SchoolStats {
  totalStudents: number;
  totalTeachers: number;
  unusedCodesCount: number;
  weeklyParticipationRate: number;
}

export interface ParticipationAnalytics {
  groupId: number;
  groupName: string;
  totalStudents: number;
  activeStudents: number;
  participationPercentage: number;
  unusedCodes: number;
}

export interface Teacher {
  id: number;
  username: string;
}

export const createStaff = async (data: CreateStaffRequest): Promise<SchoolAdminStaffResponse> => {
  return api("/api/v1/school-admin/staff", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getGroups = async (): Promise<Group[]> => {
  return api("/api/v1/school-admin/groups");
};

export const createGroup = async (data: CreateGroupRequest): Promise<Group> => {
  return api("/api/v1/school-admin/groups", {
    method: "POST",
    body: JSON.stringify({ name: data.name, curatorId: data.curatorId }),
  });
};

export const generateCodes = async (data: GenerateCodesRequest): Promise<string[]> => {
  return api("/api/v1/school-admin/codes/generate", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getUnusedCodes = async (groupId: number): Promise<string[]> => {
  return api(`/api/v1/school-admin/groups/${groupId}/unused-codes`);
};

export const getSchoolStats = async (): Promise<SchoolStats> => {
  return api("/api/v1/school-admin/dashboard/stats");
};

export const getParticipationAnalytics = async (): Promise<ParticipationAnalytics[]> => {
  return api("/api/v1/school-admin/analytics/participation");
};

export const getTeachers = async (): Promise<Teacher[]> => {
  return api("/api/v1/school-admin/teachers");
};

export const getSchoolAdminComplaints = async (page: number = 0, size: number = 20): Promise<PaginatedResponse<Complaint>> => {
  return api(`/api/v1/school-admin/complaints?page=${page}&size=${size}`);
};

export const resolveSchoolAdminComplaint = async (complaintId: number, data: ResolveComplaintRequest): Promise<void> => {
  return api(`/api/v1/school-admin/complaints/${complaintId}/resolve`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};
