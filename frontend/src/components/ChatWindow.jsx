import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sendChat } from "../services/api";
import MicButton from "./MicButton";
import SpeakButton from "./SpeakButton";
import { t } from "../i18n";
import { safeSpring } from "../motion";

export default function ChatWindow({ initialHistory, language, profile, disabled }) {
  const [messages, setMessages] = useState(initialHistory || []);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading || disabled) return;

    const userMsg = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const response = await sendChat({ history: updated, message: text, language, profile });
      setMessages([...updated, { role: "assistant", content: response }]);
    } catch {
      setMessages([...updated, { role: "assistant", content: t(language, "chat.error") }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{
        border: "1px solid rgba(100,116,139,0.2)",
        borderRadius: "var(--radius-lg)",
        background: "var(--surface)",
        boxShadow: "var(--shadow-sm)",
        height: "18rem",
      }}
    >
      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ background: "var(--bg)" }}>
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`text-sm max-w-xs ${m.role === "user" ? "ml-auto" : "mr-auto"}`}
            >
              <div
                className="px-3 py-2"
                style={{
                  borderRadius: m.role === "user" ? "var(--radius-lg) var(--radius-lg) var(--radius-sm) var(--radius-lg)" : "var(--radius-lg) var(--radius-lg) var(--radius-lg) var(--radius-sm)",
                  background: m.role === "user" ? "var(--accent)" : "var(--surface)",
                  color: m.role === "user" ? "#fff" : "var(--text)",
                  border: m.role === "user" ? "none" : "1px solid rgba(100,116,139,0.15)",
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-sm)",
                  lineHeight: 1.6,
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                {m.content}
              </div>
              {m.role === "assistant" && (
                <div className="mt-1 pl-1">
                  <SpeakButton text={m.content} />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="mr-auto">
            <div
              className="px-3 py-2 text-sm animate-pulse"
              style={{
                borderRadius: "var(--radius-lg) var(--radius-lg) var(--radius-lg) var(--radius-sm)",
                background: "var(--surface)",
                border: "1px solid rgba(100,116,139,0.15)",
                color: "var(--muted)",
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)",
              }}
            >
              {t(language, "chat.thinking")}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div
        className="flex items-center gap-2 px-3 py-2 border-t"
        style={{ background: "var(--surface)", borderColor: "rgba(100,116,139,0.12)" }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={disabled ? t(language, "chat.disabled_placeholder") : t(language, "chat.placeholder")}
          disabled={disabled}
          className="flex-1 text-sm px-3 py-2 border transition"
          style={{
            borderRadius: "var(--radius-md)",
            borderColor: "rgba(100,116,139,0.3)",
            color: "var(--text)",
            background: disabled ? "var(--bg)" : "var(--surface)",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-sm)",
            minHeight: "44px",
            outline: "none",
          }}
          onFocus={(e) => (e.target.style.boxShadow = "0 0 0 2px var(--accent)")}
          onBlur={(e) => (e.target.style.boxShadow = "none")}
        />
        <MicButton onTranscript={(t) => setInput(t)} className="w-10 h-10 shrink-0" />
        <motion.button
          onClick={handleSend}
          disabled={loading || disabled || !input.trim()}
          whileHover={{ boxShadow: "var(--shadow-accent)" }}
          whileTap={{ scale: 0.97 }}
          transition={safeSpring}
          className="text-sm font-medium text-white px-4 shrink-0"
          style={{
            background: "var(--accent)",
            borderRadius: "var(--radius-md)",
            border: "none",
            fontFamily: "var(--font-body)",
            minHeight: "44px",
            cursor: loading || disabled || !input.trim() ? "not-allowed" : "pointer",
            opacity: loading || disabled || !input.trim() ? 0.4 : 1,
          }}
        >
          {t(language, "chat.send")}
        </motion.button>
      </div>
    </div>
  );
}
