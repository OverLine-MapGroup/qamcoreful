import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  AlertTriangle,
  MessageSquare,
  Key,
  Bell,
  LogOut,
  Download,
  ChevronDown,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Zap,
  BookOpen,
  Palette,
  Scale,
  Wrench,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  fetchStudents,
  fetchDashboardStats,
  updateBookingUrl,
  StudentRiskDto,
  DashboardStats,
} from "../api/psychologist";
import { useAuthStore } from "../store/auth";
import { generateStudentsPDF } from "../utils/universalPdfGenerator";

/* ─────────────────────────────────────────────
   Dashboard Styles (matching StudentDashboard exactly)
   ───────────────────────────────────────────── */
const FONT_FAMILY = "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif";

const styles = {
  app: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom right, #e0f2fe, #e0e7ff, #fef2f2)",
    color: "#1a1c1e",
    fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
    display: "flex",
    position: "relative" as const,
    overflow: "hidden"
  },
  // Background blobs like in StudentDashboard
  blob1: {
    position: "absolute" as const,
    left: "-8rem",
    top: "-8rem",
    width: "20rem",
    height: "20rem",
    background: "rgba(125, 211, 252, 0.5)",
    borderRadius: "50%",
    filter: "blur(3rem)",
    zIndex: 0,
  },
  blob2: {
    position: "absolute" as const,
    right: "-8rem",
    top: "25%",
    width: "18rem",
    height: "18rem",
    background: "rgba(129, 140, 248, 0.4)",
    borderRadius: "50%",
    filter: "blur(3rem)",
    zIndex: 0,
  },
  blob3: {
    position: "absolute" as const,
    bottom: "-8rem",
    left: "33.333%",
    width: "16rem",
    height: "16rem",
    background: "rgba(251, 207, 232, 0.4)",
    borderRadius: "50%",
    filter: "blur(3rem)",
    zIndex: 0,
  },
  blob4: {
    position: "absolute" as const,
    left: "50%",
    top: "50%",
    width: "14rem",
    height: "14rem",
    transform: "translate(-50%, -50%)",
    background: "rgba(254, 240, 138, 0.3)",
    borderRadius: "50%",
    filter: "blur(3rem)",
    zIndex: 0,
  },
  sidebar: {
    position: "relative" as const,
    zIndex: 1,
    width: "200px",
    minHeight: "100vh",
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(20px)",
    borderRight: "1px solid rgba(241, 245, 249, 0.2)",
    display: "flex",
    flexDirection: "column" as const,
    padding: "1.25rem 0.75rem",
    flexShrink: 0,
  },
  mainContent: {
    position: "relative" as const,
    zIndex: 1,
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    minWidth: 0,
  },
  header: {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(241, 245, 249, 0.2)",
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  main: {
    flex: 1,
    padding: "1.5rem",
    overflowY: "auto" as const,
  },
  card: {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(20px)",
    borderRadius: "0.75rem",
    border: "1px solid rgba(241, 245, 249, 0.2)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
  },
  loading: {
    fontSize: "1rem",
    fontWeight: 500,
    color: "#72a5f8",
    padding: "1rem 2rem",
    borderRadius: "0.75rem",
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 4px 24px rgba(114, 165, 248, 0.1)",
  }
};

/* ─────────────────────────────────────────────
   Circular Progress (University Pulse mood)
   ───────────────────────────────────────────── */
