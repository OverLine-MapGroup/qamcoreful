import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  AlertTriangle,
  MessageSquare,
  LogOut,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  Tag,
  Users,
  FileText,
  ThumbsUp,
  ThumbsDown,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/auth";
import { 
  getPsychologistComplaints, 
  resolvePsychologistComplaint,
  Complaint,
  PaginatedResponse,
  ResolveComplaintRequest 
} from "../api/psychologist";
import { 
  getSchoolAdminComplaints, 
  resolveSchoolAdminComplaint 
} from "../api/schoolAdmin";

/* ─────────────────────────────────────────────
   Complaints Styles (matching Dashboard exactly)
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
   Sidebar Nav Item
   ───────────────────────────────────────────── */
function NavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
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
    </button>
  );
}

/* ─────────────────────────────────────────────
   Complaint Status Badge
   ───────────────────────────────────────────── */
function ComplaintStatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { bg: string; color: string; label: string }> = {
    NEW: { bg: "#dbeafe", color: "#2563eb", label: "НОВАЯ" },
    IN_PROGRESS: { bg: "#fef3c7", color: "#d97706", label: "В РАБОТЕ" },
    RESOLVED_SUCCESS: { bg: "#d1fae5", color: "#059669", label: "РЕШЕНА" },
    RESOLVED_REJECTED: { bg: "#fee2e2", color: "#dc2626", label: "ОТКЛОНЕНА" },
    RESOLVED_SPAM: { bg: "#f3f4f6", color: "#6b7280", label: "СПАМ" },
  };
  const c = cfg[status] ?? cfg["NEW"];
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
   Category Badge
   ───────────────────────────────────────────── */
