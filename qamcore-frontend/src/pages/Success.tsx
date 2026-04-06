import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ArrowLeft, Home, TrendingUp } from "lucide-react";

export default function Success() {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    // Очищаем токен и перенаправляем на логин
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleBackToCheckin = () => {
    navigate("/checkin");
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      position: "relative", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      padding: "1rem", 
      background: "linear-gradient(to bottom right, #e0f2fe, #e0e7ff, #fef2f2)" 
    }}>
      {/* Animated background blobs */}
      <div style={{
        position: "absolute",
        left: "-8rem",
        top: "-8rem",
        width: "20rem",
        height: "20rem",
        background: "rgba(125, 211, 252, 0.5)",
        borderRadius: "50%",
        filter: "blur(3rem)",
        zIndex: 0
      }} />
      
      <div style={{
        position: "absolute",
        right: "-8rem",
        top: "25%",
        width: "18rem",
        height: "18rem",
        background: "rgba(129, 140, 248, 0.4)",
        borderRadius: "50%",
        filter: "blur(3rem)",
        zIndex: 0
      }} />
      
      <div style={{
        position: "absolute",
        bottom: "-8rem",
        left: "33.333%",
        width: "16rem",
        height: "16rem",
        background: "rgba(251, 207, 232, 0.4)",
        borderRadius: "50%",
        filter: "blur(3rem)",
        zIndex: 0
      }} />
      
      <div style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: "14rem",
        height: "14rem",
        transform: "translate(-50%, -50%)",
        background: "rgba(254, 240, 138, 0.3)",
        borderRadius: "50%",
        filter: "blur(3rem)",
        zIndex: 0
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: "100%",
          maxWidth: "500px",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(40px)",
          borderRadius: "1rem",
          padding: "2rem",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          border: "1px solid rgba(255, 255, 255, 0.8)",
          textAlign: "center"
        }}
      >
        {/* Success Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.5, type: "spring" }}
          style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            height: "4rem", 
            width: "4rem", 
            borderRadius: "50%", 
            background: "#72a5f8",
            boxShadow: "0 20px 25px -5px rgba(16, 185, 129, 0.25), 0 10px 10px -5px rgba(16, 185, 129, 0.1)",
            margin: "0 auto 1.5rem"
          }}
        >
          <CheckCircle style={{ height: "2rem", width: "2rem", color: "white" }} />
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          <h1 style={{ 
            fontSize: "2rem", 
            fontWeight: "bold", 
            color: "#2e2e2e", 
            marginBottom: "0.75rem" 
          }}>
            Успешно!
          </h1>
          <p style={{ 
            fontSize: "1.125rem", 
            color: "#6b7280", 
            marginBottom: "2rem",
            lineHeight: "1.6"
          }}>
            Ваш опрос успешно отправлен
          </p>
        </motion.div>

        {/* Success Details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          style={{
            background: "rgba(114, 165, 248, 0.1)",
            borderRadius: "0.75rem",
            border: "1px solid rgba(114, 165, 248, 0.2)",
            padding: "1.5rem",
            marginBottom: "2rem"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <TrendingUp style={{ height: "1.25rem", width: "1.25rem", color: "#72a5f8" }} />
            <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "#2e2e2e" }}>
              Что дальше?
            </h3>
          </div>
          <ul style={{ 
            listStyle: "none", 
            padding: 0, 
            margin: 0,
            textAlign: "left"
          }}>
            <li style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "0.5rem", 
              marginBottom: "0.75rem",
              fontSize: "0.875rem",
              color: "#6b7280"
            }}>
              <div style={{
                width: "0.5rem",
                height: "0.5rem",
                borderRadius: "50%",
                background: "#72a5f8",
                flexShrink: 0
              }} />
              Ваши ответы помогут психологу лучше понять ваше состояние
            </li>
            <li style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "0.5rem", 
              marginBottom: "0.75rem",
              fontSize: "0.875rem",
              color: "#6b7280"
            }}>
              <div style={{
                width: "0.5rem",
                height: "0.5rem",
                borderRadius: "50%",
                background: "#72a5f8",
                flexShrink: 0
              }} />
              При необходимости с вами свяжется специалист
            </li>
            <li style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "0.5rem", 
              fontSize: "0.875rem",
              color: "#6b7280"
            }}>
              <div style={{
                width: "0.5rem",
                height: "0.5rem",
                borderRadius: "50%",
                background: "#72a5f8",
                flexShrink: 0
              }} />
              Следующий опрос будет доступен завтра
            </li>
          </ul>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          style={{ 
            display: "flex", 
            gap: "1rem", 
            justifyContent: "center",
            flexWrap: "wrap"
          }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBackToLogin}
            style={{
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
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
            }}
          >
            <Home style={{ height: "1rem", width: "1rem" }} />
            Выйти
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBackToCheckin}
            style={{
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
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
            }}
          >
            <ArrowLeft style={{ height: "1rem", width: "1rem" }} />
            К опросу
          </motion.button>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          style={{
            marginTop: "2rem",
            padding: "1rem",
            borderRadius: "0.75rem",
            background: "rgba(248, 250, 252, 0.8)",
            border: "1px solid rgba(226, 232, 240, 0.8)"
          }}
        >
          <p style={{ 
            fontSize: "0.75rem", 
            color: "#6b7280",
            margin: 0
          }}>
            Регулярные опросы помогают поддерживать психологическое здоровье
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
