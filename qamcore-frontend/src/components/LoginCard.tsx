import { useState } from "react";

interface LoginCardProps {
  onSubmit: (inviteCode: string, password: string) => void;
}

export default function LoginCard({ onSubmit }: LoginCardProps) {
  const [inviteCode, setInviteCode] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inviteCode, password);
  };

  return (
    <div 
      style={{
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(20px)",
        borderRadius: "16px",
        padding: "32px",
        width: "100%",
        maxWidth: "400px",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        border: "1px solid rgba(255, 255, 255, 0.2)"
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <h1 style={{ 
          fontSize: "24px", 
          fontWeight: "bold", 
          marginBottom: "8px",
          color: "#1f2937"
        }}>
          QamCore
        </h1>
        <p style={{ 
          fontSize: "14px", 
          color: "#6b7280",
          margin: 0
        }}>
          Психологическая поддержка студентов
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ 
            display: "block", 
            fontSize: "14px", 
            fontWeight: "500", 
            marginBottom: "8px",
            color: "#374151"
          }}>
            Invite Code
          </label>
          <input
            type="text"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="Введите invite code"
            required
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "14px",
              outline: "none",
              transition: "border-color 0.2s",
              boxSizing: "border-box"
            }}
            onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
            onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={{ 
            display: "block", 
            fontSize: "14px", 
            fontWeight: "500", 
            marginBottom: "8px",
            color: "#374151"
          }}>
            Пароль
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
            required
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "14px",
              outline: "none",
              transition: "border-color 0.2s",
              boxSizing: "border-box"
            }}
            onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
            onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px 24px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "background-color 0.2s"
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#3b82f6"}
        >
          Войти
        </button>
      </form>

      <div style={{ 
        marginTop: "24px", 
        padding: "16px", 
        backgroundColor: "#f3f4f6", 
        borderRadius: "8px",
        fontSize: "12px",
        color: "#6b7280"
      }}>
        <p style={{ margin: "0 0 8px 0", fontWeight: "500" }}>Тестовые данные:</p>
        <p style={{ margin: "4px 0" }}>Психолог: <strong>psy / 123</strong></p>
        <p style={{ margin: "4px 0" }}>Студент: <strong>student / 123</strong></p>
      </div>
    </div>
  );
}