function CategoryBadge({ category }: { category: string }) {
  const cfg: Record<string, { bg: string; color: string; label: string }> = {
    BULLYING: { bg: "#fee2e2", color: "#dc2626", label: "âóëëèíã" },
    HARASSMENT: { bg: "#ddd6fe", color: "#7c3aed", label: "Õàðàññìåíò" },
    DISCRIMINATION: { bg: "#fed7aa", color: "#ea580c", label: "Äèñêðèìèíàöèÿ" },
    SAFETY: { bg: "#d1fae5", color: "#059669", label: "Áåçîïàñíîñòü" },
    OTHER: { bg: "#f3f4f6", color: "#6b7280", label: "Äðóãîå" },
  };
  const c = cfg[category] ?? cfg["OTHER"];
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

/* ═════════════════════════════════════════════
   COMPLAINTS DASHBOARD PAGE
   ═════════════════════════════════════════════ */
export default function Complaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [resolveData, setResolveData] = useState<ResolveComplaintRequest>({
    status: "IN_PROGRESS",
    resolutionComment: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const navigate = useNavigate();
  const { role: userRole, logout } = useAuthStore();

  useEffect(() => {
    loadComplaints();
  }, [currentPage, userRole]);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      let response: PaginatedResponse<Complaint>;
      
      if (userRole === "PSYCHOLOGIST") {
        response = await getPsychologistComplaints(currentPage, 20);
      } else if (userRole === "SCHOOL_ADMIN" || userRole === "ADMIN") {
        response = await getSchoolAdminComplaints(currentPage, 20);
      } else {
        response = {
          content: [],
          totalPages: 0,
          totalElements: 0,
          pageable: {
            pageNumber: 0,
            paged: false,
            pageSize: 0,
            unpaged: true,
            offset: 0,
            sort: {
              sorted: false,
              unsorted: true,
              empty: true
            }
          },
          numberOfElements: 0,
          size: 0,
          number: 0,
          sort: {
            sorted: false,
            unsorted: true,
            empty: true
          },
          first: true,
          last: true,
          empty: true
        } as PaginatedResponse<Complaint>;
      }
      
      setComplaints(response.content || []);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
    } catch (error) {
      console.error("Error loading complaints:", error);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveComplaint = async () => {
    if (!selectedComplaint) return;

    try {
      if (userRole === "PSYCHOLOGIST") {
        await resolvePsychologistComplaint(selectedComplaint.id, resolveData);
      } else {
        await resolveSchoolAdminComplaint(selectedComplaint.id, resolveData);
      }
      
      await loadComplaints();
      setShowResolveModal(false);
      setSelectedComplaint(null);
      setResolveData({ status: "IN_PROGRESS", resolutionComment: "" });
      alert("Жалоба успешно обновлена");
    } catch (error) {
      console.error("Error resolving complaint:", error);
      alert("Ошибка при обновлении жалобы");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || complaint.status === filterStatus;
    const matchesCategory = !filterCategory || complaint.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  if (loading) {
    return (
      <div style={styles.app}>
        <div style={{ ...styles.loading, margin: "2rem auto" }}>
          Загрузка жалоб...
        </div>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      {/* Background Blobs */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />
      <div style={styles.blob3} />
      <div style={styles.blob4} />

      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ 
            color: "#1a1c1e", 
            fontSize: "1.25rem", 
            fontWeight: 700, 
            margin: 0 
          }}>
            Жалобы
          </h2>
          <p style={{ 
            color: "#6b7280", 
            fontSize: "0.875rem", 
            margin: "0.25rem 0 0" 
          }}>
            Анонимные сообщения
          </p>
        </div>

        <NavItem
          icon={<LayoutDashboard size={18} />}
          label="Панель"
          onClick={() => navigate("/dashboard")}
        />
        
        <NavItem
          icon={<MessageSquare size={18} />}
          label="Кейсы"
          onClick={() => navigate("/messages")}
        />

        <NavItem
          icon={<AlertTriangle size={18} />}
          label="Жалобы"
          active={true}
        />

        <div style={{ marginTop: "auto", paddingTop: "1rem" }}>
          <NavItem
            icon={<LogOut size={18} />}
            label="Выход"
            onClick={handleLogout}
          />
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={{ 
            fontSize: "1.5rem", 
            fontWeight: 700, 
            color: "#1a1c1e", 
            margin: 0 
          }}>
            Жалобы ({totalElements})
          </h1>
          
          <div style={{ marginLeft: "auto", display: "flex", gap: "0.75rem" }}>
            <div style={{ 
              position: "relative", 
              display: "flex", 
              alignItems: "center" 
            }}>
              <Search size={18} style={{ 
                position: "absolute", 
                left: "0.75rem", 
                color: "#6b7280" 
              }} />
              <input
                type="text"
                placeholder="Поиск жалоб..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  paddingLeft: "2.5rem",
                  paddingRight: "0.75rem",
                  paddingTop: "0.5rem",
                  paddingBottom: "0.5rem",
                  border: "1px solid rgba(241, 245, 249, 0.2)",
                  borderRadius: "0.5rem",
                  background: "rgba(255, 255, 255, 0.8)",
                  fontSize: "0.875rem",
                  color: "#1a1c1e",
                  outline: "none",
                  width: "250px",
                }}
              />
            </div>
          </div>
        </div>

        {/* Main */}
        <div style={styles.main}>
          {/* Filters */}
          <div style={{ ...styles.card, padding: "1rem", marginBottom: "1rem" }}>
            <div style={{ 
              display: "flex", 
              gap: "1rem", 
              alignItems: "center",
              flexWrap: "wrap" as const
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Filter size={16} style={{ color: "#6b7280" }} />
                <span style={{ fontSize: "0.875rem", color: "#6b7280", fontWeight: 500 }}>
                  Фильтры:
                </span>
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  padding: "0.5rem 0.75rem",
                  border: "1px solid rgba(241, 245, 249, 0.2)",
                  borderRadius: "0.5rem",
                  background: "rgba(255, 255, 255, 0.8)",
                  fontSize: "0.875rem",
                  color: "#1a1c1e",
                }}
              >
                <option value="">Все статусы</option>
                <option value="NEW">Новые</option>
                <option value="IN_PROGRESS">В работе</option>
                <option value="RESOLVED_SUCCESS">Решены</option>
                <option value="RESOLVED_REJECTED">Отклонены</option>
                <option value="RESOLVED_SPAM">Спам</option>
              </select>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                style={{
                  padding: "0.5rem 0.75rem",
                  border: "1px solid rgba(241, 245, 249, 0.2)",
                  borderRadius: "0.5rem",
                  background: "rgba(255, 255, 255, 0.8)",
                  fontSize: "0.875rem",
                  color: "#1a1c1e",
                }}
              >
                <option value="">All categories</option>
                <option value="BULLYING">âóëëèíã</option>
                <option value="HARASSMENT">Õàðàññìåíò</option>
                <option value="DISCRIMINATION">Äèñêðèìèíàöèÿ</option>
                <option value="SAFETY">Áåçîïàñíîñòü</option>
                <option value="OTHER">Äðóãîå</option>
              </select>

              <div style={{ marginLeft: "auto", fontSize: "0.875rem", color: "#6b7280" }}>
                Показано: {filteredComplaints.length} из {totalElements}
              </div>
            </div>
          </div>

          {/* Complaints List */}
          <div style={{ ...styles.card, padding: "1rem" }}>
            {filteredComplaints.length === 0 ? (
              <div style={{ 
                textAlign: "center", 
                padding: "3rem", 
                color: "#6b7280" 
              }}>
                <FileText size={48} style={{ margin: "0 auto 1rem", opacity: 0.5 }} />
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, margin: "0 0 0.5rem" }}>
                  Нет жалоб
                </h3>
                <p style={{ fontSize: "0.9rem", margin: 0 }}>
                  {searchTerm || filterStatus || filterCategory 
                    ? "Попробуйте изменить фильтры" 
                    : "Жалоб пока нет"}
                </p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: "1rem" }}>
                  {filteredComplaints.map((complaint, index) => (
                    <motion.div
                      key={complaint.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      style={{
                        padding: "1rem",
                        border: "1px solid rgba(241, 245, 249, 0.2)",
                        borderRadius: "0.5rem",
                        marginBottom: "1rem",
                        backgroundColor: "rgba(255, 255, 255, 0.5)",
                      }}
                    >
                      <div style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "flex-start",
                        marginBottom: "0.75rem"
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            display: "flex", 
                            gap: "0.5rem", 
                            marginBottom: "0.5rem",
                            flexWrap: "wrap" as const
                          }}>
                            <CategoryBadge category={complaint.category} />
                            <ComplaintStatusBadge status={complaint.status} />
                          </div>
                          
                          <div style={{ 
                            fontSize: "0.9rem", 
                            color: "#1a1c1e", 
                            lineHeight: "1.5",
                            marginBottom: "0.5rem"
                          }}>
                            {complaint.text}
                          </div>
                          
                          <div style={{ 
                            fontSize: "0.75rem", 
                            color: "#6b7280",
                            display: "flex",
                            gap: "1rem",
                            alignItems: "center"
                          }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                              <Clock size={12} />
                              {new Date(complaint.createdAt).toLocaleDateString()}
                            </span>
                            {complaint.updatedAt !== complaint.createdAt && (
                              <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                                Обновлено: {new Date(complaint.updatedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>

                          {complaint.resolutionComment && (
                            <div style={{
                              marginTop: "0.5rem",
                              padding: "0.5rem",
                              backgroundColor: "rgba(34, 197, 94, 0.1)",
                              borderRadius: "0.375rem",
                              fontSize: "0.875rem",
                              color: "#059669",
                            }}>
                              <strong>Решение:</strong> {complaint.resolutionComment}
                            </div>
                          )}
                        </div>

                        <div style={{ display: "flex", gap: "0.5rem", marginLeft: "1rem" }}>
                          {complaint.status !== "RESOLVED_SUCCESS" && 
                           complaint.status !== "RESOLVED_REJECTED" && 
                           complaint.status !== "RESOLVED_SPAM" && (
                            <button
                              onClick={() => {
                                setSelectedComplaint(complaint);
                                setShowResolveModal(true);
                              }}
                              style={{
                                padding: "0.5rem 0.75rem",
                                backgroundColor: "#72a5f8",
                                color: "white",
                                border: "none",
                                borderRadius: "0.375rem",
                                cursor: "pointer",
                                fontSize: "0.875rem",
                                fontWeight: 500,
                                display: "flex",
                                alignItems: "center",
                                gap: "0.25rem",
                              }}
                            >
                              <CheckCircle size={14} />
                              Решить
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "0.5rem",
                    paddingTop: "1rem",
                    borderTop: "1px solid rgba(241, 245, 249, 0.2)",
                  }}>
                    <button
                      onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                      disabled={currentPage === 0}
                      style={{
                        padding: "0.5rem 0.75rem",
                        backgroundColor: currentPage === 0 ? "transparent" : "#72a5f8",
                        color: currentPage === 0 ? "#6b7280" : "white",
                        border: "1px solid rgba(241, 245, 249, 0.2)",
                        borderRadius: "0.375rem",
                        cursor: currentPage === 0 ? "not-allowed" : "pointer",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      <ChevronLeft size={16} />
                      Назад
                    </button>

                    <span style={{ 
                      fontSize: "0.875rem", 
                      color: "#6b7280",
                      padding: "0 1rem"
                    }}>
                      Страница {currentPage + 1} из {totalPages}
                    </span>

                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                      disabled={currentPage === totalPages - 1}
                      style={{
                        padding: "0.5rem 0.75rem",
                        backgroundColor: currentPage === totalPages - 1 ? "transparent" : "#72a5f8",
                        color: currentPage === totalPages - 1 ? "#6b7280" : "white",
                        border: "1px solid rgba(241, 245, 249, 0.2)",
                        borderRadius: "0.375rem",
                        cursor: currentPage === totalPages - 1 ? "not-allowed" : "pointer",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      Вперед
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Resolve Modal */}
      {showResolveModal && selectedComplaint && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: "white",
              borderRadius: "0.75rem",
              padding: "1.5rem",
              width: "90%",
              maxWidth: "500px",
            }}
          >
            <h3 style={{ 
              fontSize: "1.25rem", 
              fontWeight: 600, 
              color: "#1a1c1e", 
              margin: "0 0 1rem 0" 
            }}>
              Решение жалобы
            </h3>

            <div style={{ marginBottom: "1rem" }}>
              <div style={{ 
                padding: "0.75rem", 
                backgroundColor: "rgba(241, 245, 249, 0.5)",
                borderRadius: "0.5rem",
                marginBottom: "1rem"
              }}>
                <div style={{ 
                  display: "flex", 
                  gap: "0.5rem", 
                  marginBottom: "0.5rem"
                }}>
                  <CategoryBadge category={selectedComplaint.category} />
                  <ComplaintStatusBadge status={selectedComplaint.status} />
                </div>
                <p style={{ 
                  fontSize: "0.9rem", 
                  color: "#1a1c1e", 
                  margin: 0 
                }}>
                  {selectedComplaint.text}
                </p>
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ 
                display: "block", 
                fontSize: "0.875rem", 
                fontWeight: 500, 
                color: "#1a1c1e", 
                marginBottom: "0.5rem" 
              }}>
                Статус решения:
              </label>
              <select
                value={resolveData.status}
                onChange={(e) => setResolveData({ ...resolveData, status: e.target.value as any })}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  fontFamily: "inherit",
                }}
              >
                <option value="IN_PROGRESS">В работе</option>
                <option value="RESOLVED_SUCCESS">Успешно решено</option>
                <option value="RESOLVED_REJECTED">Отклонено</option>
                <option value="RESOLVED_SPAM">Спам</option>
              </select>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ 
                display: "block", 
                fontSize: "0.875rem", 
                fontWeight: 500, 
                color: "#1a1c1e", 
                marginBottom: "0.5rem" 
              }}>
                Комментарий к решению:
              </label>
              <textarea
                value={resolveData.resolutionComment}
                onChange={(e) => setResolveData({ ...resolveData, resolutionComment: e.target.value })}
                required
                rows={4}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
                placeholder="Опишите, как была решена эта жалоба..."
              />
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => {
                  setShowResolveModal(false);
                  setSelectedComplaint(null);
                  setResolveData({ status: "IN_PROGRESS", resolutionComment: "" });
                }}
                style={{
                  padding: "0.75rem 1rem",
                  backgroundColor: "transparent",
                  color: "#6b7280",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              >
                Отмена
              </button>
              <button
                onClick={handleResolveComplaint}
                style={{
                  padding: "0.75rem 1rem",
                  backgroundColor: "#72a5f8",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              >
                Сохранить
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}