function CircularProgress({ value }: { value: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width="96" height="96" viewBox="0 0 96 96">
      <circle cx="48" cy="48" r={r} fill="none" stroke="#e8f0fe" strokeWidth="8" />
      <circle
        cx="48"
        cy="48"
        r={r}
        fill="none"
        stroke="#72a5f8"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 48 48)"
      />
      <text x="48" y="44" textAnchor="middle" fontSize="16" fontWeight="700" fill="#1e293b">
        {value}%
      </text>
      <text x="48" y="60" textAnchor="middle" fontSize="8" fill="#64748b">
        Positive Mood
      </text>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Score bar for Critical Tokens table
   ───────────────────────────────────────────── */
function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <div
        style={{
          flex: 1,
          height: "6px",
          borderRadius: "3px",
          background: "#f1f5f9",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${score}%`,
            height: "100%",
            borderRadius: "3px",
            background: color,
          }}
        />
      </div>
      <span style={{ fontSize: "0.875rem", fontWeight: "600", color: "#1e293b", minWidth: "2rem" }}>
        {score}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Sentiment badge
   ───────────────────────────────────────────── */
function SentimentBadge({ level }: { level: string }) {
  const cfg: Record<string, { bg: string; color: string; label: string }> = {
    RED: { bg: "#fef2f2", color: "#dc2626", label: "HIGH DISTRESS" },
    HIGH: { bg: "#fff7ed", color: "#ea580c", label: "BURNOUT RISK" },
    MEDIUM: { bg: "#fefce8", color: "#ca8a04", label: "URGENT CALL" },
    LOW: { bg: "#f0fdf4", color: "#16a34a", label: "STABLE" },
    NONE: { bg: "#f8fafc", color: "#64748b", label: "MONITORING" },
  };
  const c = cfg[level] ?? cfg["NONE"];
  return (
    <span
      style={{
        padding: "0.25rem 0.6rem",
        borderRadius: "4px",
        fontSize: "0.7rem",
        fontWeight: "700",
        letterSpacing: "0.04em",
        background: c.bg,
        color: c.color,
      }}
    >
      {c.label}
    </span>
  );
}

/* ─────────────────────────────────────────────
   Sidebar Nav Item
   ───────────────────────────────────────────── */
function NavItem({
  icon,
  label,
  active,
  badge,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: number;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 16px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        background: active ? "#72a5f8" : "transparent",
        color: active ? "white" : "#6b7280",
        fontSize: "14px",
        fontWeight: active ? 500 : 400,
        fontFamily: FONT_FAMILY,
        textAlign: "left",
        transition: "all 0.15s ease",
      }}
    >
      {icon}
      <span style={{ flex: 1 }}>{label}</span>
      {badge != null && badge > 0 && (
        <span
          style={{
            background: active ? "rgba(255,255,255,0.25)" : "#ef4444",
            color: "white",
            fontSize: "0.7rem",
            fontWeight: 700,
            padding: "0.1rem 0.45rem",
            borderRadius: "9999px",
            fontFamily: FONT_FAMILY,
          }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

/* ─────────────────────────────────────────────
   Risk level colors
   ───────────────────────────────────────────── */
const RISK_META: Record<
  string,
  { label: string; icon: React.ReactNode; border: string; scoreFg: string; bg: string }
> = {
  HIGH_RISK: {
    label: "Высокий риск",
    icon: <AlertTriangle size={16} />,
    border: "#fecaca",
    scoreFg: "#ef4444",
    bg: "#fef2f2",
  },
  MEDIUM_RISK: {
    label: "Средний риск",
    icon: <AlertTriangle size={16} />,
    border: "#fef08a",
    scoreFg: "#eab308",
    bg: "#fefce8",
  },
  LOW_RISK: {
    label: "Низкий риск",
    icon: <LayoutDashboard size={16} />,
    border: "#bbf7d0",
    scoreFg: "#22c55e",
    bg: "#f0fdf4",
  },
};

/* ═════════════════════════════════════════════
   MAIN DASHBOARD
   ═════════════════════════════════════════════ */
export default function Dashboard() {
  const [students, setStudents] = useState<StudentRiskDto[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("dashboard");
  const navigate = useNavigate();
  const { token, role } = useAuthStore();

  useEffect(() => {
    const load = async () => {
      try {
        // Fetch students independently
        try {
          const studentsData = await fetchStudents();
          setStudents(studentsData);
        } catch (studentsError) {
          console.error("Students fetch error:", studentsError);
          setStudents([]); // Set empty array on error
        }
        
        // Fetch stats independently
        try {
          const statsData = await fetchDashboardStats();
          setStats(statsData);
        } catch (statsError) {
          console.error("Stats fetch error:", statsError);
          setStats(null); // Set null on error
        }
      } catch (error) {
        console.error("Dashboard load error:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const generatePDF = () => {
    const data = students.map((s) => ({
      displayName: s.displayName || "Unknown",
      riskLevel: s.riskLevel || "UNKNOWN",
      riskScore: s.riskScore || 0,
      lastCheckInAt: s.lastCheckInAt || null,
      hasSos: s.hasSos || false,
    }));
    generateStudentsPDF(data);
  };

  /* ── derived stats ── */
  const criticalStudents = students.filter(
    (s) => s.riskLevel === "HIGH"
  );
  const warningStudents = students.filter((s) => s.riskLevel === "MEDIUM");
  const stableStudents = students.filter((s) => s.riskLevel === "LOW");
  const totalStudents = students.length;
  const positiveMood = totalStudents > 0
    ? Math.round((stableStudents.length / totalStudents) * 100)
    : 0;
  const engagementRate = stats?.riskPercentage
    ? Math.round(100 - stats.riskPercentage)
    : 0;

  /* ── Priority sorting for Critical Tokens Table ── */
  const getRiskPriority = (level: string) => {
    switch (level) {
      case "HIGH":
        return 1; // Critical - highest priority
      case "MEDIUM":
        return 2; // Warning - medium priority
      case "LOW":
        return 3; // Stable - lowest priority
      default:
        return 4;
    }
  };

  /* ── faculty heatmap: group students by risk level if available ── */
  const faculties = [
    { key: "HIGH_RISK", avg: criticalStudents.length || 0, trend: "Требуют внимания", trendUp: false },
    { key: "MEDIUM_RISK", avg: warningStudents.length || 0, trend: "Наблюдение", trendUp: null },
    { key: "LOW_RISK", avg: stableStudents.length || 0, trend: "Стабильны", trendUp: true },
  ];

  const handleUpdateBookingUrl = async () => {
    const newUrl = prompt("Введите ссылку для записи (например, Calendly или Google Calendar):", stats?.hasBookingUrl ? "" : "");
    if (newUrl === null) return;
    
    try {
      await updateBookingUrl(newUrl);
      const statsData = await fetchDashboardStats();
      setStats(statsData);
      alert("Ссылка успешно обновлена");
    } catch (error) {
      console.error("Error updating booking URL:", error);
      alert("Ошибка при обновлении ссылки");
    }
  };

  if (loading) {
    return (
      <div style={styles.app}>
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={styles.loading}
        >
          Loading dashboard…
        </motion.div>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      {/* Background blobs like StudentDashboard */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />
      <div style={styles.blob3} />
      <div style={styles.blob4} />
      
      {/* ─── Sidebar ─── */}
      <aside style={styles.sidebar}>
        {/* Logo */}
        <div style={{ marginBottom: "2rem", paddingLeft: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "#72a5f8",
              }}
            >
              <Zap size={20} />
            </div>
            <div>
              <h1 style={{ fontSize: "16px", fontWeight: 500, margin: 0, color: "#72a5f8", fontFamily: FONT_FAMILY }}>
                QamCore
              </h1>
              <span style={{ fontSize: "0.8rem", color: "#6b7280", margin: 0, fontWeight: 400, fontFamily: FONT_FAMILY }}>Портал психолога</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem", flex: 1 }}>
          <NavItem
            icon={<LayoutDashboard size={16} />}
            label="Панель управления"
            active={activeNav === "dashboard"}
            onClick={() => setActiveNav("dashboard")}
          />
          <NavItem
            icon={<AlertTriangle size={16} />}
            label="Жалобы"
            active={activeNav === "complaints"}
            onClick={() => {
              setActiveNav("complaints");
              navigate("/complaints");
            }}
            badge={criticalStudents.length}
          />
          <NavItem
            icon={<MessageSquare size={16} />}
            label="Сообщения"
            active={activeNav === "messages"}
            onClick={() => {
              setActiveNav("messages");
              navigate("/messages");
            }}
            badge={criticalStudents.length}
          />
        </nav>

        {/* Profile */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 8px",
            borderTop: "1px solid rgba(241, 245, 249, 0.2)",
            marginTop: "auto",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #72a5f8, #a78bfa)",
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: "#1a1c1e", fontSize: "14px", fontWeight: 500, margin: 0, fontFamily: FONT_FAMILY }}>
              Психолог
            </p>
            <p style={{ color: "#6b7280", fontSize: "12px", margin: 0, fontWeight: 400, fontFamily: FONT_FAMILY }}>Сотрудник</p>
          </div>
          <button
            onClick={() => navigate("/login")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#6b7280",
              display: "flex",
              padding: "4px",
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <div style={styles.mainContent}>
        {/* Top bar */}
        <header style={styles.header}>
          {/* Real filters based on actual data */}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.875rem", color: "#6b7280", fontWeight: 500 }}>
              Всего студентов: {totalStudents}
            </span>
            {criticalStudents.length > 0 && (
              <span style={{ 
                fontSize: "0.875rem", 
                color: "#ef4444", 
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "0.25rem"
              }}>
                <AlertTriangle size={14} />
                Критических: {criticalStudents.length}
              </span>
            )}
          </div>

          <div style={{ flex: 1 }} />

          {/* SOS */}
          {stats?.hasBookingUrl === false && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleUpdateBookingUrl}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.5rem 1rem",
                borderRadius: "0.4rem",
                background: "#72a5f8",
                border: "none",
                color: "white",
                fontWeight: 700,
                fontSize: "0.8rem",
                cursor: "pointer",
                letterSpacing: "0.04em",
                marginRight: "0.5rem"
              }}
            >
              УКАЗАТЬ ССЫЛКУ ДЛЯ ЗАПИСИ
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.5rem 1rem",
              borderRadius: "0.4rem",
              background: "#ef4444",
              border: "none",
              color: "white",
              fontWeight: 700,
              fontSize: "0.8rem",
              cursor: "pointer",
              letterSpacing: "0.04em",
            }}
          >
            <Zap size={13} />
            SOS – EMERGENCY RESPONSE
          </motion.button>

          {/* PDF download */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={generatePDF}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.5rem 0.85rem",
              borderRadius: "0.4rem",
              background: "#f1f5f9",
              border: "1px solid #e2e8f0",
              color: "#374151",
              fontSize: "0.8rem",
              cursor: "pointer",
            }}
          >
            <Download size={14} />
          </motion.button>

          {/* Bell */}
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#94a3b8",
              display: "flex",
              padding: "0.4rem",
            }}
          >
            <Bell size={18} />
          </button>
        </header>

        {/* Page body */}
        <main style={styles.main}>

          {/* ── University Pulse ── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: "1.5rem" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <LayoutDashboard size={18} color="#72a5f8" />
              <h2 style={{ fontSize: "1.05rem", fontWeight: 500, color: "#1a1c1e", margin: 0, fontFamily: FONT_FAMILY }}>
                Пульс университета
              </h2>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              {/* Positive mood */}
              <div style={{ ...styles.card, padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem", minWidth: "200px" }}>
                <CircularProgress value={positiveMood} />
                <div>
                  <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: "0 0 0.25rem", fontFamily: FONT_FAMILY }}>
                    Позитивное настроение
                  </p>
                  <p style={{ fontSize: "1.35rem", fontWeight: 800, color: "#22c55e", margin: 0, fontFamily: FONT_FAMILY }}>
                    Здоровое
                  </p>
                </div>
              </div>

              {/* Engagement */}
              <div style={{ ...styles.card, padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", justifyContent: "center", minWidth: "160px" }}>
                <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: "0 0 0.5rem", fontFamily: FONT_FAMILY }}>
                  Уровень вовлеченности
                </p>
                <p style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1a1c1e", margin: 0 }}>
                  {engagementRate}%
                  <span style={{ fontSize: "0.75rem", color: "#22c55e", marginLeft: "0.4rem" }}>
                    ↗{stats?.riskPercentage ?? 0}%
                  </span>
                </p>
              </div>

              {/* STABLE */}
              <div style={{ ...styles.card, padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
                  <span style={{ fontSize: "0.75rem", color: "#22c55e", fontWeight: 600, fontFamily: FONT_FAMILY }}>СТАБИЛЬНО</span>
                </div>
                <p style={{ fontSize: "2rem", fontWeight: 800, color: "#22c55e", margin: 0, fontFamily: FONT_FAMILY }}>
                  {stableStudents.length || stats?.totalStudents || 0}
                </p>
              </div>

              {/* WARNING */}
              <div style={{ ...styles.card, padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem" }}>
                  <AlertTriangle size={12} color="#eab308" />
                  <span style={{ fontSize: "0.75rem", color: "#eab308", fontWeight: 600, fontFamily: FONT_FAMILY }}>ПРЕДУПРЕЖДЕНИЕ</span>
                </div>
                <p style={{ fontSize: "2rem", fontWeight: 800, color: "#eab308", margin: 0, fontFamily: FONT_FAMILY }}>
                  {warningStudents.length || 0}
                </p>
              </div>

              {/* CRITICAL */}
              <div style={{ ...styles.card, padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "#ef4444", fontWeight: 600, fontFamily: FONT_FAMILY }}>⊗ КРИТИЧНО</span>
                </div>
                <p style={{ fontSize: "2rem", fontWeight: 800, color: "#ef4444", margin: 0 }}>
                  {criticalStudents.length || 0}
                </p>
              </div>
            </div>
          </motion.section>

          {/* ── Faculty Heatmap ── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            style={{ marginBottom: "1.5rem" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Zap size={18} color="#72a5f8" />
                <h2 style={{ fontSize: "1.05rem", fontWeight: 500, color: "#1a1c1e", margin: 0, fontFamily: FONT_FAMILY }}>
                  Тепловая карта факультетов
                </h2>
              </div>
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#72a5f8",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                }}
              >
                Посмотреть все кластеры
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
              {faculties.map((fac) => {
                const meta = RISK_META[fac.key];
                return (
                  <motion.div
                    key={fac.key}
                    whileHover={{ translateY: -2 }}
                    style={{
                      background: meta.bg,
                      border: `1px solid ${meta.border}`,
                      borderRadius: "0.75rem",
                      padding: "1.25rem",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1a1c1e" }}>
                        {meta.label}
                      </span>
                      <span style={{ color: meta.scoreFg }}>{meta.icon}</span>
                    </div>
                    <p style={{ margin: "0 0 0.25rem" }}>
                      <span
                        style={{
                          fontSize: "1.75rem",
                          fontWeight: 800,
                          color: meta.scoreFg,
                        }}
                      >
                        {fac.avg}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "#6b7280", marginLeft: "0.25rem" }}>
                        студентов
                      </span>
                    </p>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: fac.trendUp === false ? "#ef4444" : fac.trendUp ? "#22c55e" : "#6b7280",
                        margin: 0,
                      }}
                    >
                      {fac.trend}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* ── Critical Tokens Table ── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div style={{ ...styles.card, overflow: "hidden" }}>
              <div
                style={{
                  padding: "1.25rem 1.5rem",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.8)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <h2 style={{ fontSize: "1rem", fontWeight: 500, color: "#1a1c1e", margin: "0 0 0.2rem", fontFamily: FONT_FAMILY }}>
                    Таблица студентов
                  </h2>
                  <p style={{ fontSize: "0.78rem", color: "#6b7280", margin: 0 }}>
                    Студенты требующие немедленной психологической помощи
                  </p>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#6b7280",
                      display: "flex",
                      padding: "0.3rem",
                    }}
                  >
                    ≡
                  </button>
                  <button
                    onClick={generatePDF}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#6b7280",
                      display: "flex",
                      padding: "0.3rem",
                    }}
                  >
                    <Download size={16} />
                  </button>
                </div>
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    {["ID СТУДЕНТА", "ФАКУЛЬТЕТ / ГРУППА", "ПОСЛЕДНЯЯ ПРОВЕРКА", "УРОВЕНЬ ТРЕВОГИ", "НАСТРОЕНИЕ", "ДЕЙСТВИЯ"].map(
                      (h) => (
                        <th
                          key={h}
                          style={{
                            padding: "0.75rem 1.25rem",
                            textAlign: "left",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            color: "#94a3b8",
                            letterSpacing: "0.07em",
                          }}
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {(students.length > 0
                    ? (() => {
                        const sortedStudents = students
                          .sort((a, b) => {
                            // Сначала сортируем по приоритету риска (красные → желтые → зеленые)
                            const priorityA = getRiskPriority(a.riskLevel);
                            const priorityB = getRiskPriority(b.riskLevel);
                            if (priorityA !== priorityB) {
                              return priorityA - priorityB;
                            }
                            // Внутри одной группы сортируем по riskScore (убывание)
                            return (b.riskScore || 0) - (a.riskScore || 0);
                          })
                          .slice(0, 5);
                        // Debug: выводим отсортированных студентов
                        // console.log("Sorted students for table:", sortedStudents);
                        return sortedStudents;
                      })()
                    : [] as StudentRiskDto[]
                  ).map((s, i) => {
                    const scoreColor =
                      s.riskScore >= 85 ? "#ef4444" : s.riskScore >= 70 ? "#f59e0b" : "#22c55e";
                    const checkIn = s.lastCheckInAt
                      ? (() => {
                          const diff = Date.now() - new Date(s.lastCheckInAt).getTime();
                          const hrs = Math.round(diff / 3600000);
                          return hrs < 1 ? "Just now" : `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
                        })()
                      : "No data";
                    return (
                      <motion.tr
                        key={s.studentId}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.06 }}
                        style={{ borderBottom: "1px solid #f8fafc" }}
                      >
                        <td style={{ padding: "1rem 1.25rem", fontSize: "0.875rem", fontWeight: 600, color: "#1a1c1e" }}>
                          #{s.studentId}
                        </td>
                        <td style={{ padding: "1rem 1.25rem" }}>
                          <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "#1a1c1e", margin: 0 }}>
                            {s.displayName?.split("/")[0]?.trim() || s.displayName || "Unknown"}
                          </p>
                          <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: 0 }}>
                            {s.displayName?.split("/")[1]?.trim() || ""}
                          </p>
                        </td>
                        <td style={{ padding: "1rem 1.25rem", fontSize: "0.82rem", color: "#6b7280" }}>
                          {checkIn}
                        </td>
                        <td style={{ padding: "1rem 1.25rem", minWidth: "140px" }}>
                          <ScoreBar score={s.riskScore || 0} color={scoreColor} />
                        </td>
                        <td style={{ padding: "1rem 1.25rem" }}>
                          <SentimentBadge level={s.riskLevel} />
                        </td>
                        <td style={{ padding: "1rem 1.25rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => navigate(`/dashboard/${s.studentId}`)}
                              style={{
                                padding: "0.4rem 0.9rem",
                                borderRadius: "0.4rem",
                                background: "#72a5f8",
                                border: "none",
                                color: "white",
                                fontSize: "0.78rem",
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              Start Chat
                            </motion.button>
                            <button
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#94a3b8",
                                display: "flex",
                              }}
                            >
                              <MoreVertical size={14} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination */}
              <div
                style={{
                  padding: "0.75rem 1.25rem",
                  borderTop: "1px solid rgba(255, 255, 255, 0.8)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>
                  Showing {Math.min(students.length, 5)} of {stats?.riskGroupCount || students.length} critical cases
                </span>
                <div style={{ display: "flex", gap: "0.25rem" }}>
                  <button
                    style={{
                      width: "28px",
                      height: "28px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "0.3rem",
                      background: "white",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#6b7280",
                    }}
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    style={{
                      width: "28px",
                      height: "28px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "0.3rem",
                      background: "white",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#6b7280",
                    }}
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </motion.section>
        </main>
      </div>
    </div>
  );
}
