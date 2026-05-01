import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, LogIn, Shield, Users, Bot } from "lucide-react";
import { registerAnonymous } from "../api/auth";
import { useAuthStore } from "../store/auth";

export default function Register() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [inviteCode, setInviteCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCredentials, setShowCredentials] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  const submitRegister = async () => {
    setError("");

    if (!inviteCode || !password) {
      setError("Fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }

    setIsLoading(true);

    try {
      const cleanCode = inviteCode.trim().replace(/\s+/g, '');
      const response = await registerAnonymous({ inviteCode: cleanCode, password });
      
      // Store credentials for display
      setCredentials({
        username: response.username,
        password: password
      });
      
      // Set auth state
      setAuth({
        token: response.accessToken,
        role: response.role || "STUDENT",
        orgId: response.orgId || "KAZATU",
      });
      
      // Show credentials screen
      setShowCredentials(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading && inviteCode && password && confirmPassword) {
      submitRegister();
    }
  };

  const inputStyle = {
    width: "100%",
    borderRadius: "0.75rem",
    border: "1px solid rgba(226, 232, 240, 0.8)",
    background: "rgba(255, 255, 255, 0.9)",
    padding: "0.75rem 2.75rem 1rem",
    fontSize: "0.875rem",
    color: "#000000",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    transition: "all 0.2s ease",
    outline: "none",
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

      {/* Register card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: "100%", maxWidth: "28rem", background: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(40px)", borderRadius: "1rem", padding: "2rem", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)", border: "1px solid rgba(255, 255, 255, 0.8)" }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}
          style={{ marginBottom: "1.5rem", textAlign: "center" }}
        >
          <div style={{ margin: "0 auto", marginBottom: "0.5rem", display: "flex", justifyContent: "center", alignItems: "center", height: "3.5rem", width: "3.5rem", borderRadius: "0.75rem", background: "#72a5f8", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}>
            <UserPlus style={{ height: "1.75rem", width: "1.75rem", color: "white" }} />
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#2e2e2e", marginBottom: "0.375rem" }}>Create Account</h1>
          <p style={{ marginTop: "0.375rem", fontSize: "0.875rem", color: "#6b7280" }}>Enter invite code and create password</p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
          style={{ marginBottom: "2rem" }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem", marginBottom: "1.5rem" }}>
            {[
              { Icon: Bot, label: "AI Support 24/7", sub: "Always here" },
              { Icon: Shield, label: "Full Anonymity", sub: "Your data is protected" },
              { Icon: Users, label: "Community", sub: "Peer support" },
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
              <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, display: "flex", alignItems: "center", paddingLeft: "0.875rem", zIndex: 10 }}>
                <Mail style={{ height: "1.125rem", width: "1.125rem", color: "#94a3b8" }} />
              </div>
              <input
                style={inputStyle}
                placeholder="Enter your invite code"
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
              <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, display: "flex", alignItems: "center", paddingLeft: "0.875rem", zIndex: 10 }}>
                <Lock style={{ height: "1.125rem", width: "1.125rem", color: "#94a3b8" }} />
              </div>
              <input
                type="password"
                style={inputStyle}
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={(e) => (e.target.style.background = "rgba(255, 255, 255, 1)")}
                onBlur={(e) => (e.target.style.background = "rgba(255, 255, 255, 0.8)")}
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.375rem", fontSize: "0.875rem", fontWeight: "500", color: "#475569" }}>Confirm Password</label>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, display: "flex", alignItems: "center", paddingLeft: "0.875rem", zIndex: 10 }}>
                <Lock style={{ height: "1.125rem", width: "1.125rem", color: "#94a3b8" }} />
              </div>
              <input
                type="password"
                style={inputStyle}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            disabled={isLoading || !inviteCode || !password || !confirmPassword}
            onClick={submitRegister}
            style={{ position: "relative", display: "flex", width: "100%", alignItems: "center", justifyContent: "center", gap: "0.625rem", borderRadius: "0.75rem", background: "#72a5f8", padding: "0.875rem 1.5rem", fontSize: "0.875rem", fontWeight: "600", color: "white", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", transition: "all 0.2s ease", border: "none", cursor: isLoading || !inviteCode || !password || !confirmPassword ? "not-allowed" : "pointer", opacity: isLoading || !inviteCode || !password || !confirmPassword ? 0.5 : 1 }}
          >
            {isLoading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} style={{ height: "1.25rem", width: "1.25rem", borderRadius: "50%", border: "2px solid rgba(255, 255, 255, 0.3)", borderTop: "2px solid white" }} />
            ) : (
              <>
                <LogIn style={{ height: "1.125rem", width: "1.125rem" }} />
                <span>Create Account</span>
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
            Already have an account?{" "}
            <button onClick={() => navigate("/login")} style={{ color: "#72a5f8", fontWeight: "500", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
              Login
            </button>
          </p>
          <p style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "#94a3b8" }}>No invite code? Contact your organization administrator.</p>
        </motion.div>
      </motion.div>

      {/* Credentials Display Screen */}
      {showCredentials && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ 
            position: "fixed", 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: "rgba(0, 0, 0, 0.5)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            padding: "1rem",
            zIndex: 1000
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ 
              width: "100%", 
              maxWidth: "28rem", 
              background: "rgba(255, 255, 255, 0.95)", 
              backdropFilter: "blur(40px)", 
              borderRadius: "1rem", 
              padding: "2rem", 
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)", 
              border: "1px solid rgba(255, 255, 255, 0.8)" 
            }}
          >
            {/* Success Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{ 
                margin: "0 auto", 
                marginBottom: "1.5rem", 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                height: "4rem", 
                width: "4rem", 
                borderRadius: "50%", 
                background: "#10b981", 
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" 
              }}
            >
              <span style={{ fontSize: "2rem", color: "white" }}>Success!</span>
            </motion.div>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3, duration: 0.5 }}
              style={{ marginBottom: "2rem", textAlign: "center" }}
            >
              <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#2e2e2e", marginBottom: "0.5rem" }}>
                Account Created Successfully!
              </h1>
              <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                Please save your login credentials for future access
              </p>
            </motion.div>

            {/* Credentials Display */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.4, duration: 0.5 }}
              style={{ marginBottom: "2rem" }}
            >
              <div style={{ 
                background: "rgba(79, 100, 255, 0.1)", 
                borderRadius: "0.75rem", 
                border: "1px solid rgba(79, 100, 255, 0.3)", 
                padding: "1.5rem",
                marginBottom: "1rem"
              }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.75rem", fontWeight: "600", color: "#4f64ff", textTransform: "uppercase" }}>
                  Username
                </label>
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "0.5rem",
                  background: "white", 
                  padding: "0.75rem 1rem", 
                  borderRadius: "0.5rem", 
                  border: "1px solid rgba(79, 100, 255, 0.2)",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#2e2e2e"
                }}>
                  <span style={{ flex: 1 }}>{credentials.username}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(credentials.username)}
                    style={{ 
                      background: "none", 
                      border: "none", 
                      color: "#4f64ff", 
                      cursor: "pointer",
                      padding: "0.25rem"
                    }}
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div style={{ 
                background: "rgba(79, 100, 255, 0.1)", 
                borderRadius: "0.75rem", 
                border: "1px solid rgba(79, 100, 255, 0.3)", 
                padding: "1.5rem"
              }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.75rem", fontWeight: "600", color: "#4f64ff", textTransform: "uppercase" }}>
                  Password
                </label>
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "0.5rem",
                  background: "white", 
                  padding: "0.75rem 1rem", 
                  borderRadius: "0.5rem", 
                  border: "1px solid rgba(79, 100, 255, 0.2)",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#2e2e2e"
                }}>
                  <span style={{ flex: 1 }}>{"*".repeat(credentials.password.length)}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(credentials.password)}
                    style={{ 
                      background: "none", 
                      border: "none", 
                      color: "#4f64ff", 
                      cursor: "pointer",
                      padding: "0.25rem"
                    }}
                  >
                    Copy
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Warning Message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.5, duration: 0.5 }}
              style={{ 
                marginBottom: "2rem", 
                padding: "1rem", 
                background: "rgba(251, 191, 36, 0.1)", 
                border: "1px solid rgba(251, 191, 36, 0.3)", 
                borderRadius: "0.5rem",
                textAlign: "center"
              }}
            >
              <p style={{ fontSize: "0.75rem", color: "#92400e", margin: 0 }}>
                <strong>Important:</strong> Save these credentials securely. You'll need them to login without the invite code.
              </p>
            </motion.div>

            {/* Continue Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/student-dashboard")}
                style={{ 
                  display: "flex", 
                  width: "100%", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  gap: "0.625rem", 
                  borderRadius: "0.75rem", 
                  background: "#4f64ff", 
                  padding: "0.875rem 1.5rem", 
                  fontSize: "0.875rem", 
                  fontWeight: "600", 
                  color: "white", 
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", 
                  transition: "all 0.2s ease", 
                  border: "none", 
                  cursor: "pointer" 
                }}
              >
                <span>Continue to Dashboard</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
