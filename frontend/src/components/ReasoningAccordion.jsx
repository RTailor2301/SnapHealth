import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { t } from "../i18n";

export default function ReasoningAccordion({ language, reasoning, severity }) {
  const [open, setOpen] = useState(false);

  if (!reasoning) return null;

  const label =
    severity === "green"   ? t(language, "reasoning.why_green")  :
    severity === "yellow"  ? t(language, "reasoning.why_yellow") :
    severity === "red"     ? t(language, "reasoning.why_red")    :
                             t(language, "reasoning.why_911");

  return (
    <div
      className="overflow-hidden"
      style={{ border: "1px solid rgba(100,116,139,0.2)", borderRadius: "var(--radius-lg)", background: "var(--surface)", boxShadow: "var(--shadow-sm)" }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors"
        style={{ color: "var(--text)", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", fontWeight: 500, minHeight: "44px", background: "transparent" }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ color: "var(--accent)" }}>🔍</span>
          {label}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ color: "var(--muted)", fontSize: "0.75rem" }}
        >
          ▼
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-4 pb-4 space-y-4 border-t" style={{ borderColor: "rgba(100,116,139,0.12)" }}>
              {[
                { key: "reasoning.what_i_saw",       val: reasoning.what_i_saw },
                { key: "reasoning.why_this_matters", val: reasoning.why_this_matters },
                { key: "reasoning.what_would_change",val: reasoning.what_would_change_assessment },
              ].map(({ key, val }) => (
                <div key={key} className="pt-3">
                  <p className="font-semibold mb-1" style={{ color: "var(--text)", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)" }}>
                    {t(language, key)}
                  </p>
                  <p style={{ color: "var(--muted)", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", lineHeight: 1.6 }}>
                    {val}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
