// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { Users, TrendingUp, AlertTriangle, Calendar, LogOut, Download } from "lucide-react";
// import { useState, useEffect } from "react";
// import { fetchStudents, fetchStudentDetails, fetchDashboardStats, StudentRiskDto, DashboardStats } from "../api/psychologist";
// import { useAuthStore } from "../store/auth";
// import { generateStudentsPDF } from "../utils/universalPdfGenerator";

// /* ─────────────────────────────────────────────
//    Animated mesh‑gradient background
//    ───────────────────────────────────────────── */
// function MeshGradientBg() {
//   return (
//     <div style={{ 
//       position: "absolute", 
//       top: 0, 
//       left: 0, 
//       right: 0, 
//       bottom: 0, 
//       overflow: "hidden", 
//       pointerEvents: "none" 
//     }}>
//       <div style={{ 
//         position: "absolute", 
//         inset: 0, 
//         background: "#fafcff" 
//       }} />
      
//       <motion.div
//         animate={{
//           x: [0, 60, -30, 0],
//           y: [0, -40, 50, 0],
//           scale: [1, 1.15, 0.95, 1],
//         }}
//         transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
//         style={{
//           position: "absolute",
//           left: "-8rem",
//           top: "-8rem",
//           width: "500px",
//           height: "500px",
//           borderRadius: "50%",
//           background: "rgba(122, 165, 248, 0.5)",
//           filter: "blur(64px)"
//         }}
//       />
      
//       <motion.div
//         animate={{
//           x: [0, -50, 40, 0],
//           y: [0, 60, -30, 0],
//           scale: [1, 0.9, 1.1, 1],
//         }}
//         transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
//         style={{
//           position: "absolute",
//           right: "-8rem",
//           top: "25%",
//           width: "450px",
//           height: "450px",
//           borderRadius: "50%",
//           background: "rgba(122, 165, 248, 0.4)",
//           filter: "blur(64px)"
//         }}
//       />
      
//       <motion.div
//         animate={{
//           x: [0, 40, -50, 0],
//           y: [0, -50, 30, 0],
//           scale: [1, 1.1, 0.9, 1],
//         }}
//         transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
//         style={{
//           position: "absolute",
//           bottom: "-8rem",
//           left: "33.333%",
//           width: "400px",
//           height: "400px",
//           borderRadius: "50%",
//           background: "rgba(122, 165, 248, 0.4)",
//           filter: "blur(64px)"
//         }}
//       />
//     </div>
//   );
// }

// export default function Dashboard() {
//   const [students, setStudents] = useState<StudentRiskDto[]>([]);
//   const [stats, setStats] = useState<DashboardStats | null>(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const { token, role } = useAuthStore();

//   useEffect(() => {
//     const load = async () => {
//       try {
//         console.log("Starting dashboard data fetch...");
//         console.log("Auth token:", token);
//         console.log("User role:", role);
        
//         // Check if user is psychologist
//         if (role !== "PSYCHOLOGIST") {
//           console.log("User is not a psychologist, redirecting...");
//           navigate("/student-dashboard");
//           return;
//         }
        
//         console.log("Fetching psychologist data...");
//         const [studentsData, statsData] = await Promise.all([
//           fetchStudents(),
//           fetchDashboardStats()
//         ]);

//         console.log("Fetched students:", studentsData);
//         console.log("Fetched stats:", statsData);

//         setStudents(studentsData);
//         setStats(statsData);

//       } catch (error: any) {
//         console.error("Dashboard fetch error:", error);
//         console.error("Error details:", {
//           status: error?.status,
//           statusText: error?.statusText,
//           message: error?.message
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//   }, [token, role, navigate]);

//   if (loading) {
//     return (
//       <div style={{ 
//         minHeight: "100vh", 
//         position: "relative", 
//         display: "flex", 
//         alignItems: "center", 
//         justifyContent: "center", 
//         padding: "1rem", 
//         background: "#fafcff" 
//       }}>
//         <MeshGradientBg />
//         <motion.div
//           animate={{ opacity: [0.5, 1, 0.5] }}
//           transition={{ duration: 1.5, repeat: Infinity }}
//           style={{
//             fontSize: "1.25rem",
//             fontWeight: "500",
//             color: "#2e2e2e",
//             background: "rgba(255, 255, 255, 0.95)",
//             padding: "1rem 2rem",
//             borderRadius: "0.75rem",
//             boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
//           }}
//         >
//           Loading...
//         </motion.div>
//       </div>
//     );
//   }

