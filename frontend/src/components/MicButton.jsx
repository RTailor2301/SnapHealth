import { motion } from "framer-motion";
import { useVoiceInput } from "../hooks/useVoiceInput";
import { safeSpring } from "../motion";

export default function MicButton({ onTranscript, lang = "en-US", className = "" }) {
  const { listening, startListening, stopListening, supported } = useVoiceInput(onTranscript);

  if (!supported) return null;

  return (
    <motion.button
      type="button"
      onClick={() => listening ? stopListening() : startListening(lang)}
      title={listening ? "Stop listening" : "Speak your input"}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={safeSpring}
      className={`flex items-center justify-center rounded-full transition ${className}`}
      style={{
        background: listening ? "rgba(220,38,38,0.1)" : "rgba(100,116,139,0.1)",
        color: listening ? "#dc2626" : "var(--muted)",
        border: listening ? "1px solid rgba(220,38,38,0.3)" : "1px solid transparent",
        minWidth: "44px",
        minHeight: "44px",
        animation: listening ? "pulse 1.5s ease-in-out infinite" : "none",
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: "1rem", height: "1rem" }}>
        <path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12v-2h-2z"/>
      </svg>
    </motion.button>
  );
}
