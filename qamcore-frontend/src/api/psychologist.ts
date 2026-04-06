import { api } from "./client";

export interface StudentRiskDto {
  studentId: number;
  displayName: string;
  riskLevel: string;
  riskScore: number;
  lastCheckInAt: string;
  hasSos: boolean;
}

export interface StudentHistory {
  checkInId: number;
  date: string;
  score: number;
  riskLevel: string;
  answersJson: string;
}

export interface StudentDetailsResponse {
  id: number;
  anonymousId: string;
  groupName: string;
}

export interface GroupDto {
  groupId: number;
  name: string;
  curatorName: string;
  students: StudentRiskDto[];
  totalStudents: number;
  inactiveStudents: number;
}

export interface DashboardStats {
  riskGroupCount: number;
  totalStudents: number;
  riskPercentage: number;
  activeToday: number;
  hasBookingUrl: boolean;
}

export interface StudentDashboardStats {
  lastCheckInAt: string | null;
  riskLevel: 'low' | 'medium' | 'high' | string;
  riskScore: number;
  hasSos: boolean;
}

export interface PsychologistCase {
  caseId: number;
  psychologistName: string;
  message: string;
  communicationLink: string;
  status: string;
  createdAt: string;
  resolvedAt: string | null;
}

export interface CreateCaseRequest {
  message: string;
  communicationLink: string;
}

export interface Complaint {
  id: number;
  tenantId: number;
  category: "BULLYING" | "DEPRESSION" | "TEACHER" | "INFRASTRUCTURE";
  status: "NEW" | "IN_PROGRESS" | "RESOLVED_SUCCESS" | "RESOLVED_REJECTED" | "RESOLVED_SPAM";
  text: string;
  resolutionComment: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
}

export interface PaginatedResponse<T> {
  totalPages: number;
  totalElements: number;
  pageable: {
    pageNumber: number;
    paged: boolean;
    pageSize: number;
    unpaged: boolean;
    offset: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
  };
  numberOfElements: number;
  size: number;
  content: T[];
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ResolveComplaintRequest {
  status: "IN_PROGRESS" | "RESOLVED_SUCCESS" | "RESOLVED_REJECTED" | "RESOLVED_SPAM";
  resolutionComment: string;
}

export const fetchStudents = async (filter?: string): Promise<StudentRiskDto[]> => {
  const url = filter ? `/api/v1/psychologist/students?filter=${filter}` : "/api/v1/psychologist/students";
  const response = await api(url);
  
  // Handle paginated response
  if (response && typeof response === 'object' && 'content' in response) {
    return response.content || [];
  }
  
  // Handle direct array response
  return Array.isArray(response) ? response : [];
};

export const fetchStudentDetails = async (studentId: number): Promise<StudentDetailsResponse> => {
  return api(`/api/v1/psychologist/students/${studentId}`);
};

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  return api("/api/v1/psychologist/dashboard/stats");
};

// Case System Functions
export const createCase = async (studentId: number, data: CreateCaseRequest): Promise<PsychologistCase> => {
  return api(`/api/v1/psychologist/students/${studentId}/cases`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const resolveCase = async (caseId: number): Promise<void> => {
  return api(`/api/v1/psychologist/cases/${caseId}/resolve`, {
    method: "POST",
  });
};

export const getStudentCases = async (studentId: number): Promise<PsychologistCase[]> => {
  return api(`/api/v1/psychologist/students/${studentId}/cases`);
};

// Complaint System Functions
export const getPsychologistComplaints = async (page: number = 0, size: number = 20): Promise<PaginatedResponse<Complaint>> => {
  return api(`/api/v1/psychologist/complaints?page=${page}&size=${size}`);
};

export const resolvePsychologistComplaint = async (complaintId: number, data: ResolveComplaintRequest): Promise<void> => {
  return api(`/api/v1/psychologist/complaints/${complaintId}/resolve`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

// Booking URL Update
export const updateBookingUrl = async (bookingUrl: string): Promise<void> => {
  return api("/api/v1/psychologist/profile/booking-url", {
    method: "PATCH",
    body: JSON.stringify({ bookingUrl }),
  });
};