//   const highRiskCount = students.filter(s => s.riskLevel === "RED" || s.riskLevel === "HIGH").length;
//   const totalStudents = students.length;

//   const generateStudentsPDFReport = () => {
//     const studentsData = students.map(student => ({
//       displayName: student.displayName,
//       riskLevel: student.riskLevel,
//       riskScore: student.riskScore,
//       lastCheckInAt: student.lastCheckInAt,
//       hasSos: student.hasSos
//     }));
    
//     generateStudentsPDF(studentsData);
//   };

//   return (
//     <div style={{ 
//       minHeight: "100vh", 
//       position: "relative", 
//       display: "flex", 
//       alignItems: "center", 
//       justifyContent: "center", 
//       padding: "1rem", 
//       background: "#fafcff" 
//     }}>
//       <MeshGradientBg />

//       <motion.div
//         initial={{ opacity: 0, y: 30, scale: 0.96 }}
//         animate={{ opacity: 1, y: 0, scale: 1 }}
//         transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
//         style={{
//           width: "100%",
//           maxWidth: "90rem",
//           background: "rgba(255, 255, 255, 0.95)",
//           backdropFilter: "blur(40px)",
//           borderRadius: "1rem",
//           padding: "2rem",
//           boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
//           border: "1px solid rgba(255, 255, 255, 0.8)"
//         }}
//       >
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.15, duration: 0.5 }}
//           style={{ 
//             marginBottom: "2rem", 
//             display: "flex", 
//             justifyContent: "space-between", 
//             alignItems: "center" 
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
//             <div style={{ 
//               display: "flex", 
//               justifyContent: "center", 
//               alignItems: "center", 
//               height: "3rem", 
//               width: "3rem", 
//               borderRadius: "0.75rem", 
//               background: "#72a5f8", 
//               boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" 
//             }}>
//               <Users style={{ height: "1.5rem", width: "1.5rem", color: "white" }} />
//             </div>
//             <div>
//               <h1 style={{ 
//                 fontSize: "1.875rem", 
//                 fontWeight: "bold", 
//                 color: "#2e2e2e", 
//                 marginBottom: "0.25rem" 
//               }}>
//                 Психологическая панель
//               </h1>
//               <p style={{ 
//                 fontSize: "0.875rem", 
//                 color: "#4f64ff" 
//               }}>
//                 Мониторинг студентов
//               </p>
//             </div>
//           </div>
          
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={generateStudentsPDFReport}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "0.5rem",
//               padding: "0.75rem 1.5rem",
//               borderRadius: "0.75rem",
//               background: "linear-gradient(to right, #10b981, #059669)",
//               color: "white",
//               border: "none",
//               cursor: "pointer",
//               fontSize: "0.875rem",
//               fontWeight: "500",
//               boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
//               marginRight: "1rem"
//             }}
//           >
//             <Download style={{ height: "1rem", width: "1rem" }} />
//             Скачать PDF
//           </motion.button>
          
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => navigate("/login")}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "0.5rem",
//               padding: "0.75rem 1.5rem",
//               borderRadius: "0.75rem",
//               background: "#72a5f8",
//               color: "white",
//               border: "none",
//               cursor: "pointer",
//               fontSize: "0.875rem",
//               fontWeight: "500",
//               boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
//             }}
//           >
//             <LogOut style={{ height: "1rem", width: "1rem" }} />
//           </motion.button>
//         </motion.div>

//         {/* Stats Cards */}
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.25, duration: 0.5 }}
//           style={{ 
//             display: "grid", 
//             gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
//             gap: "1.5rem", 
//             marginBottom: "2rem" 
//           }}
//         >
//           <motion.div
//             whileHover={{ scale: 1.02 }}
//             style={{
//               background: "rgba(255, 255, 255, 0.8)",
//               padding: "1.5rem",
//               borderRadius: "0.75rem",
//               border: "1px solid rgba(226, 232, 240, 0.8)",
//               boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.05)"
//             }}
//           >
//             <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
//               <AlertTriangle style={{ height: "1.25rem", width: "1.25rem", color: "#ef4444" }} />
//               <h3 style={{ fontSize: "0.875rem", fontWeight: "500", color: "#6b7280" }}>Студенты в группе риска</h3>
//             </div>
//             <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#dc2626" }}>{stats?.riskGroupCount || 0}</p>
//           </motion.div>

