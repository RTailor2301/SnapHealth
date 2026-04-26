import { motion } from "framer-motion";
import { useVoiceSpeech } from "../hooks/useVoiceSpeech";
import { safeSpring } from "../motion";

export default function SpeakButton({ text, className = "" }) {
  const { speak, stop, speaking, supported } = useVoiceSpeech();

  if (!supported || !text) return null;

  return (
    <motion.button
      type="button"
      onClick={() => speaking ? stop() : speak(text)}
      title={speaking ? "Stop reading" : "Read aloud"}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={safeSpring}
      className={`flex items-center gap-1 transition ${className}`}
      style={{
        color: speaking ? "var(--accent)" : "var(--muted)",
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-xs)",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: "4px 0",
        minHeight: "44px",
      }}
    >
      {speaking ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: "1rem", height: "1rem" }}>
            <rect x="6" y="4" width="4" height="16" rx="1"/>
            <rect x="14" y="4" width="4" height="16" rx="1"/>
          </svg>
          Stop
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: "1rem", height: "1rem" }}>
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
          Read aloud
        </>
      )}
    </motion.button>
  );
}
