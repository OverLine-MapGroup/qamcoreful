import { api } from "./client";

export interface Tenant {
  id: number;
  name: string;
  createdAt: string;
}

export interface CreateTenantRequest {
  name: string;
}

export interface StaffResponse {
  username: string;
  password: string;
  role: string;
}

export interface SuperAdminStats {
  totalTenants: number;
  totalUsers: number;
  totalStudents: number;
}

export const getTenants = async (): Promise<Tenant[]> => {
  return api("/api/v1/super-admin/tenants");
};

export const createTenant = async (data: CreateTenantRequest): Promise<Tenant> => {
  return api("/api/v1/super-admin/tenants", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const createSchoolAdmin = async (tenantId: number): Promise<StaffResponse> => {
  return api(`/api/v1/super-admin/tenants/${tenantId}/create-admin`, {
    method: "POST",
  });
};

export const getSuperAdminStats = async (): Promise<SuperAdminStats> => {
  return api("/api/v1/super-admin/stats");
};

// This endpoint doesn't exist in swagger - removing
// export const getTenantAdmins = async (tenantId: number): Promise<StaffResponse[]> => {
//   return api(`/api/v1/super-admin/tenants/${tenantId}/admins`);
// };

