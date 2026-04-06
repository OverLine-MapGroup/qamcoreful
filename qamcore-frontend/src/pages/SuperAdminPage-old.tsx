// import { useState, useEffect } from "react";

// export default function SuperAdminPage() {
//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Super Admin Panel</h1>
//       <p>Super admin functionality</p>
//       <div style={{ marginTop: "20px" }}>
//         <a href="/login">Logout</a>
//       </div>
//     </div>
//   );
// }
//         {/* Таблица ВУЗов */}
//         <div className="border border-gray-200 rounded-lg overflow-hidden">
//           <table className="w-full border-collapse">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-4 py-3 text-left border-b border-gray-200">Название</th>
//                 <th className="px-4 py-3 text-left border-b border-gray-200">Домен</th>
//                 <th className="px-4 py-3 text-left border-b border-gray-200">Студентов</th>
//                 <th className="px-4 py-3 text-left border-b border-gray-200">Админов</th>
//                 <th className="px-4 py-3 text-left border-b border-gray-200">Создан</th>
//                 <th className="px-4 py-3 text-left border-b border-gray-200">Действия</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {tenants.map((tenant) => (
//                 <tr key={tenant.id} className="hover:bg-gray-50">
//                   <td className="px-4 py-3">{tenant.name}</td>
//                   <td className="px-4 py-3">{tenant.domain || "-"}</td>
//                   <td className="px-4 py-3">{tenant.studentCount || 0}</td>
//                   <td className="px-4 py-3">{tenant.adminCount || 0}</td>
//                   <td className="px-4 py-3">{new Date(tenant.createdAt).toLocaleDateString()}</td>
//                   <td className="px-4 py-3">
//                     <button
//                       onClick={() => setSelectedTenant(tenant.id)}
//                       className="px-3 py-1 bg-cyan-600 text-white border-none rounded cursor-pointer text-sm hover:bg-cyan-700 transition-colors"
//                     >
//                       Создать админа
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Модальное окно создания ВУЗа */}
//         {showCreateTenant && (
//           <div style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: "rgba(0,0,0,0.5)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center"
//           }}>
//             <div style={{
//               backgroundColor: "white",
//               padding: 30,
//               borderRadius: 8,
//               width: 400,
//               maxWidth: "90%"
//             }}>
//               <h3 style={{ marginTop: 0 }}>Создать ВУЗ</h3>
//               <form onSubmit={(e) => {
//                 e.preventDefault();
//                 const formData = new FormData(e.currentTarget);
//                 handleCreateTenant({
//                   name: formData.get("name") as string,
//                   domain: formData.get("domain") as string || undefined
//                 });
//               }}>
//                 <div style={{ marginBottom: 15 }}>
//                   <label style={{ display: "block", marginBottom: 5 }}>Название ВУЗа *</label>
//                   <input
//                     name="name"
//                     type="text"
//                     required
//                     style={{
//                       width: "100%",
//                       padding: 8,
//                       border: "1px solid #ddd",
//                       borderRadius: 4
//                     }}
//                   />
//                 </div>
//                 <div style={{ marginBottom: 15 }}>
//                   <label style={{ display: "block", marginBottom: 5 }}>Домен (опционально)</label>
//                   <input
//                     name="domain"
//                     type="text"
//                     style={{
//                       width: "100%",
//                       padding: 8,
//                       border: "1px solid #ddd",
//                       borderRadius: 4
//                     }}
//                   />
//                 </div>
//                 <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
//                   <button
//                     type="button"
//                     onClick={() => setShowCreateTenant(false)}
//                     style={{
//                       padding: "8px 16px",
//                       border: "1px solid #ddd",
//                       borderRadius: 4,
//                       cursor: "pointer"
//                     }}
//                   >
//                     Отмена
//                   </button>
//                   <button
//                     type="submit"
//                     style={{
//                       padding: "8px 16px",
//                       backgroundColor: "#007bff",
//                       color: "white",
//                       border: "none",
//                       borderRadius: 4,
//                       cursor: "pointer"
//                     }}
//                   >
//                     Создать
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Модальное окно создания админа */}
//         {showCreateAdmin && (
//           <div style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: "rgba(0,0,0,0.5)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center"
//           }}>
//             <div style={{
//               backgroundColor: "white",
//               padding: 30,
//               borderRadius: 8,
//               width: 400,
//               maxWidth: "90%"
//             }}>
//               <h3 style={{ marginTop: 0 }}>Создать админа школы</h3>
//               <form onSubmit={(e) => {
//                 e.preventDefault();
//                 const formData = new FormData(e.currentTarget);
//                 handleCreateAdmin({
//                   email: formData.get("email") as string,
//                   firstName: formData.get("firstName") as string,
//                   lastName: formData.get("lastName") as string,
//                   password: formData.get("password") as string
//                 });
//               }}>
//                 <div style={{ marginBottom: 15 }}>
//                   <label style={{ display: "block", marginBottom: 5 }}>Email *</label>
//                   <input
//                     name="email"
//                     type="email"
//                     required
//                     style={{
//                       width: "100%",
//                       padding: 8,
//                       border: "1px solid #ddd",
//                       borderRadius: 4
//                     }}
//                   />
//                 </div>
//                 <div style={{ marginBottom: 15 }}>
//                   <label style={{ display: "block", marginBottom: 5 }}>Имя *</label>
//                   <input
//                     name="firstName"
//                     type="text"
//                     required
//                     style={{
//                       width: "100%",
//                       padding: 8,
//                       border: "1px solid #ddd",
//                       borderRadius: 4
//                     }}
//                   />
//                 </div>
//                 <div style={{ marginBottom: 15 }}>
//                   <label style={{ display: "block", marginBottom: 5 }}>Фамилия *</label>
//                   <input
//                     name="lastName"
//                     type="text"
//                     required
//                     style={{
//                       width: "100%",
//                       padding: 8,
//                       border: "1px solid #ddd",
//                       borderRadius: 4
//                     }}
//                   />
//                 </div>
//                 <div style={{ marginBottom: 15 }}>
//                   <label style={{ display: "block", marginBottom: 5 }}>Пароль *</label>
//                   <input
//                     name="password"
//                     type="password"
//                     required
//                     style={{
//                       width: "100%",
//                       padding: 8,
//                       border: "1px solid #ddd",
//                       borderRadius: 4
//                     }}
//                   />
//                 </div>
//                 <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setShowCreateAdmin(false);
//                       setSelectedTenant(null);
//                     }}
//                     style={{
//                       padding: "8px 16px",
//                       border: "1px solid #ddd",
//                       borderRadius: 4,
//                       cursor: "pointer"
//                     }}
//                   >
//                     Отмена
//                   </button>
//                   <button
//                     type="submit"
//                     style={{
//                       padding: "8px 16px",
//                       backgroundColor: "#28a745",
//                       color: "white",
//                       border: "none",
//                       borderRadius: 4,
//                       cursor: "pointer"
//                     }}
//                   >
//                     Создать
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </ProtectedRoute>
//   );
// }