//           <motion.div
//             whileHover={{ scale: 1.02 }}
//             style={{
//               background: "rgba(255, 255, 255, 0.8)",
//               padding: "1.5rem",
//               borderRadius: "0.75rem",
//               border: "1px solid rgba(226, 232, 240, 0.8)",
//               boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.05)"
//             }}
//           >
//             <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
//               <Users style={{ height: "1.25rem", width: "1.25rem", color: "#3b82f6" }} />
//               <h3 style={{ fontSize: "0.875rem", fontWeight: "500", color: "#6b7280" }}>Всего студентов</h3>
//             </div>
//             <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#3b82f6" }}>{stats?.totalStudents || 0}</p>
//           </motion.div>

//           <motion.div
//             whileHover={{ scale: 1.02 }}
//             style={{
//               background: "rgba(255, 255, 255, 0.8)",
//               padding: "1.5rem",
//               borderRadius: "0.75rem",
//               border: "1px solid rgba(226, 232, 240, 0.8)",
//               boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.05)"
//             }}
//           >
//             <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
//               <TrendingUp style={{ height: "1.25rem", width: "1.25rem", color: "#10b981" }} />
//               <h3 style={{ fontSize: "0.875rem", fontWeight: "500", color: "#6b7280" }}>Процент риска</h3>
//             </div>
//             <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#10b981" }}>
//               {stats?.riskPercentage || 0}%
//             </p>
//           </motion.div>
//         </motion.div>

//         {/* Students Table */}
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.35, duration: 0.5 }}
//           style={{
//             background: "rgba(255, 255, 255, 0.8)",
//             borderRadius: "0.75rem",
//             border: "1px solid rgba(226, 232, 240, 0.8)",
//             boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.05)",
//             overflow: "hidden"
//           }}
//         >
//           <div style={{ padding: "1.5rem", borderBottom: "1px solid rgba(226, 232, 240, 0.8)" }}>
//             <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#2e2e2e" }}>Список студентов</h2>
//           </div>
          
//           <div style={{ overflowX: "auto" }}>
//             <table style={{ width: "100%", borderCollapse: "collapse" }}>
//               <thead>
//                 <tr style={{ background: "rgba(248, 250, 252, 0.8)" }}>
//                   <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#475569" }}>ID</th>
//                   <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#475569" }}>Риск</th>
//                   <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#475569" }}>Оценка риска</th>
//                   <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#475569" }}>Последний чек-ин</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {students.map((s, index) => (
//                   <motion.tr
//                     key={s.studentId}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: 0.5 + index * 0.05, duration: 0.3 }}
//                     style={{ 
//                       cursor: "pointer", 
//                       borderBottom: "1px solid rgba(248, 250, 252, 0.8)",
//                       transition: "all 0.2s ease"
//                     }}
//                     whileHover={{ background: "rgba(248, 250, 252, 0.8)" }}
//                     onClick={() => navigate(`/dashboard/${s.studentId}`)}
//                   >
//                     <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#2e2e2e" }}>{s.displayName}</td>
//                     <td style={{ padding: "1rem" }}>
//                       <span style={{
//                         padding: "0.25rem 0.75rem",
//                         borderRadius: "9999px",
//                         fontSize: "0.75rem",
//                         fontWeight: "500",
//                         color: s.riskLevel === "RED" ? "#dc2626" : s.riskLevel === "HIGH" ? "#dc2626" : s.riskLevel === "MEDIUM" ? "#ea580c" : s.riskLevel === "LOW" ? "#16a34a" : "#64748b",
//                         background: s.riskLevel === "RED" ? "#fef2f2" : s.riskLevel === "HIGH" ? "#fef2f2" : s.riskLevel === "MEDIUM" ? "#fff7ed" : s.riskLevel === "LOW" ? "#f0fdf4" : "#f8fafc"
//                       }}>
//                         {s.riskLevel}
//                       </span>
//                     </td>
//                     <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#2e2e2e" }}>{s.riskScore}</td>
//                     <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#6b7280", display: "flex", alignItems: "center", gap: "0.5rem" }}>
//                       <Calendar style={{ height: "1rem", width: "1rem" }} />
//                       {s.lastCheckInAt ? new Date(s.lastCheckInAt).toLocaleDateString("ru-RU") : "Нет данных"}
//                     </td>
//                   </motion.tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// }
