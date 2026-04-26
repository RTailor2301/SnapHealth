import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CameraCapture from "../components/CameraCapture";
import SeverityBadge from "../components/SeverityBadge";
import ReasoningAccordion from "../components/ReasoningAccordion";
import DoctorsNoteCard from "../components/DoctorsNoteCard";
import ChatWindow from "../components/ChatWindow";
import MicButton from "../components/MicButton";
import SpeakButton from "../components/SpeakButton";
import { analyzeBody } from "../services/api";
import { t } from "../i18n";
import { containerVariants, itemVariants, safeSpring } from "../motion";

function buildSpeechText(result) {
  const parts = [result.plain_explanation];
  if (result.recommendation_reasoning) parts.push(result.recommendation_reasoning);
  if (result.action_steps?.length) parts.push("Action steps: " + result.action_steps.join(". "));
  if (result.warning_signs?.length) parts.push("Seek care immediately if: " + result.warning_signs.join(". "));
  return parts.join(". ");
}

const CRISIS_KEYWORDS = ["hurt myself", "self harm", "cut myself", "suicide", "kill myself"];

const card = {
  background: "var(--surface)",
  border: "1px solid rgba(100,116,139,0.15)",
  borderRadius: "var(--radius-lg)",
  boxShadow: "var(--shadow-sm)",
  padding: "1rem",
};

