import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Users, GraduationCap, UserPlus, QrCode, BarChart3, LogOut, Plus, Settings, Download, ChevronRight, ArrowLeft, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { getGroups, createGroup, createStaff, generateCodes, getSchoolStats, getTeachers, getParticipationAnalytics, Group, SchoolAdminStaffResponse, SchoolStats, Teacher, ParticipationAnalytics } from "../api/schoolAdmin";
import { api } from "../api/client";
import { generateCodesPDF } from "../utils/pdfGenerator";
import { generateStaffPDF } from "../utils/universalPdfGenerator";
import { useAuthStore } from "../store/auth";

function MeshGradientBg() {
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, background: "#fafcff" }} />
      <motion.div
        animate={{ x: [0, 60, -30, 0], y: [0, -40, 50, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", left: "-8rem", top: "-8rem", width: "500px", height: "500px", borderRadius: "50%", background: "rgba(114, 165, 248, 0.4)", filter: "blur(64px)" }}
      />
      <motion.div
        animate={{ x: [0, -50, 40, 0], y: [0, 60, -30, 0], scale: [1, 0.9, 1.1, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", right: "-8rem", top: "25%", width: "450px", height: "450px", borderRadius: "50%", background: "rgba(114, 165, 248, 0.3)", filter: "blur(64px)" }}
      />
      <motion.div
        animate={{ x: [0, 40, -50, 0], y: [0, -50, 30, 0], scale: [1, 1.1, 0.9, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", bottom: "-8rem", left: "33.333%", width: "400px", height: "400px", borderRadius: "50%", background: "rgba(114, 165, 248, 0.4)", filter: "blur(64px)" }}
      />
    </div>
  );
}

export default function SchoolAdminPage() {
  const navigate = useNavigate();
  const { role: userRole, token } = useAuthStore();
  const [stats, setStats] = useState<SchoolStats | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [analytics, setAnalytics] = useState<ParticipationAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [loadingGroup, setLoadingGroup] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, groupsData, teachersDataResult, analyticsData] = await Promise.allSettled([
          getSchoolStats(),
          getGroups(),
          getTeachers(),
          getParticipationAnalytics(),
        ]);

        if (statsData.status === 'fulfilled') setStats(statsData.value);
        if (groupsData.status === 'fulfilled') setGroups(groupsData.value);
        
        if (teachersDataResult.status === 'fulfilled') {
          setTeachers(teachersDataResult.value);
        } else {
          console.error("Error loading teachers:", teachersDataResult.reason);
          setTeachers([]); // Fallback to empty list
        }
        
        if (analyticsData.status === 'fulfilled') setAnalytics(analyticsData.value);

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

  const handleCreateGroup = async () => {
    const name = prompt("Введите название группы:");
    if (!name) return;

    let selectedTeacherId: number | null = null;

    if (teachers.length > 0) {
      const curatorOptions = teachers
        .map((t, i) => `${i + 1}. ${t.username} (ID: ${t.id})`)
        .join("\n");

      const curatorSelection = prompt(
        `Выберите куратора для группы "${name}" (оставьте пустым для пропуска):\n${curatorOptions}\n\nВведите НОМЕР из списка (1-${teachers.length}):`
      );

      if (curatorSelection) {
        const curatorIndex = parseInt(curatorSelection) - 1;
        if (!isNaN(curatorIndex) && curatorIndex >= 0 && curatorIndex < teachers.length) {
          selectedTeacherId = teachers[curatorIndex].id;
        } else {
          alert("Неверный выбор куратора. Группа будет создана без куратора.");
        }
      }
    }

    try {
      const newGroup = await createGroup({ name, curatorId: selectedTeacherId });
      setGroups([...groups, newGroup]);
      
      const updatedStats = await getSchoolStats();
      setStats(updatedStats);
      
      alert(`Группа "${name}" создана!${selectedTeacherId ? `\nКуратор: ${teachers.find(t => t.id === selectedTeacherId)?.username}` : ""}`);
    } catch (error: any) {
      console.error("Error creating group:", error);
      alert(`Ошибка при создании группы: ${error?.message || "Unknown error"}`);
    }
  };

  const handleCreateStaff = async () => {
    const fullName = prompt("Введите полное имя сотрудника (Имя Фамилия):");
    if (!fullName) return;

    if (!fullName.trim().includes(" ")) {
      alert("Пожалуйста, введите полное имя (Имя и Фамилия через пробел)");
      return;
    }

    const roleOptions = [
      "1. TEACHER - Преподаватель",
      "2. PSYCHOLOGIST - Психолог",
      "3. ADMIN - Администратор (Общий)",
      "4. SCHOOL_ADMIN - Школьный администратор",
      "5. STUDENT - Студент",
    ];

    const roleSelection = prompt(
      `Выберите роль:\n${roleOptions.join("\n")}\n\nВведите НОМЕР роли (1-5) или название (например, TEACHER):`
    );
    if (!roleSelection) return;

    let role: "TEACHER" | "PSYCHOLOGIST" | "ADMIN" | "STUDENT" | "SCHOOL_ADMIN";
    
    const selection = roleSelection.trim().toUpperCase();
    if (selection === "1" || selection === "TEACHER") role = "TEACHER";
    else if (selection === "2" || selection === "PSYCHOLOGIST") role = "PSYCHOLOGIST";
    else if (selection === "3" || selection === "ADMIN") role = "ADMIN";
    else if (selection === "4" || selection === "SCHOOL_ADMIN") role = "SCHOOL_ADMIN";
    else if (selection === "5" || selection === "STUDENT") role = "STUDENT";
    else {
      alert("Неверный выбор роли.");
      return;
    }

    try {
      // Пытаемся создать через SCHOOL_ADMIN эндпоинт
      console.log("Current User Role:", userRole);
      console.log("Token Present:", !!token);
      console.log("Sending createStaff request:", { fullName, role });
      
      // Проверка роли перед отправкой (SCHOOL_ADMIN может иметь ограничения)
      if (role === "SCHOOL_ADMIN" || role === "ADMIN") {
        const confirmMsg = `Внимание: ваша текущая роль - ${userRole}. Создание роли ${role} может быть ограничено. Вы уверены?`;
        if (!window.confirm(confirmMsg)) return;
      }

      const newStaff: SchoolAdminStaffResponse = await createStaff({ fullName, role });
      console.log("createStaff response:", newStaff);
      
      alert(
        `Сотрудник создан успешно!\nЛогин: ${newStaff.username}\nПароль: ${newStaff.password}\nРоль: ${newStaff.role}`
      );

      // Refresh data
      const [updatedStats, updatedTeachers] = await Promise.all([
        getSchoolStats(),
        getTeachers()
      ]);
      setStats(updatedStats);
      setTeachers(updatedTeachers);
      
    } catch (error: any) {
      console.error("Error creating staff:", error);
      
      // Если получили 403, возможно SCHOOL_ADMIN вообще не имеет прав на этот эндпоинт
      if (error?.message?.includes("403") || error?.message?.includes("Forbidden")) {
        const adminFixMsg = `Ошибка 403: У вашей учетной записи (${userRole}) нет прав на создание пользователей.\n\n` +
          `Вероятная причина: Ваш аккаунт SCHOOL_ADMIN был создан как обычный пользователь, а не через специальный эндпоинт.\n\n` +
          `РЕШЕНИЕ ДЛЯ SUPER_ADMIN:\n` +
          `1. Зайдите под SUPER_ADMIN\n` +
          `2. В управлении организациями выберите вашу школу\n` +
          `3. Нажмите кнопку "Админ" (вызывает POST /api/v1/super-admin/tenants/{id}/create-admin)\n` +
          `4. Используйте полученные логин/пароль.`;
        alert(adminFixMsg);
      } else {
        alert(`Ошибка при создании сотрудника: ${error?.message || "Unknown error"}`);
      }
    }
  };

  const handleGenerateCodes = async () => {
    if (groups.length === 0) {
      alert("Нет доступных групп. Сначала создайте группу.");
      return;
    }

    const groupOptions = groups.map((g) => `${g.id}: ${g.name}`).join("\n");
    const groupIdInput = prompt(`Выберите группу ID:\n${groupOptions}`);
    if (!groupIdInput) return;

    const groupId = parseInt(groupIdInput);
    if (isNaN(groupId)) {
      alert("Неверный ID группы.");
      return;
    }

    const amountInput = prompt("Введите количество кодов:");
    if (!amountInput) return;
    const amount = parseInt(amountInput);
    if (isNaN(amount) || amount <= 0) {
      alert("Неверное количество кодов.");
      return;
    }

    try {
      const codes = await generateCodes({ groupId, amount });
      const selectedGroup = groups.find((g) => g.id === groupId);
      const groupName = selectedGroup?.name || `Group_${groupId}`;
      generateCodesPDF(codes, groupName);
      alert(`Сгенерировано ${codes.length} кодов и загружено в PDF!`);
    } catch (error) {
      console.error("Error generating codes:", error);
      alert("Ошибка при генерации кодов");
    }
  };

  const generateGroupsPDF = () => {
    const groupsData = groups.map((group) => ({
      name: group.name,
      id: group.id,
      curatorName: group.curatorName,
      createdAt: new Date().toISOString(),
    }));
    generateCodesPDF(groupsData, "All_Groups", "Groups Report");
  };

  const generateStaffPDFReport = () => {
    const staffData = teachers.map((t) => ({ username: t.username, role: "TEACHER" }));
    generateStaffPDF(staffData, "School Organization");
  };

  const handleGroupClick = async (groupId: number) => {
    try {
      setLoadingGroup(true);
      const data = await api(`/api/v1/school-admin/groups/${groupId}/details`);
      setSelectedGroup(data);
    } catch (error) {
      console.error("Error loading group details:", error);
      alert("Ошибка при загрузке деталей группы");
    } finally {
      setLoadingGroup(false);
    }
  };

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.8)",
    borderRadius: "0.75rem",
    border: "1px solid rgba(226, 232, 240, 0.8)",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    padding: "2rem",
  };

  const btnStyle = {
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
  } as React.CSSProperties;

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
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "3rem", width: "3rem", borderRadius: "0.75rem", background: "#72a5f8", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}>
              <Settings style={{ height: "1.5rem", width: "1.5rem", color: "white" }} />
            </div>
            <div>
              <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#72a5f8", marginBottom: "0.25rem" }}>Панель администратора</h1>
              <p style={{ fontSize: "0.875rem", color: "#72a5f8" }}>Управление школой</p>
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleLogout} style={btnStyle}>
            <LogOut style={{ height: "1rem", width: "1rem" }} />
          </motion.button>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
          style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", borderBottom: "1px solid rgba(226, 232, 240, 0.8)", paddingBottom: "1rem" }}
        >
          {[
            { id: "dashboard", label: "Dashboard", icon: BarChart3 },
            { id: "groups", label: "Groups", icon: Users },
            { id: "staff", label: "Staff", icon: UserPlus },
            { id: "teachers", label: "Teachers", icon: GraduationCap },
            { id: "codes", label: "Codes", icon: QrCode },
            { id: "analytics", label: "Analytics", icon: BarChart3 },
          ].map((tab, index) => (
            <motion.button
              key={tab.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + index * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: "0.75rem", background: activeTab === tab.id ? "#72a5f8" : "rgba(248, 250, 252, 0.8)", color: activeTab === tab.id ? "white" : "#72a5f8", border: "none", cursor: "pointer", fontSize: "0.875rem", fontWeight: activeTab === tab.id ? "600" : "500", transition: "all 0.2s" }}
            >
              <tab.icon style={{ height: "1rem", width: "1rem" }} />
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Content */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>

          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
              {[
                { label: "Студенты", value: stats?.totalStudents ?? 0, icon: GraduationCap },
                { label: "Преподаватели", value: stats?.totalTeachers ?? 0, icon: Users },
                { label: "Неиспользованные коды", value: stats?.unusedCodesCount ?? 0, icon: QrCode },
                { label: "Участие за неделю", value: `${stats?.weeklyParticipationRate ?? 0}%`, icon: BarChart3 },
              ].map((stat, index) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + index * 0.1 }} whileHover={{ scale: 1.02 }}
                  style={{ background: "rgba(255, 255, 255, 0.8)", padding: "1.5rem", borderRadius: "0.75rem", border: "1px solid rgba(226, 232, 240, 0.8)", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                    <stat.icon style={{ height: "1.25rem", width: "1.25rem", color: "#72a5f8" }} />
                    <h3 style={{ fontSize: "0.875rem", fontWeight: "500", color: "#2e2e2e" }}>{stat.label}</h3>
                  </div>
                  <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#72a5f8" }}>{stat.value}</p>
                </motion.div>
              ))}
            </div>
          )}

          {/* Groups */}
          {activeTab === "groups" && (
            <div style={cardStyle}>
              <AnimatePresence mode="wait">
                {!selectedGroup ? (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#2e2e2e", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Users style={{ height: "1.25rem", width: "1.25rem", color: "#72a5f8" }} />
                        Группы ({groups.length})
                      </h2>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleCreateGroup} style={btnStyle}>
                          <Plus style={{ height: "1rem", width: "1rem" }} /> Создать группу
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={generateGroupsPDF} style={btnStyle}>
                          <Download style={{ height: "1rem", width: "1rem" }} /> PDF
                        </motion.button>
                      </div>
                    </div>

                    {loading ? (
                      <div style={{ textAlign: "center", padding: "2rem", color: "#72a5f8" }}>Загрузка...</div>
                    ) : groups.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "2rem", color: "#72a5f8" }}>
                        <Users style={{ height: "3rem", width: "3rem", marginBottom: "1rem", opacity: 0.5 }} />
                        <p>Группы не найдены</p>
                        <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>Создайте первую группу</p>
                      </div>
                    ) : (
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ borderBottom: "2px solid rgba(226, 232, 240, 0.8)" }}>
                            {["ID", "Название", "Куратор", ""].map((h) => (
                              <th key={h} style={{ padding: "1rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#2e2e2e" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {groups.map((group, index) => (
                            <motion.tr key={group.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + index * 0.05 }}
                              style={{ borderBottom: "1px solid rgba(226, 232, 240, 0.8)", cursor: "pointer" }}
                              onClick={() => handleGroupClick(group.id)}
                              whileHover={{ backgroundColor: "rgba(114, 165, 248, 0.1)" } as any}>
                              <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#2e2e2e", fontWeight: "500" }}>{group.id}</td>
                              <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#2e2e2e" }}>{group.name}</td>
                              <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#2e2e2e" }}>{group.curatorName || 'Нет куратора'}</td>
                              <td style={{ padding: "1rem", textAlign: "right" }}>
                                <ChevronRight size={18} color="#72a5f8" />
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div style={{ marginBottom: "2rem" }}>
                      <button
                        onClick={() => setSelectedGroup(null)}
                        style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "none", border: "none", color: "#72a5f8", cursor: "pointer", fontSize: "0.875rem", fontWeight: "600", padding: 0, marginBottom: "1rem" }}
                      >
                        <ArrowLeft size={16} /> Назад к списку групп
                      </button>
                      <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#2e2e2e", margin: "0 0 0.5rem" }}>
                        Группа: {selectedGroup.groupName}
                      </h2>
                      <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>Куратор: {selectedGroup.curatorName || 'Нет куратора'}</p>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
                      {[
                        { label: "Всего студентов", value: selectedGroup.totalStudents, color: "#72a5f8" },
                        { label: "Критический риск", value: selectedGroup.redRiskCount, color: "#ef4444" },
                        { label: "Средний риск", value: selectedGroup.yellowRiskCount, color: "#f59e0b" },
                        { label: "Низкий риск", value: selectedGroup.greenRiskCount, color: "#10b981" },
                      ].map((s) => (
                        <div key={s.label} style={{ padding: "1rem", borderRadius: "0.75rem", background: "rgba(248, 250, 252, 0.8)", border: "1px solid rgba(226, 232, 240, 0.8)" }}>
                          <p style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>{s.label}</p>
                          <p style={{ fontSize: "1.25rem", fontWeight: "700", color: s.color }}>{s.value}</p>
                        </div>
                      ))}
                    </div>

                    <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "#2e2e2e", marginBottom: "1rem" }}>Студенты группы</h3>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: "2px solid rgba(226, 232, 240, 0.8)" }}>
                          {["Студент", "Уровень риска", "Балл", "Последний чек-ин"].map((h) => (
                            <th key={h} style={{ padding: "1rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#2e2e2e" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {selectedGroup.students.map((student: any, idx: number) => (
                          <tr key={student.studentId} style={{ borderBottom: "1px solid rgba(226, 232, 240, 0.8)" }}>
                            <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#2e2e2e", fontWeight: "500" }}>{student.displayName}</td>
                            <td style={{ padding: "1rem" }}>
                              <span style={{
                                padding: "0.25rem 0.6rem",
                                borderRadius: "4px",
                                fontSize: "0.7rem",
                                fontWeight: "700",
                                background: student.lastRiskLevel === "RED" ? "#fee2e2" : student.lastRiskLevel === "YELLOW" ? "#fef3c7" : "#d1fae5",
                                color: student.lastRiskLevel === "RED" ? "#dc2626" : student.lastRiskLevel === "YELLOW" ? "#d97706" : "#059669"
                              }}>
                                {student.lastRiskLevel}
                              </span>
                            </td>
                            <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#2e2e2e" }}>{student.lastScore}</td>
                            <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#6b7280" }}>
                              {student.lastCheckInAt ? new Date(student.lastCheckInAt).toLocaleDateString("ru-RU") : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Staff */}
          {activeTab === "staff" && (
            <div style={{ ...cardStyle, textAlign: "center" }}>
              <UserPlus style={{ height: "3rem", width: "3rem", color: "#72a5f8", marginBottom: "1rem", opacity: 0.5 }} />
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#2e2e2e", marginBottom: "1rem" }}>Создание сотрудников</h2>
              <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "2rem" }}>
                Создавайте преподавателей, психологов и других сотрудников для вашей школы
              </p>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleCreateStaff}
                style={{ ...btnStyle, margin: "0 auto" }}>
                <UserPlus style={{ height: "1rem", width: "1rem" }} /> Создать сотрудника
              </motion.button>
              <div style={{ height: "1rem" }} />
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={generateStaffPDFReport}
                style={{ ...btnStyle, background: "linear-gradient(to right, #10b981, #059669)", margin: "0 auto" }}>
                <Download style={{ height: "1rem", width: "1rem" }} /> Скачать PDF
              </motion.button>
              <div style={{ marginTop: "2rem", padding: "1rem", borderRadius: "0.75rem", background: "rgba(248, 250, 252, 0.8)" }}>
                <p style={{ fontSize: "0.75rem", color: "#6b7280", fontFamily: "monospace" }}>POST /api/v1/school-admin/staff</p>
              </div>
            </div>
          )}

          {/* Teachers */}
          {activeTab === "teachers" && (
            <div style={cardStyle}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#2e2e2e", marginBottom: "0.5rem" }}>Список преподавателей</h2>
              <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "2rem" }}>
                Используются как кураторы при создании групп
              </p>

              {loading ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "#72a5f8" }}>Загрузка...</div>
              ) : teachers.length === 0 ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "#72a5f8" }}>
                  <GraduationCap style={{ height: "3rem", width: "3rem", marginBottom: "1rem", opacity: 0.5 }} />
                  <p>Преподаватели не найдены</p>
                  <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>Добавьте преподавателей через раздел Staff</p>
                </div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(226, 232, 240, 0.8)" }}>
                      {["ID", "Имя пользователя", "Статус"].map((h) => (
                        <th key={h} style={{ padding: "1rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#2e2e2e" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {teachers.map((teacher, index) => (
                      <motion.tr key={teacher.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.05 }}
                        style={{ borderBottom: "1px solid rgba(226, 232, 240, 0.8)" }}
                        whileHover={{ backgroundColor: "rgba(114, 165, 248, 0.1)" } as any}>
                        <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#2e2e2e" }}>{teacher.id}</td>
                        <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#2e2e2e" }}>{teacher.username}</td>
                        <td style={{ padding: "1rem" }}>
                          <span style={{ padding: "0.25rem 0.6rem", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "700", background: "#d1fae5", color: "#059669" }}>
                            Активен
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              )}

              <div style={{ marginTop: "2rem", padding: "1rem", borderRadius: "0.75rem", background: "rgba(248, 250, 252, 0.8)" }}>
                <p style={{ fontSize: "0.75rem", color: "#6b7280", fontFamily: "monospace" }}>GET /api/v1/school-admin/teachers</p>
              </div>
            </div>
          )}

          {/* Codes */}
          {activeTab === "codes" && (
            <div style={{ ...cardStyle, textAlign: "center" }}>
              <QrCode style={{ height: "3rem", width: "3rem", color: "#8b5cf6", marginBottom: "1rem", opacity: 0.5 }} />
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#2e2e2e", marginBottom: "1rem" }}>Генерация кодов приглашения (PDF)</h2>
              <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "2rem" }}>
                Создавайте коды для регистрации студентов и загружайте их в PDF файл
              </p>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleGenerateCodes}
                style={{ ...btnStyle, margin: "0 auto" }}>
                <Download style={{ height: "1rem", width: "1rem" }} /> Генерировать и скачать PDF
              </motion.button>
              <div style={{ marginTop: "2rem", padding: "1rem", borderRadius: "0.75rem", background: "rgba(248, 250, 252, 0.8)" }}>
                <p style={{ fontSize: "0.75rem", color: "#6b7280", fontFamily: "monospace" }}>POST /api/v1/school-admin/codes/generate</p>
              </div>
            </div>
          )}

        </motion.div>
      </motion.div>
    </div>
  );
}