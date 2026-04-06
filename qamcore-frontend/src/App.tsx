import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkin from "./pages/Checkin";
import Dashboard from "./pages/Dashboard";
import StudentDetails from "./pages/StudentDetails";
import Success from "./pages/Success";
import SuperAdminPage from "./pages/SuperAdminPage";
import SchoolAdminPage from "./pages/SchoolAdminPage";
import AdminsPage from "./pages/AdminsPage";
import Complaints from "./pages/Complaints";
import Messages from "./pages/Messages";
import ProtectedRoute from "./routes/ProtectedRoute";
import ApiStatus from "./components/ApiStatus";
import { Landing } from "./pages/Landing";
import { StudentDashboard } from "./components/StudentDashboard";

export default function App() {
  return (
    <>
      <ApiStatus />
      <Routes>
        {/* Landing page - hidden for now, redirects to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Hidden landing route - keep for future use */}
        <Route path="/landing" element={<Landing />} />

        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Super Admin */}
        <Route path="/super-admin" element={
          <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
            <SuperAdminPage />
          </ProtectedRoute>
        } />
        <Route path="/admins" element={
          <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
            <AdminsPage />
          </ProtectedRoute>
        } />

        {/* School Admin */}
        <Route path="/school-admin" element={
          <ProtectedRoute allowedRoles={["SCHOOL_ADMIN"]}>
            <SchoolAdminPage />
          </ProtectedRoute>
        } />

        {/* Psychologist & Student */}
        <Route path="/student-dashboard" element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/checkin" element={
          <ProtectedRoute allowedRoles={["PSYCHOLOGIST", "STUDENT"]}>
            <Checkin />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={["PSYCHOLOGIST", "STUDENT"]}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/complaints" element={
          <ProtectedRoute allowedRoles={["PSYCHOLOGIST", "SCHOOL_ADMIN", "ADMIN"]}>
            <Complaints />
          </ProtectedRoute>
        } />
        <Route path="/messages" element={
          <ProtectedRoute allowedRoles={["PSYCHOLOGIST"]}>
            <Messages />
          </ProtectedRoute>
        } />
        <Route path="/success" element={
          <ProtectedRoute allowedRoles={["PSYCHOLOGIST", "STUDENT"]}>
            <Success />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/:id" element={
          <ProtectedRoute allowedRoles={["PSYCHOLOGIST", "STUDENT"]}>
            <StudentDetails />
          </ProtectedRoute>
        } />

        {/* fallback */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </>
  );
}