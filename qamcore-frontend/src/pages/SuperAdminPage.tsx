import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Shield, Users, Building, Settings, LogOut, Database, BarChart3, Globe, Plus, Edit, Trash2, UserPlus, Key, Eye, Download } from "lucide-react";
import { useState, useEffect } from "react";
import React from "react";
import { getTenants, getSuperAdminStats, createTenant, createSchoolAdmin, Tenant, SuperAdminStats, StaffResponse } from "../api/superAdmin";
import { generateTenantsPDF, generateStaffPDF } from "../utils/universalPdfGenerator";

/* ─────────────────────────────────────────────
   Animated mesh‑gradient background
   ───────────────────────────────────────────── */
function MeshGradientBg() {
  return (
    <div style={{ 
      position: "absolute", 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      overflow: "hidden", 
      pointerEvents: "none" 
    }}>
      <div style={{ 
        position: "absolute", 
        inset: 0, 
        background: "#fafcff" 
      }} />
      
      <motion.div
        animate={{
          x: [0, 60, -30, 0],
          y: [0, -40, 50, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          left: "-8rem",
          top: "-8rem",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "rgba(122, 165, 248, 0.5)",
          filter: "blur(64px)"
        }}
      />
      
      <motion.div
        animate={{
          x: [0, -50, 40, 0],
          y: [0, 60, -30, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          right: "-8rem",
          top: "25%",
          width: "450px",
          height: "450px",
          borderRadius: "50%",
          background: "rgba(122, 165, 248, 0.4)",
          filter: "blur(64px)"
        }}
      />
      
      <motion.div
        animate={{
          x: [0, 40, -50, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          bottom: "-8rem",
          left: "33.333%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "rgba(122, 165, 248, 0.4)",
          filter: "blur(64px)"
        }}
      />
    </div>
  );
}

export default function SuperAdminPage() {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [stats, setStats] = useState<SuperAdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedTenants, setExpandedTenants] = useState<Set<string>>(new Set());
  // Загрузка данных
  useEffect(() => {
    const loadData = async () => {
      // Logic Fix: If the user is on the /login page, don't try to fetch admin stats.
      if (window.location.pathname === "/login") {
        return;
      }
      try {
        const [tenantsData, statsData] = await Promise.all([
          getTenants(),
          getSuperAdminStats()
        ]);
        setTenants(tenantsData);
        setStats(statsData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleTenantExpansion = async (tenantId: number) => {
    const newExpanded = new Set(expandedTenants);
    const tenantIdStr = tenantId.toString();
    
    if (newExpanded.has(tenantIdStr)) {
      newExpanded.delete(tenantIdStr);
    } else {
      newExpanded.add(tenantIdStr);
      // Note: Tenant admin loading removed as endpoint doesn't exist in swagger
    }
    setExpandedTenants(newExpanded);
  };

  // Обработчики кнопок
  const generateTenantsPDFReport = () => {
    generateTenantsPDF(tenants);
  };

  const handleCreateTenant = async () => {
    const name = prompt("Введите название организации:");
    if (!name) return;

    try {
      const newTenant = await createTenant({ name });
      setTenants([...tenants, newTenant]);
      alert("Организация создана успешно!");
    } catch (error) {
      console.error("Error creating tenant:", error);
      alert("Ошибка при создании организации");
    }
  };

  const handleUsersManagement = async (tenantId: string) => {
    const fullName = prompt("Введите полное имя SCHOOL_ADMIN:");
    if (!fullName) return;

    try {
      console.log(`[DEBUG] Creating admin for tenant: ${tenantId}`);
      const newAdmin = await createSchoolAdmin(parseInt(tenantId));
      console.log(`[DEBUG] Admin created:`, newAdmin);
      
      if (newAdmin.role === "SCHOOL_ADMIN") {
        alert(`SCHOOL_ADMIN создан успешно!\nЛогин: ${newAdmin.username}\nПароль: ${newAdmin.password}\nРоль: ${newAdmin.role}`);
      } else {
        alert(`SCHOOL_ADMIN создан успешно!\nЛогин: ${newAdmin.username}\nПароль: ${newAdmin.password}\nРоль: ${newAdmin.role}`);
      }
    } catch (error) {
      console.error("Error creating SCHOOL_ADMIN:", error);
      alert("Ошибка при создании SCHOOL_ADMIN");
    }
  };


  const handleSystemSettings = () => {
    console.log("Настройки системы");
  };

  const handleSystemStats = () => {
    console.log("Статистика системы - GET /api/v1/super-admin/stats");
  };

  const handleReportsLogs = () => {
    console.log("Отчеты и логи");
  };

  const handlePerformanceMonitoring = () => {
    console.log("Мониторинг производительности");
  };

  const handleViewAdmins = () => {
    navigate("/admins");
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      position: "relative", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      padding: "1rem", 
      background: "#fafcff" 
    }}>
      <MeshGradientBg />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: "100%",
          maxWidth: "90rem",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(40px)",
          borderRadius: "1rem",
          padding: "2rem",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          border: "1px solid rgba(255, 255, 255, 0.8)"
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          style={{ 
            marginBottom: "2rem", 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center" 
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center", 
              height: "3rem", 
              width: "3rem", 
              borderRadius: "0.75rem", 
              background: "#72a5f8",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" 
            }}>
              <Shield style={{ height: "1.5rem", width: "1.5rem", color: "white" }} />
            </div>
            <div>
              <h1 style={{ 
                fontSize: "1.875rem", 
                fontWeight: "bold", 
                color: "#4f64ff", 
                marginBottom: "0.25rem" 
              }}>
                Панель Супер Админа
              </h1>
              <p style={{ 
                fontSize: "0.875rem", 
                color: "#4f64ff" 
              }}>
                Управление системой
              </p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.75rem",
              background: "#72a5f8",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: "500",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
            }}
          >
            <LogOut style={{ height: "1rem", width: "1rem" }} />
          </motion.button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
            gap: "1.5rem", 
            marginBottom: "2rem" 
          }}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            style={{
              background: "rgba(255, 255, 255, 0.8)",
              padding: "1.5rem",
              borderRadius: "0.75rem",
              border: "1px solid rgba(226, 232, 240, 0.8)",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.05)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <Building style={{ height: "1.25rem", width: "1.25rem", color: "#4f64ff" }} />
              <h3 style={{ fontSize: "0.875rem", fontWeight: "500", color: "#4f64ff" }}>Организации</h3>
            </div>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#4f64ff" }}>{stats?.totalTenants || 0}</p>
            <p style={{ fontSize: "0.75rem", color: "#4f64ff", marginTop: "0.25rem" }}>GET /api/v1/super-admin/stats</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            style={{
              background: "rgba(255, 255, 255, 0.8)",
              padding: "1.5rem",
              borderRadius: "0.75rem",
              border: "1px solid rgba(226, 232, 240, 0.8)",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.05)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <Users style={{ height: "1.25rem", width: "1.25rem", color: "#4f64ff" }} />
              <h3 style={{ fontSize: "0.875rem", fontWeight: "500", color: "#4f64ff" }}>Пользователи</h3>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.25rem" }}>
              <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#4f64ff" }}>{stats?.totalUsers || 0}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleViewAdmins}
                style={{
                  padding: "0.5rem",
                  borderRadius: "0.5rem",
                  background: "linear-gradient(to right, #4f64ff, #4f64ff)",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem"
                }}
              >
                <Eye style={{ height: "0.75rem", width: "0.75rem" }} />
                Смотреть
              </motion.button>
            </div>
            <p style={{ fontSize: "0.75rem", color: "#4f64ff", marginTop: "0.25rem" }}>GET /api/v1/super-admin/stats</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            style={{
              background: "rgba(255, 255, 255, 0.8)",
              padding: "1.5rem",
              borderRadius: "0.75rem",
              border: "1px solid rgba(226, 232, 240, 0.8)",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.05)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <Users style={{ height: "1.25rem", width: "1.25rem", color: "#4f64ff" }} />
              <h3 style={{ fontSize: "0.875rem", fontWeight: "500", color: "#4f64ff" }}>Студенты</h3>
            </div>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#4f64ff" }}>{stats?.totalStudents || 0}</p>
            <p style={{ fontSize: "0.75rem", color: "#4f64ff", marginTop: "0.25rem" }}>GET /api/v1/super-admin/stats</p>
          </motion.div>

        </motion.div>

        {/* Tenants Management Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          style={{
            background: "rgba(255, 255, 255, 0.8)",
            borderRadius: "0.75rem",
            border: "1px solid rgba(226, 232, 240, 0.8)",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            overflow: "hidden"
          }}
        >
          <div style={{ padding: "1.5rem", borderBottom: "1px solid rgba(226, 232, 240, 0.8)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#2e2e2e", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Building style={{ height: "1.25rem", width: "1.25rem", color: "#4f64ff" }} />
                Управление организациями
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateTenant}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "0.75rem",
                  background: "#72a5f8",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                }}
              >
                <Plus style={{ height: "1rem", width: "1rem" }} />
                Создать организацию
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={generateTenantsPDFReport}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "0.75rem",
                  background: "linear-gradient(to right, #10b981, #059669)",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                }}
              >
                <Download style={{ height: "1rem", width: "1rem" }} />
                Скачать PDF
              </motion.button>
            </div>
          </div>
          
          <div style={{ padding: "1.5rem" }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "#4f64ff" }}>
                Загрузка...
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(226, 232, 240, 0.8)" }}>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#4f64ff" }}>ID</th>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#4f64ff" }}>Название</th>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#4f64ff" }}>Создано</th>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#4f64ff" }}>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {tenants.map((tenant) => (
                    <React.Fragment key={tenant.id}>
                      <tr 
                        style={{ 
                          borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
                          cursor: "pointer"
                        }}
                        onClick={() => toggleTenantExpansion(tenant.id)}
                      >
                        <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#2e2e2e" }}>{tenant.id}</td>
                        <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#2e2e2e", fontWeight: "500" }}>{tenant.name}</td>
                        <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#4f64ff" }}>
                          {new Date(tenant.createdAt).toLocaleDateString("ru-RU")}
                        </td>
                        <td style={{ padding: "0.75rem" }}>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUsersManagement(tenant.id.toString());
                              }}
                              style={{
                                padding: "0.5rem",
                                borderRadius: "0.5rem",
                                background: "#4f64ff",
                                color: "white",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "0.75rem",
                                fontWeight: "500",
                                transition: "background-color 0.2s",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                marginRight: "0.5rem"
                              }}
                            >
                              <UserPlus style={{ height: "0.875rem", width: "0.875rem" }} />
                              Админ
                            </motion.button>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Expanded Admins Row */}
                      {expandedTenants.has(tenant.id.toString()) && tenant.name.toLowerCase() !== 'it university' && (
                        <tr>
                          <td colSpan={7} style={{ padding: "0", backgroundColor: "rgba(79, 100, 255, 0.05)" }}>
                            <div style={{ padding: "1rem" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                                <Users style={{ height: "1rem", width: "1rem", color: "#4f64ff" }} />
                                <h4 style={{ fontSize: "1rem", fontWeight: "600", color: "#4f64ff" }}>
                                  Админы организации "{tenant.name}"
                                </h4>
                              </div>
                              
                              <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
                                <p>Администраторы организации</p>
                                <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
                                  Используйте кнопку "Создать админа" для добавления администратора
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>

        {/* API Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          style={{
            marginTop: "2rem",
            padding: "1rem",
            borderRadius: "0.75rem",
            background: "rgba(248, 250, 252, 0.8)",
            border: "1px solid rgba(226, 232, 240, 0.8)"
          }}
        >
          <h4 style={{ fontSize: "0.875rem", fontWeight: "600", color: "#4f64ff", marginBottom: "0.5rem" }}>
            Доступные API эндпоинты:
          </h4>
          <div style={{ fontSize: "0.75rem", color: "#4f64ff", fontFamily: "monospace" }}>
            <div>GET    /api/v1/super-admin/tenants</div>
            <div>POST   /api/v1/super-admin/tenants</div>
            <div>POST   /api/v1/super-admin/tenants/{'{tenantId}'}/create-admin</div>
            <div>GET    /api/v1/super-admin/stats</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
