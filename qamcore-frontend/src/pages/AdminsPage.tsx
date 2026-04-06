import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Shield, Users, ArrowLeft, Mail, Calendar, Building } from "lucide-react";
import { useState, useEffect } from "react";

// TODO: Implement proper API for fetching administrators
// The getStaff function was removed from schoolAdmin.ts as it's not in the Swagger spec
// This page needs to be updated to use a valid API endpoint or be removed

interface Admin {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
}

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

export default function AdminsPage() {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  // TODO: Implement proper API call for fetching administrators
  // The getStaff function was removed as it's not in the Swagger spec
  useEffect(() => {
    const loadAdmins = async () => {
      try {
        // Placeholder: No API available to fetch admins
        // const staffData = await getStaff();
        // const adminData = staffData.filter(staff => staff.role === "ADMIN");
        // setAdmins(adminData);
        
        // Temporary: Set empty array to prevent crash
        setAdmins([]);
      } catch (error) {
        console.error("Error loading admins:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAdmins();
  }, []);

  const handleBackToDashboard = () => {
    navigate("/super-admin");
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
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBackToDashboard}
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
              <ArrowLeft style={{ height: "1rem", width: "1rem" }} />
              Вернуться
            </motion.button>
          </div>
          
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
                color: "#2e2e2e", 
                marginBottom: "0.25rem" 
              }}>
                Админы системы
              </h1>
              <p style={{ 
                fontSize: "0.875rem", 
                color: "#6b7280" 
              }}>
                Управление администраторами
              </p>
            </div>
          </div>
        </motion.div>

        {/* Admins Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          style={{
            background: "rgba(255, 255, 255, 0.8)",
            borderRadius: "0.75rem",
            border: "1px solid rgba(226, 232, 240, 0.8)",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            overflow: "hidden"
          }}
        >
          <div style={{ padding: "1.5rem", borderBottom: "1px solid rgba(226, 232, 240, 0.8)" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#2e2e2e", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Users style={{ height: "1.25rem", width: "1.25rem", color: "#10b981" }} />
              Список админов ({admins.length})
            </h2>
          </div>
          
          <div style={{ padding: "1.5rem" }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
                Загрузка...
              </div>
            ) : admins.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
                <Users style={{ height: "3rem", width: "3rem", marginBottom: "1rem", opacity: 0.5 }} />
                <p>Админы не найдены</p>
                <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
                  API для загрузки админов не найден
                </p>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid rgba(226, 232, 240, 0.8)" }}>
                    <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#6b7280" }}>ID</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#6b7280" }}>Имя</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#6b7280" }}>Email</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#6b7280" }}>Роль</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#6b7280" }}>Создан</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin, index) => (
                    <motion.tr 
                      key={admin.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                      style={{ 
                        borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
                        transition: "background-color 0.2s"
                      }}
                      whileHover={{
                        backgroundColor: "rgba(248, 250, 252, 0.8)"
                      }}
                    >
                      <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#2e2e2e", fontWeight: "500" }}>
                        {admin.id}
                      </td>
                      <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#2e2e2e" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <div style={{
                            width: "2rem",
                            height: "2rem",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #10b981, #059669)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "0.75rem",
                            fontWeight: "bold"
                          }}>
                            {admin.firstName.charAt(0)}{admin.lastName.charAt(0)}
                          </div>
                          <span>{admin.firstName} {admin.lastName}</span>
                        </div>
                      </td>
                      <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#6b7280" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <Mail style={{ height: "1rem", width: "1rem" }} />
                          {admin.email}
                        </div>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <span style={{
                          padding: "0.25rem 0.75rem",
                          borderRadius: "9999px",
                          fontSize: "0.75rem",
                          fontWeight: "500",
                          color: "#dc2626",
                          background: "#fef2f2"
                        }}>
                          {admin.role}
                        </span>
                      </td>
                      <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#6b7280" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <Calendar style={{ height: "1rem", width: "1rem" }} />
                          {new Date(admin.createdAt).toLocaleDateString("ru-RU")}
                        </div>
                      </td>
                    </motion.tr>
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
          transition={{ delay: 0.35, duration: 0.5 }}
          style={{
            marginTop: "2rem",
            padding: "1rem",
            borderRadius: "0.75rem",
            background: "rgba(248, 250, 252, 0.8)",
            border: "1px solid rgba(226, 232, 240, 0.8)"
          }}
        >
          <h4 style={{ fontSize: "0.875rem", fontWeight: "600", color: "#6b7280", marginBottom: "0.5rem" }}>
            API эндпоинт:
          </h4>
          <div style={{ fontSize: "0.75rem", color: "#6b7280", fontFamily: "monospace" }}>
            <div>GET /api/v1/school-admin/staff - НЕДОСТУПЕН</div>
            <div style={{ marginTop: "0.25rem", fontSize: "0.625rem", opacity: 0.8 }}>
              Фильтр: role === "ADMIN"
            </div>
            <div style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#dc2626" }}>
              ⚠️ Требуется реализация API для загрузки админов
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
