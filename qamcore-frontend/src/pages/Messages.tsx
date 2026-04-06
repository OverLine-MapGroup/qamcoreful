import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  AlertTriangle,
  MessageSquare,
  LogOut,
  Search,
  Users,
  Plus,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/auth";
import { 
  fetchStudents, 
  createCase, 
  resolveCase, 
  getStudentCases, 
  PsychologistCase, 
  CreateCaseRequest,
  StudentRiskDto 
} from "../api/psychologist";


/* ─────────────────────────────────────────────
   Messages Styles (matching Dashboard exactly)
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
    display: "flex",
    gap: "1.5rem",
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

/* ═════════════════════════════════════════════
   PSYCHOLOGIST CASE SYSTEM PAGE
   ═════════════════════════════════════════════ */
export default function Messages() {
  const [students, setStudents] = useState<StudentRiskDto[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentRiskDto | null>(null);
  const [cases, setCases] = useState<PsychologistCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateCase, setShowCreateCase] = useState(false);
  const [newCase, setNewCase] = useState<CreateCaseRequest>({
    message: "",
    communicationLink: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      loadStudentCases(selectedStudent.studentId);
    }
  }, [selectedStudent]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const studentsData = await fetchStudents(searchTerm);
      setStudents(studentsData);
    } catch (error) {
      console.error("Error loading students:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStudentCases = async (studentId: number) => {
    try {
      const casesData = await getStudentCases(studentId);
      // Ensure cases is always an array
      setCases(Array.isArray(casesData) ? casesData : []);
    } catch (error) {
      console.error("Error loading student cases:", error);
      // Ensure cases is always an array even on error
      setCases([]);
    }
  };

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    try {
      const createdCase = await createCase(selectedStudent.studentId, newCase);
      // Ensure cases is an array before spreading
      setCases(prevCases => [...(Array.isArray(prevCases) ? prevCases : []), createdCase]);
      setNewCase({ message: "", communicationLink: "" });
      setShowCreateCase(false);
      alert("Кейс успешно создан");
    } catch (error) {
      console.error("Error creating case:", error);
      alert("Ошибка при создании кейса");
    }
  };

  const handleResolveCase = async (caseId: number) => {
    try {
      await resolveCase(caseId);
      setCases(prevCases => {
        const casesArray = Array.isArray(prevCases) ? prevCases : [];
        return casesArray.map(c => 
          c.caseId === caseId 
            ? { ...c, status: "RESOLVED", resolvedAt: new Date().toISOString() }
            : c
        );
      });
      alert("Кейс успешно закрыт");
    } catch (error) {
      console.error("Error resolving case:", error);
      alert("Ошибка при закрытии кейса");
    }
  };


  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const filteredStudents = students.filter(student =>
    student.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={styles.app}>
        <div style={{ ...styles.loading, margin: "2rem auto" }}>
          Загрузка студентов...
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
            Кейсы
          </h2>
          <p style={{ 
            color: "#6b7280", 
            fontSize: "0.875rem", 
            margin: "0.25rem 0 0" 
          }}>
            Односторонняя связь
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
          active={true}
        />

        <NavItem
          icon={<AlertTriangle size={18} />}
          label="Жалобы"
          onClick={() => navigate("/complaints")}
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
            Психологические кейсы
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
                placeholder="Поиск студентов..."
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
          {/* Students List */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ ...styles.card, padding: "1rem", marginBottom: "1rem" }}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                marginBottom: "1rem"
              }}>
                <h3 style={{ 
                  fontSize: "1rem", 
                  fontWeight: 600, 
                  color: "#1a1c1e", 
                  margin: 0 
                }}>
                  Студенты
                </h3>
                <span style={{ 
                  fontSize: "0.875rem", 
                  color: "#6b7280" 
                }}>
                  {filteredStudents.length} студентов
                </span>
              </div>

              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                {filteredStudents.map((student) => (
                  <motion.div
                    key={student.studentId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ backgroundColor: "rgba(114, 165, 248, 0.1)" }}
                    onClick={() => setSelectedStudent(student)}
                    style={{
                      padding: "0.75rem",
                      borderRadius: "0.5rem",
                      cursor: "pointer",
                      border: selectedStudent?.studentId === student.studentId 
                        ? "2px solid #72a5f8" 
                        : "1px solid rgba(241, 245, 249, 0.2)",
                      backgroundColor: selectedStudent?.studentId === student.studentId 
                        ? "rgba(114, 165, 248, 0.1)" 
                        : "transparent",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ 
                          fontSize: "0.9rem", 
                          fontWeight: 500, 
                          color: "#1a1c1e" 
                        }}>
                          {student.displayName}
                        </div>
                        <div style={{ 
                          fontSize: "0.75rem", 
                          color: "#6b7280" 
                        }}>
                          Риск: {student.riskLevel} • Балл: {student.riskScore}
                        </div>
                      </div>
                      <div style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: student.hasSos ? "#ef4444" : "#10b981",
                      }} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Cases Section */}
          <div style={{ flex: 2, minWidth: 0 }}>
            {selectedStudent ? (
              <>
                {/* Student Info */}
                <div style={{ ...styles.card, padding: "1rem", marginBottom: "1rem" }}>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center"
                  }}>
                    <div>
                      <h3 style={{ 
                        fontSize: "1.1rem", 
                        fontWeight: 600, 
                        color: "#1a1c1e", 
                        margin: 0 
                      }}>
                        {selectedStudent.displayName}
                      </h3>
                      <p style={{ 
                        fontSize: "0.875rem", 
                        color: "#6b7280", 
                        margin: "0.25rem 0 0" 
                      }}>
                        Уровень риска: {selectedStudent.riskLevel} • 
                        Последний чекин: {selectedStudent.lastCheckInAt 
                          ? new Date(selectedStudent.lastCheckInAt).toLocaleDateString()
                          : "Никогда"
                        }
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => setShowCreateCase(true)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          padding: "0.5rem 1rem",
                          backgroundColor: "#72a5f8",
                          color: "white",
                          border: "none",
                          borderRadius: "0.5rem",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                        }}
                      >
                        <Plus size={16} />
                        Новый кейс
                      </button>
                    </div>
                  </div>
                </div>

                {/* Cases List */}
                <div style={{ ...styles.card, padding: "1rem" }}>
                  <h3 style={{ 
                    fontSize: "1rem", 
                    fontWeight: 600, 
                    color: "#1a1c1e", 
                    margin: "0 0 1rem 0" 
                  }}>
                    История кейсов
                  </h3>

                  {Array.isArray(cases) && cases.length === 0 ? (
                    <div style={{ 
                      textAlign: "center", 
                      padding: "2rem", 
                      color: "#6b7280" 
                    }}>
                      <MessageSquare size={48} style={{ margin: "0 auto 1rem", opacity: 0.5 }} />
                      <p>Нет активных кейсов</p>
                      <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
                        Создайте новый кейс для начала общения
                      </p>
                    </div>
                  ) : (
                    <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                      {Array.isArray(cases) && cases.map((caseItem) => (
                        <motion.div
                          key={caseItem.caseId}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          style={{
                            padding: "1rem",
                            border: "1px solid rgba(241, 245, 249, 0.2)",
                            borderRadius: "0.5rem",
                            marginBottom: "1rem",
                            backgroundColor: caseItem.status === "RESOLVED" 
                              ? "rgba(16, 185, 129, 0.1)" 
                              : "rgba(255, 255, 255, 0.5)",
                          }}
                        >
                          <div style={{ 
                            display: "flex", 
                            justifyContent: "space-between", 
                            alignItems: "flex-start",
                            marginBottom: "0.75rem"
                          }}>
                            <div>
                              <div style={{ 
                                fontSize: "0.875rem", 
                                color: "#6b7280",
                                marginBottom: "0.25rem"
                              }}>
                                {new Date(caseItem.createdAt).toLocaleDateString()}
                              </div>
                              <div style={{ 
                                fontSize: "0.9rem", 
                                fontWeight: 500, 
                                color: "#1a1c1e" 
                              }}>
                                {caseItem.psychologistName}
                              </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              {caseItem.status === "RESOLVED" ? (
                                <>
                                  <CheckCircle size={16} style={{ color: "#10b981" }} />
                                  <span style={{ 
                                    fontSize: "0.75rem", 
                                    color: "#10b981", 
                                    fontWeight: 500 
                                  }}>
                                    Решен
                                  </span>
                                </>
                              ) : (
                                <>
                                  <div style={{
                                    width: "8px",
                                    height: "8px",
                                    borderRadius: "50%",
                                    backgroundColor: "#72a5f8",
                                  }} />
                                  <span style={{ 
                                    fontSize: "0.75rem", 
                                    color: "#72a5f8", 
                                    fontWeight: 500 
                                  }}>
                                    Активен
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          <div style={{ 
                            fontSize: "0.9rem", 
                            color: "#1a1c1e", 
                            lineHeight: "1.5",
                            marginBottom: "0.75rem"
                          }}>
                            {caseItem.message}
                          </div>

                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <button
                              onClick={() => {
                                if (caseItem.communicationLink && caseItem.communicationLink.trim()) {
                                  // Ensure the link has a protocol
                                  let link = caseItem.communicationLink.trim();
                                  if (!link.startsWith('http://') && !link.startsWith('https://')) {
                                    link = 'https://' + link;
                                  }
                                  window.open(link, "_blank");
                                } else {
                                  alert('Ссылка для связи не указана');
                                }
                              }}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                padding: "0.5rem 0.75rem",
                                backgroundColor: "transparent",
                                color: "#72a5f8",
                                border: "1px solid #72a5f8",
                                borderRadius: "0.375rem",
                                cursor: "pointer",
                                fontSize: "0.875rem",
                                fontWeight: 500,
                              }}
                            >
                              <ExternalLink size={14} />
                              Открыть связь
                            </button>

                            {caseItem.status !== "RESOLVED" && (
                              <button
                                onClick={() => handleResolveCase(caseItem.caseId)}
                                style={{
                                  padding: "0.5rem 0.75rem",
                                  backgroundColor: "#10b981",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "0.375rem",
                                  cursor: "pointer",
                                  fontSize: "0.875rem",
                                  fontWeight: 500,
                                }}
                              >
                                Закрыть кейс
                              </button>
                            )}
                          </div>

                          {caseItem.resolvedAt && (
                            <div style={{
                              marginTop: "0.5rem",
                              fontSize: "0.75rem",
                              color: "#6b7280",
                            }}>
                              Закрыт: {new Date(caseItem.resolvedAt).toLocaleDateString()}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div style={{ ...styles.card, padding: "3rem", textAlign: "center" }}>
                <Users size={48} style={{ 
                  margin: "0 auto 1rem", 
                  opacity: 0.5, 
                  color: "#6b7280" 
                }} />
                <h3 style={{ 
                  fontSize: "1.1rem", 
                  fontWeight: 600, 
                  color: "#1a1c1e", 
                  margin: "0 0 0.5rem" 
                }}>
                  Выберите студента
                </h3>
                <p style={{ 
                  fontSize: "0.9rem", 
                  color: "#6b7280", 
                  margin: 0 
                }}>
                  Для начала чата выберите студента из списка
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Case Modal */}
      {showCreateCase && selectedStudent && (
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
              Новый кейс для {selectedStudent.displayName}
            </h3>

            <form onSubmit={handleCreateCase}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ 
                  display: "block", 
                  fontSize: "0.875rem", 
                  fontWeight: 500, 
                  color: "#1a1c1e", 
                  marginBottom: "0.5rem" 
                }}>
                  Сообщение студенту
                </label>
                <textarea
                  value={newCase.message}
                  onChange={(e) => setNewCase({ ...newCase, message: e.target.value })}
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
                  placeholder="Введите сообщение для студента..."
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ 
                  display: "block", 
                  fontSize: "0.875rem", 
                  fontWeight: 500, 
                  color: "#1a1c1e", 
                  marginBottom: "0.5rem" 
                }}>
                  Ссылка для связи
                </label>
                <input
                  type="text"
                  value={newCase.communicationLink}
                  onChange={(e) => setNewCase({ ...newCase, communicationLink: e.target.value })}
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                    fontFamily: "inherit",
                  }}
                  placeholder="t.me/username или ссылка на WhatsApp"
                />
              </div>

              <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateCase(false);
                    setNewCase({ message: "", communicationLink: "" });
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
                  type="submit"
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
                  Создать кейс
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}