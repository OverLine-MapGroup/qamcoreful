import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { fetchStudentDetails, StudentDetailsResponse, StudentHistory } from "../api/psychologist";
import { api } from "../api/client";
import { ArrowLeft, Calendar, TrendingUp, AlertTriangle, User, Activity } from "lucide-react";

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
        animate={{ x: [0, 60, -30, 0], y: [0, -40, 50, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", left: "-8rem", top: "-8rem", width: "500px", height: "500px", borderRadius: "50%", background: "rgba(122, 165, 248, 0.5)", filter: "blur(64px)" }}
      />
      <motion.div
        animate={{ x: [0, -50, 40, 0], y: [0, 60, -30, 0], scale: [1, 0.9, 1.1, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", right: "-8rem", top: "25%", width: "450px", height: "450px", borderRadius: "50%", background: "rgba(122, 165, 248, 0.4)", filter: "blur(64px)" }}
      />
      <motion.div
        animate={{ x: [0, 40, -50, 0], y: [0, -50, 30, 0], scale: [1, 1.1, 0.9, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", bottom: "-8rem", left: "33.333%", width: "400px", height: "400px", borderRadius: "50%", background: "rgba(122, 165, 248, 0.4)", filter: "blur(64px)" }}
      />
    </div>
  );
}

export default function StudentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<StudentDetailsResponse | null>(null);
  const [history, setHistory] = useState<StudentHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const studentId = Number(id);

    Promise.all([
      fetchStudentDetails(studentId),
      api(`/api/v1/psychologist/students/${studentId}/history?page=0&size=50`)
        .then((res: any) => {
          if (res && typeof res === "object" && "content" in res) return res.content as StudentHistory[];
          if (Array.isArray(res)) return res as StudentHistory[];
          return [];
        })
        .catch(() => [] as StudentHistory[]),
    ])
      .then(([studentData, historyData]) => {
        setData(studentData);
        setHistory(historyData);
      })
      .catch((error) => {
        console.error("Error fetching student details:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // FIX: use navigate(-1) so it always goes back to where the user came from
  // instead of hardcoded "/dashboard" which can redirect to login if route doesn't match
  const handleBackToDashboard = () => {
    navigate(-1);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "RED":
      case "HIGH":   return { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" };
      case "MEDIUM": return { bg: "#fff7ed", color: "#ea580c", border: "#fed7aa" };
      case "LOW":    return { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" };
      default:       return { bg: "#f8fafc", color: "#64748b", border: "#e2e8f0" };
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", background: "#fafcff" }}>
        <MeshGradientBg />
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ fontSize: "1.25rem", fontWeight: "500", color: "#2e2e2e", background: "rgba(255, 255, 255, 0.95)", padding: "1rem 2rem", borderRadius: "0.75rem", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ minHeight: "100vh", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", background: "#fafcff" }}>
        <MeshGradientBg />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: "center", background: "rgba(255, 255, 255, 0.95)", padding: "2rem", borderRadius: "0.75rem", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
        >
          <AlertTriangle style={{ height: "3rem", width: "3rem", color: "#ef4444", marginBottom: "1rem" }} />
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#2e2e2e", marginBottom: "0.5rem" }}>Студент не найден</h2>
          <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "1.5rem" }}>Не удалось загрузить информацию о студенте</p>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleBackToDashboard}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: "0.75rem", background: "#72a5f8", color: "white", border: "none", cursor: "pointer", fontSize: "0.875rem", fontWeight: "500", margin: "0 auto" }}>
            <ArrowLeft style={{ height: "1rem", width: "1rem" }} />
            Вернуться к списку
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const latestRisk = history.length > 0 ? history[0].riskLevel : "NONE";
  const latestScore = history.length > 0 ? history[0].score : null;
  const latestDate = history.length > 0 ? new Date(history[0].date).toLocaleDateString("ru-RU") : "—";
  const riskColors = getRiskColor(latestRisk);

  return (
    <div style={{ minHeight: "100vh", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", background: "#fafcff" }}>
      <MeshGradientBg />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: "100%", maxWidth: "90rem", background: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(40px)", borderRadius: "1rem", padding: "2rem", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)", border: "1px solid rgba(255, 255, 255, 0.8)" }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}
          style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleBackToDashboard}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: "0.75rem", background: "#72a5f8", color: "white", border: "none", cursor: "pointer", fontSize: "0.875rem", fontWeight: "500", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}>
              <ArrowLeft style={{ height: "1rem", width: "1rem" }} />
              Вернуться
            </motion.button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "3rem", width: "3rem", borderRadius: "0.75rem", background: "#72a5f8", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}>
              <User style={{ height: "1.5rem", width: "1.5rem", color: "white" }} />
            </div>
            <div>
              <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#2e2e2e", marginBottom: "0.25rem" }}>Детали студента</h1>
              <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>ID: {data.anonymousId} · Группа: {data.groupName}</p>
            </div>
          </div>
        </motion.div>

        {/* Student Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}
        >
          <motion.div whileHover={{ scale: 1.02 }}
            style={{ background: "rgba(255, 255, 255, 0.8)", padding: "1.5rem", borderRadius: "0.75rem", border: `1px solid ${riskColors.border}`, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <AlertTriangle style={{ height: "1.25rem", width: "1.25rem", color: riskColors.color }} />
              <h3 style={{ fontSize: "0.875rem", fontWeight: "500", color: "#6b7280" }}>Уровень риска</h3>
            </div>
            <span style={{ padding: "0.5rem 1rem", borderRadius: "9999px", fontSize: "1rem", fontWeight: "bold", color: riskColors.color, background: riskColors.bg, border: `1px solid ${riskColors.border}` }}>
              {latestRisk}
            </span>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}
            style={{ background: "rgba(255, 255, 255, 0.8)", padding: "1.5rem", borderRadius: "0.75rem", border: "1px solid rgba(226, 232, 240, 0.8)", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <TrendingUp style={{ height: "1.25rem", width: "1.25rem", color: "#3b82f6" }} />
              <h3 style={{ fontSize: "0.875rem", fontWeight: "500", color: "#6b7280" }}>Оценка риска</h3>
            </div>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#3b82f6" }}>{latestScore ?? "—"}</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}
            style={{ background: "rgba(255, 255, 255, 0.8)", padding: "1.5rem", borderRadius: "0.75rem", border: "1px solid rgba(226, 232, 240, 0.8)", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <Calendar style={{ height: "1.25rem", width: "1.25rem", color: "#10b981" }} />
              <h3 style={{ fontSize: "0.875rem", fontWeight: "500", color: "#6b7280" }}>Последний чек-ин</h3>
            </div>
            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>{latestDate}</p>
          </motion.div>
        </motion.div>

        {/* Checkins History */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
          style={{ background: "rgba(255, 255, 255, 0.8)", borderRadius: "0.75rem", border: "1px solid rgba(226, 232, 240, 0.8)", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)", overflow: "hidden" }}
        >
          <div style={{ padding: "1.5rem", borderBottom: "1px solid rgba(226, 232, 240, 0.8)" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#2e2e2e", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Activity style={{ height: "1.25rem", width: "1.25rem", color: "#8b5cf6" }} />
              История чек-инов ({history.length})
            </h2>
          </div>

          <div style={{ padding: "1.5rem" }}>
            {history.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
                <Activity style={{ height: "3rem", width: "3rem", marginBottom: "1rem", opacity: 0.5 }} />
                <p>История чек-инов пуста</p>
                <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>Студент еще не проходил опросы</p>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid rgba(226, 232, 240, 0.8)" }}>
                    <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#6b7280" }}>Дата</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#6b7280" }}>Риск</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#6b7280" }}>Оценка</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#6b7280" }}>Ответы</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((checkin: StudentHistory, index: number) => {
                    const checkinRiskColors = getRiskColor(checkin.riskLevel);
                    return (
                      <motion.tr
                        key={checkin.checkInId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
                        style={{ borderBottom: "1px solid rgba(226, 232, 240, 0.8)" }}
                      >
                        <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#6b7280" }}>
                          {new Date(checkin.date).toLocaleDateString("ru-RU")}
                        </td>
                        <td style={{ padding: "1rem" }}>
                          <span style={{ padding: "0.25rem 0.75rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: "500", color: checkinRiskColors.color, background: checkinRiskColors.bg, border: `1px solid ${checkinRiskColors.border}` }}>
                            {checkin.riskLevel}
                          </span>
                        </td>
                        <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#2e2e2e", fontWeight: "500" }}>
                          {checkin.score}
                        </td>
                        <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#6b7280" }}>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                            {(() => {
                              try {
                                const answers = JSON.parse(checkin.answersJson || "[]");
                                return Array.isArray(answers)
                                  ? answers.map((answer: any, i: number) => (
                                      <span key={i} style={{ padding: "0.25rem 0.5rem", borderRadius: "0.25rem", fontSize: "0.75rem", background: "rgba(79, 100, 255, 0.1)", color: "#4f64ff", border: "1px solid rgba(79, 100, 255, 0.2)" }}>
                                        {typeof answer === "string" ? answer : JSON.stringify(answer)}
                                      </span>
                                    ))
                                  : <span>Нет ответов</span>;
                              } catch {
                                return <span>Ошибка ответов</span>;
                              }
                            })()}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}