import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { KeyRound, Lock, LogIn, Shield, Users, Bot, Zap } from "lucide-react";
import { login } from "../api/auth";
import { useAuthStore } from "../store/auth";

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [inviteCode, setInviteCode] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const submitLogin = async () => {
    if (!inviteCode || !password) {
      setError("Пожалуйста, заполните все поля");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { logout } = useAuthStore.getState();
      logout();

      const response = await login({ username: inviteCode, password });

      const userRole = response.role || "STUDENT";
      const correctedRole =
        response.username?.startsWith("ADMIN-SYSTEM-") && userRole === "ADMIN"
          ? "SCHOOL_ADMIN"
          : userRole;

      setAuth({
        token: response.accessToken,
        role: correctedRole,
        orgId: "KAZATU",
      });

      if (correctedRole === "PSYCHOLOGIST") {
        navigate("/dashboard");
      } else if (correctedRole === "SCHOOL_ADMIN") {
        navigate("/school-admin");
      } else if (correctedRole === "ADMIN") {
        navigate("/complaints");
      } else if (correctedRole === "SUPER_ADMIN") {
        navigate("/super-admin");
      } else {
        navigate("/student-dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка входа");
    } finally {
      setIsLoading(false);
    }
  };

  // FIX: submit on Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading && inviteCode && password) {
      submitLogin();
    }
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", background: "#fafcff" }}>
      
      {/* Animated background blobs */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", inset: 0, background: "#fafcff" }} />
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

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: "100%", maxWidth: "28rem", background: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(40px)", borderRadius: "1rem", padding: "2rem", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", border: "1px solid rgba(255, 255, 255, 0.8)" }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}
          style={{ marginBottom: "1.5rem", textAlign: "center" }}
        >
          <div style={{ margin: "0 auto", marginBottom: "0.5rem", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div
              style={{
                width: "3.5rem",
                height: "3.5rem",
                borderRadius: "0.75rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(114, 165, 248, 0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(114, 165, 248, 0.2)",
                color: "#72a5f8",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Zap size={32} />
            </div>
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#2e2e2e", marginBottom: "0.375rem" }}>Welcome back</h1>
          <p style={{ marginTop: "0.375rem", fontSize: "0.875rem", color: "#6b7280" }}>Enter your invite code to continue</p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
          style={{ marginBottom: "2rem" }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem", marginBottom: "1.5rem" }}>
            {[
              { Icon: Bot, label: "AI поддержка 24/7", sub: "Всегда рядом" },
              { Icon: Shield, label: "Полная анонимность", sub: "Ваши данные защищены" },
              { Icon: Users, label: "Сообщество", sub: "Поддержка коллег" },
            ].map(({ Icon, label, sub }) => (
              <div key={label} style={{ textAlign: "center", padding: "0.5rem", borderRadius: "0.375rem" }}>
                <Icon style={{ height: "1.25rem", width: "1.25rem", margin: "0 auto 0.125rem", color: "#72a5f8" }} />
                <div style={{ fontSize: "0.625rem", fontWeight: "600", color: "#2e2e2e", marginBottom: "0.0625rem" }}>{label}</div>
                <div style={{ fontSize: "0.5rem", color: "#6b7280" }}>{sub}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: "1rem", borderRadius: "0.5rem", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "0.75rem", fontSize: "0.875rem", textAlign: "center" }}
          >
            {error}
          </motion.div>
        )}

        {/* Form fields */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.5 }}
          style={{ marginBottom: "1rem" }}
        >
          {/* Invite Code */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.375rem", fontSize: "0.875rem", fontWeight: "500", color: "#475569" }}>Invite Code</label>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, display: "flex", alignItems: "center", paddingLeft: "0.875rem" }}>
                <KeyRound style={{ height: "1.125rem", width: "1.125rem", color: "#94a3b8" }} />
              </div>
              <input
                style={{ width: "100%", borderRadius: "0.75rem", border: "1px solid rgba(226, 232, 240, 0.8)", background: "rgba(255, 255, 255, 0.9)", padding: "0.75rem 2.75rem 1rem", fontSize: "0.875rem", color: "#000000", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)", transition: "all 0.2s ease", outline: "none" }}
                placeholder="Введите ваш invite code"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={(e) => (e.target.style.background = "rgba(255, 255, 255, 1)")}
                onBlur={(e) => (e.target.style.background = "rgba(255, 255, 255, 0.8)")}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.375rem", fontSize: "0.875rem", fontWeight: "500", color: "#475569" }}>Password</label>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, display: "flex", alignItems: "center", paddingLeft: "0.875rem" }}>
                <Lock style={{ height: "1.125rem", width: "1.125rem", color: "#94a3b8" }} />
              </div>
              <input
                type="password"
                style={{ width: "100%", borderRadius: "0.75rem", border: "1px solid rgba(226, 232, 240, 0.8)", background: "rgba(255, 255, 255, 0.9)", padding: "0.75rem 2.75rem 1rem", fontSize: "0.875rem", color: "#000000", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)", transition: "all 0.2s ease", outline: "none" }}
                placeholder="Введите ваш пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={(e) => (e.target.style.background = "rgba(255, 255, 255, 1)")}
                onBlur={(e) => (e.target.style.background = "rgba(255, 255, 255, 0.8)")}
              />
            </div>
          </div>
        </motion.div>

        {/* Submit button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5 }}
          style={{ marginTop: "1.5rem" }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={submitLogin}
            disabled={isLoading || !inviteCode || !password}
            style={{ position: "relative", display: "flex", width: "100%", alignItems: "center", justifyContent: "center", gap: "0.625rem", borderRadius: "0.75rem", background: "#72a5f8", padding: "0.875rem 1.5rem", fontSize: "0.875rem", fontWeight: "600", color: "white", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", transition: "all 0.2s ease", border: "none", cursor: isLoading || !inviteCode || !password ? "not-allowed" : "pointer", opacity: isLoading || !inviteCode || !password ? 0.5 : 1 }}
          >
            {isLoading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} style={{ height: "1.25rem", width: "1.25rem", borderRadius: "50%", border: "2px solid rgba(255, 255, 255, 0.3)", borderTop: "2px solid white" }} />
            ) : (
              <>
                <LogIn style={{ height: "1.125rem", width: "1.125rem" }} />
                <span>Sign In</span>
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }}
          style={{ marginTop: "1.5rem", textAlign: "center" }}
        >
          <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
            Нет аккаунта?{" "}
            <button onClick={() => navigate("/register")} style={{ color: "#667eea", fontWeight: "500", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
              Создайте аккаунт
            </button>
          </p>
          <p style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "#94a3b8" }}>Нет invite code? Contact your organization admin.</p>
        </motion.div>
      </motion.div>
    </div>
  );
}