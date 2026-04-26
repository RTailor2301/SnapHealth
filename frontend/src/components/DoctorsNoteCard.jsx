import { motion } from "framer-motion";
import { t } from "../i18n";
import { itemVariants } from "../motion";

export default function DoctorsNoteCard({ language, script, followupPrompt }) {
  if (!script && !followupPrompt) return null;

  return (
    <div className="space-y-3">
      {script && (
        <motion.div
          variants={itemVariants}
          className="p-4"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--accent)",
            borderLeft: "3px solid var(--accent)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <p className="font-semibold mb-2" style={{ color: "var(--accent)", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)" }}>
            {t(language, "doctors_note.script_title")}
          </p>
          <p className="italic" style={{ color: "var(--text)", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", lineHeight: 1.6 }}>
            "{script}"
          </p>
          <p className="mt-2" style={{ color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)" }}>
            {t(language, "doctors_note.script_hint")}
          </p>
        </motion.div>
      )}

      {followupPrompt && (
        <motion.div
          variants={itemVariants}
          className="p-4"
          style={{
            background: "var(--surface)",
            border: "1px solid rgba(202,138,4,0.4)",
            borderLeft: "3px solid #ca8a04",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <p className="font-semibold mb-2" style={{ color: "#92400e", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)" }}>
            {t(language, "doctors_note.followup_title")}
          </p>
          <p style={{ color: "var(--text)", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", lineHeight: 1.6 }}>
            {followupPrompt}
          </p>
        </motion.div>
      )}
    </div>
  );
}
