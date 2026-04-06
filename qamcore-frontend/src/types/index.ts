// Re-export types from API modules for convenience
export type { 
  JwtAuthenticationResponse,
  RegisterRequest,
  LoginRequest 
} from "../api/auth";

export type {
  Question,
  ActiveCheckInResponse,
  CheckInSubmission
} from "../api/checkin";

export type {
  StudentRiskDto,
  StudentHistory,
  StudentDetailsResponse,
  GroupDto,
  DashboardStats
} from "../api/psychologist";

export type {
  Staff,
  Group,
  CreateStaffRequest,
  CreateGroupRequest,
  GenerateCodesRequest,
  SchoolStats
} from "../api/schoolAdmin";

// Legacy types for backward compatibility (deprecated)
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface Student {
  id: string;
  displayId: string;
  risk: RiskLevel;
  riskScore: number;
  lastCheckinAt: string;
}