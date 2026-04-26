import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CameraCapture from "../components/CameraCapture";
import SeverityBadge from "../components/SeverityBadge";
import ReasoningAccordion from "../components/ReasoningAccordion";
import ChatWindow from "../components/ChatWindow";
import MicButton from "../components/MicButton";
import SpeakButton from "../components/SpeakButton";
import { analyzeLabel } from "../services/api";
import { t } from "../i18n";
import { containerVariants, itemVariants, safeSpring } from "../motion";

function buildSpeechText(result) {
  const parts = [result.plain_explanation];
  if (result.recommendation_reasoning) parts.push(result.recommendation_reasoning);
  if (result.action_steps?.length) parts.push("Key information: " + result.action_steps.join(". "));
  if (result.warning_signs?.length) parts.push("Important warnings: " + result.warning_signs.join(". "));
  return parts.join(". ");
}

const card = {
  background: "var(--surface)",
  border: "1px solid rgba(100,116,139,0.15)",
  borderRadius: "var(--radius-lg)",
  boxShadow: "var(--shadow-sm)",
  padding: "1rem",
};

export default function AnalyzeLabel({ language, profile }) {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [medInput, setMedInput] = useState("");
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const hasInput = Boolean(image) || description.trim().length > 0;

  function addMed() {
    const m = medInput.trim();
    if (m && !medications.includes(m)) setMedications([...medications, m]);
    setMedInput("");
  }

  async function handleAnalyze() {
    if (!hasInput) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const allMeds = [...medications, ...(profile?.currentMedications || [])];
      const data = await analyzeLabel({
        image, description, medications: [...new Set(allMeds)], language, history: [], profile,
      });
      setResult(data);
    } catch {
      setError(t(language, "label.error"));
    } finally {
      setLoading(false);
    }
  }

  const chatHistory = result
    ? [
        { role: "user", content: description || t(language, "label.default_user_message") },
        { role: "assistant", content: result.plain_explanation },
      ]
    : [];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">

      {/* Camera */}
      <motion.div variants={itemVariants}>
        <p className="text-xs mb-2" style={{ color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
          {t(language, "label.photo_optional")}
        </p>
        <CameraCapture language={language} onCapture={setImage} />
      </motion.div>

      {/* Description + mic */}
      <motion.div variants={itemVariants} className="relative">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t(language, "label.placeholder")}
          rows={3}
          className="w-full px-4 py-3 pr-14 resize-none transition"
          style={{
            border: "1px solid rgba(100,116,139,0.3)",
            borderRadius: "var(--radius-lg)",
            color: "var(--text)",
            background: "var(--surface)",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-base)",
            lineHeight: 1.6,
            outline: "none",
          }}
          onFocus={(e) => (e.target.style.boxShadow = "0 0 0 2px var(--accent)")}
          onBlur={(e) => (e.target.style.boxShadow = "none")}
        />
        <div className="absolute bottom-2 right-2">
          <MicButton
            onTranscript={(transcript) => setDescription((prev) => prev ? prev + " " + transcript : transcript)}
            lang={language}
            className="w-10 h-10"
          />
        </div>
      </motion.div>

      {/* Medications */}
      <motion.div variants={itemVariants}>
        <p className="font-semibold mb-2" style={{ color: "var(--text)", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)" }}>
          {t(language, "label.other_meds")}
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={medInput}
            onChange={(e) => setMedInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addMed()}
            placeholder={t(language, "label.med_placeholder")}
            className="flex-1 px-3 py-2 text-sm border transition"
            style={{
              borderRadius: "var(--radius-md)",
              borderColor: "rgba(100,116,139,0.3)",
              color: "var(--text)",
              background: "var(--surface)",
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              minHeight: "44px",
              outline: "none",
            }}
            onFocus={(e) => (e.target.style.boxShadow = "0 0 0 2px var(--accent)")}
            onBlur={(e) => (e.target.style.boxShadow = "none")}
          />
          <button
            onClick={addMed}
            className="px-4 text-sm font-medium transition"
            style={{
              background: "rgba(100,116,139,0.1)",
              color: "var(--text)",
              borderRadius: "var(--radius-md)",
              border: "1px solid rgba(100,116,139,0.2)",
              fontFamily: "var(--font-body)",
              minHeight: "44px",
              cursor: "pointer",
            }}
          >
            {t(language, "label.add")}
          </button>
        </div>
        {medications.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {medications.map((m) => (
              <span
                key={m}
                className="flex items-center gap-1 px-3 py-1 text-xs font-medium"
                style={{ background: "rgba(17,94,89,0.08)", color: "var(--accent)", border: "1px solid rgba(17,94,89,0.2)", borderRadius: "var(--radius-full)" }}
              >
                {m}
                <button
                  onClick={() => setMedications(medications.filter((x) => x !== m))}
                  style={{ color: "var(--accent)", background: "transparent", border: "none", cursor: "pointer", lineHeight: 1 }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </motion.div>

      {/* Analyze button */}
      <motion.div variants={itemVariants}>
        <motion.button
          onClick={handleAnalyze}
          disabled={!hasInput || loading}
          whileHover={hasInput && !loading ? { boxShadow: "var(--shadow-accent)", scale: 1.01 } : {}}
          whileTap={hasInput && !loading ? { scale: 0.98 } : {}}
          transition={safeSpring}
          className="w-full font-semibold text-white"
          style={{
            background: "var(--accent)",
            borderRadius: "var(--radius-md)",
            padding: "14px 0",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-base)",
            border: "none",
            cursor: !hasInput || loading ? "not-allowed" : "pointer",
            opacity: !hasInput || loading ? 0.45 : 1,
            minHeight: "44px",
          }}
        >
          {loading ? t(language, "label.decoding") : image ? t(language, "label.decode") : t(language, "label.ask")}
        </motion.button>
      </motion.div>

      {/* Loading skeleton */}
      {loading && (
        <motion.div variants={itemVariants} className="space-y-3">
          {[80, 100, 60].map((w, i) => (
            <div key={i} className="animate-pulse" style={{ height: "1rem", width: `${w}%`, borderRadius: "var(--radius-sm)", background: "rgba(100,116,139,0.15)" }} />
          ))}
        </motion.div>
      )}

      {/* Error */}
      {error && (
        <motion.div variants={itemVariants} className="p-4" style={{ background: "var(--surface)", borderLeft: "2px solid var(--accent)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}>
          <div className="flex items-start gap-3">
            <span style={{ color: "var(--accent)", fontSize: "1.25rem" }}>⚠</span>
            <div>
              <p className="font-medium" style={{ color: "var(--text)", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)" }}>{error}</p>
              <button onClick={handleAnalyze} className="mt-2" style={{ color: "var(--accent)", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                Retry
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">

            <motion.div variants={itemVariants} className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <SeverityBadge language={language} severity={result.severity} severityLabel={result.severity_label} />
              </div>
              <SpeakButton text={buildSpeechText(result)} />
            </motion.div>

            <motion.div variants={itemVariants} style={card}>
              <p style={{ color: "var(--text)", fontFamily: "var(--font-body)", fontSize: "var(--text-base)", lineHeight: 1.7 }}>
                {result.plain_explanation}
              </p>
            </motion.div>

            {result.action_steps?.length > 0 && (
              <motion.div variants={itemVariants} style={card}>
                <p className="font-semibold mb-3" style={{ color: "var(--text)", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)" }}>
                  {t(language, "label.key_information")}
                </p>
                <ul className="space-y-2">
                  {result.action_steps.map((step, i) => (
                    <li key={i} className="flex gap-2" style={{ color: "var(--text)", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", lineHeight: 1.6 }}>
                      <span style={{ color: "var(--accent)", fontWeight: 600 }}>→</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {result.warning_signs?.length > 0 && (
              <motion.div variants={itemVariants} style={{ ...card, background: "#fef2f2", border: "1px solid rgba(220,38,38,0.2)", borderLeft: "2px solid #dc2626" }}>
                <p className="font-semibold mb-3" style={{ color: "#991b1b", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)" }}>
                  {t(language, "label.warnings")}
                </p>
                <ul className="space-y-2">
                  {result.warning_signs.map((sign, i) => (
                    <li key={i} style={{ color: "#7f1d1d", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", lineHeight: 1.6 }}>• {sign}</li>
                  ))}
                </ul>
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <ReasoningAccordion language={language} reasoning={result.reasoning_transparency} severity={result.severity} />
            </motion.div>

            <motion.div variants={itemVariants} className="text-center pt-3 border-t" style={{ borderColor: "rgba(100,116,139,0.12)" }}>
              <p style={{ color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)" }}>
                {result.disclaimer}
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <p className="font-semibold mb-2" style={{ color: "var(--text)", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)" }}>
                {t(language, "label.followup_label")}
              </p>
              <ChatWindow initialHistory={chatHistory} language={language} profile={profile} disabled={false} />
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
