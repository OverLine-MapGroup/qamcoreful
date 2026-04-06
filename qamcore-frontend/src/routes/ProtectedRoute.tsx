import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "../store/auth";



type UserRole = "STUDENT" | "PSYCHOLOGIST" | "SCHOOL_ADMIN" | "ADMIN" | "SUPER_ADMIN";



interface ProtectedRouteProps {

  allowedRoles: UserRole[];

  children: React.ReactNode;

}



export default function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { token, role, hydrated } = useAuthStore();

  if (!hydrated) {
    return null; // ждём восстановления
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!role || !allowedRoles.includes(role)) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Доступ запрещен
        </h2>
        <p className="text-gray-600">
          У вас нет прав для доступа к этой странице.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}