export default function AnalyzeBody({ language, profile }) {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const isCrisis = CRISIS_KEYWORDS.some((k) => description.toLowerCase().includes(k));
  const isEmergency = result?.severity === "call_911";
  const hasInput = Boolean(image) || description.trim().length > 0;

  async function handleAnalyze() {
    if (!hasInput) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await analyzeBody({ image, description, language, history: [], profile });
      setResult(data);
    } catch {
      setError(t(language, "body.error"));
    } finally {
      setLoading(false);
    }
  }

  const chatHistory = result
    ? [
        { role: "user", content: description || t(language, "body.default_user_message") },
        { role: "assistant", content: result.plain_explanation },
      ]
    : [];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">

      {/* AI limitation notice */}
      <motion.div variants={itemVariants} className="p-3 text-sm" style={{ background: "#fffbeb", border: "1px solid #fcd34d", borderLeft: "3px solid #d97706", borderRadius: "var(--radius-lg)" }}>
        <strong style={{ color: "#92400e", fontFamily: "var(--font-body)" }}>{t(language, "body.ai_limitation_label")}</strong>{" "}
        <span style={{ color: "#78350f", fontFamily: "var(--font-body)" }}>{t(language, "body.ai_limitation")}</span>
      </motion.div>

      {/* Camera */}
      <motion.div variants={itemVariants}>
        <p className="text-xs mb-2" style={{ color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
          {t(language, "body.photo_optional")}
        </p>
        <CameraCapture language={language} onCapture={setImage} />
      </motion.div>

      {/* Description + mic */}
      <motion.div variants={itemVariants} className="relative">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t(language, "body.symptoms_placeholder")}
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

      {/* Crisis banner */}
      {isCrisis && (
        <motion.div variants={itemVariants} className="p-4 text-sm" style={{ background: "#faf5ff", border: "1px solid #c084fc", borderRadius: "var(--radius-lg)" }}>
          <p className="font-semibold mb-1" style={{ color: "#581c87", fontFamily: "var(--font-body)" }}>{t(language, "body.crisis_title")}</p>
          <p style={{ color: "#6b21a8", fontFamily: "var(--font-body)", lineHeight: 1.6 }}>
            {t(language, "body.crisis_body_pre")}
            <strong>{t(language, "body.crisis_lifeline")}</strong>
            {t(language, "body.crisis_body_post")}
            <strong>988</strong>.
          </p>
        </motion.div>
      )}

      {/* Analyze button */}
      {!isCrisis && (
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
            {loading ? t(language, "body.analyzing") : t(language, "body.analyze")}
          </motion.button>
        </motion.div>
      )}

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
              <p className="mt-1" style={{ color: "var(--muted)", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)" }}>Please check your connection and try again.</p>
              <button onClick={handleAnalyze} className="mt-2" style={{ color: "var(--accent)", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                Retry
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Emergency */}
      <AnimatePresence>
        {isEmergency && (
          <motion.div
            variants={itemVariants}
            className="p-6 text-white text-center space-y-4"
            style={{ background: "#0f172a", borderRadius: "var(--radius-lg)" }}
          >
            <p className="text-4xl">🚨</p>
            <p className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{t(language, "body.call_911_now")}</p>
            <p className="text-sm" style={{ opacity: 0.8, fontFamily: "var(--font-body)", lineHeight: 1.6 }}>{result.plain_explanation}</p>
            <a
              href="tel:911"
              className="inline-block font-bold px-8 py-3 text-white"
              style={{ background: "#dc2626", borderRadius: "var(--radius-md)", fontFamily: "var(--font-body)", fontSize: "var(--text-base)", minHeight: "44px", display: "inline-flex", alignItems: "center" }}
            >
              {t(language, "body.call_911_button")}
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {result && !isEmergency && (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">

            {/* Severity + speak */}
            <motion.div variants={itemVariants} className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <SeverityBadge language={language} severity={result.severity} severityLabel={result.severity_label} />
              </div>
              <SpeakButton text={buildSpeechText(result)} />
            </motion.div>

            {/* Plain explanation */}
            <motion.div variants={itemVariants} style={card}>
              <p style={{ color: "var(--text)", fontFamily: "var(--font-body)", fontSize: "var(--text-base)", lineHeight: 1.7 }}>
                {result.plain_explanation}
              </p>
            </motion.div>

            {/* Recommendation */}
            {result.recommendation_reasoning && (
              <motion.div variants={itemVariants} style={{ ...card, borderLeft: "2px solid var(--accent)" }}>
                <p className="font-semibold mb-1" style={{ color: "var(--accent)", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)" }}>
                  {t(language, "body.recommendation")}
                </p>
                <p style={{ color: "var(--text)", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", lineHeight: 1.6 }}>
                  {result.recommendation_reasoning}
                </p>
              </motion.div>
            )}

            {/* Action steps */}
            {result.action_steps?.length > 0 && (
              <motion.div variants={itemVariants} style={card}>
                <p className="font-semibold mb-3" style={{ color: "var(--text)", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)" }}>
                  {t(language, "body.action_steps")}
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

            {/* Warning signs */}
            {result.warning_signs?.length > 0 && (
              <motion.div variants={itemVariants} style={{ ...card, background: "#fef2f2", border: "1px solid rgba(220,38,38,0.2)", borderLeft: "2px solid #dc2626" }}>
                <p className="font-semibold mb-3" style={{ color: "#991b1b", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)" }}>
                  {t(language, "body.warning_signs")}
                </p>
                <ul className="space-y-2">
                  {result.warning_signs.map((sign, i) => (
                    <li key={i} className="flex gap-2" style={{ color: "#7f1d1d", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", lineHeight: 1.6 }}>
                      <span>•</span><span>{sign}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <ReasoningAccordion language={language} reasoning={result.reasoning_transparency} severity={result.severity} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <DoctorsNoteCard language={language} script={result.what_to_say_when_you_arrive} followupPrompt={result.followup_prompt} />
            </motion.div>

            {/* Disclaimer */}
            <motion.div variants={itemVariants} className="text-center pt-3 border-t" style={{ borderColor: "rgba(100,116,139,0.12)" }}>
              <p style={{ color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)" }}>
                {result.disclaimer}
              </p>
            </motion.div>

            {/* Follow-up chat */}
            <motion.div variants={itemVariants}>
              <p className="font-semibold mb-2" style={{ color: "var(--text)", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)" }}>
                {t(language, "body.followup_label")}
              </p>
              <ChatWindow initialHistory={chatHistory} language={language} profile={profile} disabled={false} />
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
