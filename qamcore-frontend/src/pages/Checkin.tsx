import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getActiveCheckIn, submitCheckIn } from "../api/checkin";
import { useNavigate } from "react-router-dom";
import { Question } from "../api/checkin";
import { CheckCircle, MessageSquare, TrendingUp, ArrowRight, ArrowLeft } from "lucide-react";

/* ─────────────────────────────────────────────
   Animated mesh‑gradient background
   ───────────────────────────────────────────── */
function MeshGradientBg() {
  return (
    <div style={{ 
      position: "absolute", 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      overflow: "hidden", 
      pointerEvents: "none" 
    }}>
      <div style={{ 
        position: "absolute", 
        inset: 0, 
        background: "linear-gradient(to bottom right, #e0f2fe, #e0e7ff, #fef2f2)" 
      }} />
      
      <motion.div
        animate={{
          x: [0, 60, -30, 0],
          y: [0, -40, 50, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          left: "-8rem",
          top: "-8rem",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "rgba(125, 211, 252, 0.5)",
          filter: "blur(3rem)"
        }}
      />
      
      <motion.div
        animate={{
          x: [0, -50, 40, 0],
          y: [0, 60, -30, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          right: "-8rem",
          top: "25%",
          width: "450px",
          height: "450px",
          borderRadius: "50%",
          background: "rgba(129, 140, 248, 0.4)",
          filter: "blur(3rem)"
        }}
      />
      
      <motion.div
        animate={{
          x: [0, 40, -50, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          bottom: "-8rem",
          left: "33.333%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "rgba(251, 207, 232, 0.4)",
          filter: "blur(3rem)"
        }}
      />
    </div>
  );
}

type LoadState = "loading" | "no_checkin" | "completed" | "ready" | "trust";

export default function Checkin() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [submitting, setSubmitting] = useState(false);
  const [checkinId, setCheckinId] = useState<string>("");

  useEffect(() => {
    const loadCheckIn = async () => {
      try {
        const checkIn = await getActiveCheckIn();
        console.log("Loaded check-in:", checkIn);

        if (!checkIn.questions || checkIn.questions.length === 0) {
          setLoadState("no_checkin");
          return;
        }

        setQuestions(checkIn.questions);
        setCheckinId(checkIn.checkinId);
        setLoadState("trust"); // Сначала показываем экран доверия
      } catch (error: any) {
        console.error("Failed to load check-in:", error);
        if (error?.message?.includes("409") || error?.status === 409 || error?.message?.includes("403") || error?.status === 403) {
          setLoadState("completed");
        } else {
          setLoadState("no_checkin");
        }
      }
    };

    loadCheckIn();
  }, []);

  const handleStartSurvey = () => {
    setLoadState("ready");
  };

  const centeredPage: React.CSSProperties = {
    minHeight: "100vh",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    background: "#72a5f8",
  };

  const card: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(40px)",
    borderRadius: "1rem",
    padding: "2rem",
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
    border: "1px solid rgba(255,255,255,0.8)",
  };

  function EmptyState({ title, subtitle, onBack }: { title: string; subtitle: string; onBack: () => void }) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} style={{ ...card, textAlign: "center" }}>
        <MessageSquare style={{ height: "3rem", width: "3rem", color: "#72a5f8", marginBottom: "1rem" }} />
        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#2e2e2e", marginBottom: "0.5rem" }}>{title}</h2>
        <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "1.5rem" }}>{subtitle}</p>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onBack} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: "0.75rem", background: "#72a5f8", color: "white", border: "none", cursor: "pointer", fontSize: "0.875rem", fontWeight: 500, margin: "0 auto" }}>
          <ArrowLeft style={{ height: "1rem", width: "1rem" }} />
          Вернуться к панели
        </motion.button>
      </motion.div>
    );
  }

  function AnswerButton({ label, onClick, disabled, flex }: { label: string; onClick: () => void; disabled: boolean; flex?: boolean }) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        disabled={disabled}
        style={{ ...(flex ? { flex: 1 } : {}), padding: "1rem 2rem", borderRadius: "0.75rem", background: "#72a5f8", color: "white", border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: 500, opacity: disabled ? 0.5 : 1 }}
      >
        {label}
      </motion.button>
    );
  }

  /* ── Trust Screen ── */
  if (loadState === "trust") {
    return (
      <div style={centeredPage}>
        <MeshGradientBg />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: "100%",
            maxWidth: "500px",
            ...card,
            textAlign: "center"
          }}
        >
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            height: "4rem", 
            width: "4rem", 
            borderRadius: "50%", 
            background: "#72a5f8", 
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            margin: "0 auto 1.5rem"
          }}>
            <span style={{ fontSize: "2rem" }}>🔒</span>
          </div>
          
          <h1 style={{ 
            fontSize: "1.875rem", 
            fontWeight: "bold", 
            color: "#2e2e2e", 
            marginBottom: "1rem" 
          }}>
            Конфиденциальность гарантирована
          </h1>
          
          <div style={{ 
            fontSize: "1rem", 
            color: "#6b7280", 
            marginBottom: "2rem", 
            lineHeight: "1.6" 
          }}>
            <div style={{ marginBottom: "1rem" }}>
              <span style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}>🤫</span>
              <strong>Ваши ответы анонимны</strong>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <span style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}>👤</span>
              Мы не знаем вашего имени
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <span style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}>👨‍⚕️</span>
              Данные видит только психолог учебного заведения
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <span style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}>⏱️</span>
              Опрос занимает всего 1-2 минуты
            </div>
            <div>
              <span style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}>🛡️</span>
              Все данные защищены и зашифрованы
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartSurvey}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              padding: "1rem 2rem",
              borderRadius: "0.75rem",
              background: "#72a5f8",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontSize: "1.125rem",
              fontWeight: "600",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              margin: "0 auto"
            }}
          >
            <span style={{ fontSize: "1.25rem" }}>✓</span>
            Начать опрос
          </motion.button>
        </motion.div>
      </div>
    );
  }

  /* ── Loading ── */
  if (loadState === "loading") {
    return (
      <div style={centeredPage}>
        <MeshGradientBg />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={card}
        >
          <p style={{ fontSize: "1.25rem", fontWeight: 500, color: "#2e2e2e" }}>
            Загрузка опроса...
          </p>
        </motion.div>
      </div>
    );
  }

  /* ── Completed today ── */
  if (loadState === "completed") {
    return (
      <div style={centeredPage}>
        <MeshGradientBg />
        <EmptyState
          title="Опрос уже пройден"
          subtitle="Вы уже прошли опрос сегодня. Возвращайтесь завтра!"
          onBack={() => navigate("/student-dashboard")}
        />
      </div>
    );
  }

  /* ── No active checkin ── */
  if (loadState === "no_checkin") {
    return (
      <div style={centeredPage}>
        <MeshGradientBg />
        <EmptyState
          title="Нет активных опросов"
          subtitle="В настоящее время нет доступных опросов"
          onBack={() => navigate("/student-dashboard")}
        />
      </div>
    );
  }

  /* ── Guard: questions not yet set (shouldn't happen, but just in case) ── */
  if (loadState === "ready" && questions.length === 0) return null;

  /* ── Quiz ── */
  if (currentQuestionIndex >= questions.length) return null;

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const getAnswersForQuestion = (question: Question) => {
    switch (question.type) {
      case 'boolean':
        return [
          { value: 1, label: 'Да' },
          { value: 0, label: 'Нет' }
        ];
      
      case 'scale':
        const min = Math.max(1, question.min || 1);
        const max = question.max || 5;
        return Array.from({ length: max - min + 1 }, (_, i) => ({
          value: min + i,
          label: String(min + i)
        }));
      
      case 'yes_no':
        return [
          { value: 1, label: 'Да' },
          { value: 0, label: 'Нет' }
        ];
      
      case 'text':
        return []; // Text input handled separately
      
      default:
        return [];
    }
  };

  const currentQuestionAnswers = getAnswersForQuestion(currentQuestion);

  const handleAnswer = async (value: string | number) => {
    console.log("Answering question:", currentQuestionIndex, "of", questions.length, "with value:", value);
    
    // Convert string answers to numbers for backend compatibility
    let numericValue: number;
    if (typeof value === 'string') {
      if (value === 'yes' || value === 'true') numericValue = 1;
      else if (value === 'no' || value === 'false') numericValue = 0;
      else numericValue = parseInt(value) || 0;
    } else {
      numericValue = value;
    }
    
    const newAnswers = { ...answers, [currentQuestion.id]: numericValue };
    setAnswers(newAnswers);

    if (currentQuestionIndex === questions.length - 1) {
      // Last question - submit check-in
      setSubmitting(true);
      try {
        await submitCheckIn({
          checkinId,
          answers: newAnswers,
        });
        navigate("/success");
      } catch (error) {
        console.error("Failed to submit check-in:", error);
        alert("Ошибка при отправке ответов");
      } finally {
        setSubmitting(false);
      }
    } else {
      // Next question
      console.log("Moving to next question:", currentQuestionIndex + 1);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      position: "relative", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      padding: "1rem", 
      background: "#4f64ff" 
    }}>
      <MeshGradientBg />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: "100%",
          maxWidth: "600px",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(40px)",
          borderRadius: "1rem",
          padding: "2rem",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          border: "1px solid rgba(255, 255, 255, 0.8)"
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          style={{ 
            marginBottom: "2rem", 
            textAlign: "center" 
          }}
        >
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            height: "3rem", 
            width: "3rem", 
            borderRadius: "0.75rem", 
            background: "#72a5f8", 
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            margin: "0 auto 1rem"
          }}>
            <CheckCircle style={{ height: "1.5rem", width: "1.5rem", color: "white" }} />
          </div>
          <h1 style={{ 
            fontSize: "1.875rem", 
            fontWeight: "bold", 
            color: "#2e2e2e", 
            marginBottom: "0.5rem" 
          }}>
            Психологический опрос
          </h1>
          <p style={{ 
            fontSize: "0.875rem", 
            color: "#6b7280" 
          }}>
            Вопрос {currentQuestionIndex + 1} из {questions.length}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{ marginBottom: "2rem" }}
        >
          <div style={{
            width: "100%",
            height: "0.5rem",
            backgroundColor: "rgba(226, 232, 240, 0.8)",
            borderRadius: "9999px",
            overflow: "hidden"
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{
                height: "100%",
                background: "#72a5f8",
                borderRadius: "9999px"
              }}
            />
          </div>
          <p style={{ 
            fontSize: "0.75rem", 
            color: "#6b7280", 
            marginTop: "0.5rem", 
            textAlign: "center" 
          }}>
            {Math.round(progress)}% завершено
          </p>
        </motion.div>

        {/* Question Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          style={{
            background: "rgba(79, 100, 255, 0.4)",
            borderRadius: "0.75rem",
            border: "1px solid rgba(226, 232, 240, 0.8)",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            padding: "2rem",
            marginBottom: "2rem"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <MessageSquare style={{ height: "1.25rem", width: "1.25rem", color: "#4f64ff" }} />
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#2e2e2e" }}>
              {currentQuestion.text}
            </h3>
          </div>
          
          {(currentQuestion.type === "yes_no" || currentQuestion.type === "boolean") && (
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              {currentQuestionAnswers.map((answer) => (
                <AnswerButton key={answer.value} label={answer.label} onClick={() => handleAnswer(answer.value)} disabled={submitting} flex />
              ))}
            </div>
          )}
          
          {currentQuestion.type === "text" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <input
                id="textAnswer"
                type="text"
                placeholder="Введите ваш ответ..."
                disabled={submitting}
                style={{ width: "100%", padding: "1rem", borderRadius: "0.75rem", border: "1px solid rgba(79,100,255,0.3)", background: "rgba(255,255,255,0.9)", fontSize: "1rem", outline: "none" }}
              />
              <AnswerButton
                label="Ответить"
                disabled={submitting}
                onClick={() => {
                  const input = document.getElementById("textAnswer") as HTMLInputElement;
                  const numericValue = (input?.value || "").split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
                  handleAnswer(numericValue);
                }}
              />
            </div>
          )}
          
          {currentQuestion.type === "scale" && (
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
              {currentQuestionAnswers.map((answer) => (
                <motion.button
                  key={answer.value}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleAnswer(answer.value)}
                  disabled={submitting}
                  style={{ width: "3rem", height: "3rem", borderRadius: "50%", background: "#72a5f8", color: "white", border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: "bold", opacity: submitting ? 0.5 : 1 }}
                >
                  {answer.label}
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0 || submitting}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: "0.75rem", background: currentQuestionIndex === 0 ? "rgba(156, 163, 175, 0.5)" : "#4f64ff", color: "white", border: "none", cursor: currentQuestionIndex === 0 ? "not-allowed" : "pointer", fontSize: "0.875rem", fontWeight: 500, opacity: currentQuestionIndex === 0 || submitting ? 0.5 : 1 }}
          >
            <ArrowLeft style={{ height: "1rem", width: "1rem" }} />
            Назад
          </motion.button>

          {submitting && (
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity }} style={{ fontSize: "0.875rem", color: "#4f64ff" }}>
              Отправка...
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
