import { useState, useEffect } from "react";
import { api } from "../api/client";
import { useAuthStore } from "../store/auth";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function ApiStatus() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading");
  const [error, setError] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    try {
      // Try to ping the backend
      await api("/api/v1/super-admin/stats");
      setStatus("connected");
      setError("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "loading": return "text-yellow-600";
      case "connected": return "text-green-600";
      case "error": return "text-red-600";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "loading": return "Проверка API...";
      case "connected": return "API подключен";
      case "error": return "API ошибка";
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div style={{
      position: "fixed",
      top: "10px",
      right: "10px",
      padding: isCollapsed ? "4px 8px" : "8px 12px",
      borderRadius: "8px",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      border: "1px solid rgba(0, 0, 0, 0.1)",
      fontSize: "12px",
      zIndex: 9999,
      transition: "all 0.3s ease"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {!isCollapsed && (
          <>
            <div style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: status === "loading" ? "#f59e0b" : status === "connected" ? "#10b981" : "#ef4444"
            }} />
            <span className={getStatusColor()} style={{ fontWeight: "500" }}>
              {getStatusText()}
            </span>
          </>
        )}
        <button
          onClick={toggleCollapse}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "2px",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            color: "#64748b",
            transition: "background-color 0.2s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.05)"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>
      </div>
      {!isCollapsed && error && (
        <div style={{ fontSize: "10px", color: "#ef4444", marginTop: "4px" }}>
          {error}
        </div>
      )}
    </div>
  );
}
