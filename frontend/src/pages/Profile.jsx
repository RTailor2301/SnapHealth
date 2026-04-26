import { useState } from "react";
import { motion } from "framer-motion";
import { t } from "../i18n";
import { containerVariants, itemVariants, safeSpring } from "../motion";

const inputStyle = {
  border: "1px solid rgba(100,116,139,0.3)",
  borderRadius: "var(--radius-md)",
  color: "var(--text)",
  background: "var(--surface)",
  fontFamily: "var(--font-body)",
  fontSize: "var(--text-sm)",
  padding: "10px 12px",
  width: "100%",
  outline: "none",
  minHeight: "44px",
  boxSizing: "border-box",
};

const labelStyle = {
  display: "block",
  color: "var(--muted)",
  fontFamily: "var(--font-mono)",
  fontSize: "var(--text-xs)",
  fontWeight: 500,
  marginBottom: "6px",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

function TagInput({ language, values, onChange, placeholder }) {
  const [input, setInput] = useState("");

  function add() {
    const v = input.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setInput("");
  }

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder={placeholder}
          style={{ ...inputStyle, flex: 1 }}
          onFocus={(e) => (e.target.style.boxShadow = "0 0 0 2px var(--accent)")}
          onBlur={(e) => (e.target.style.boxShadow = "none")}
        />
        <button
          onClick={add}
          style={{
            background: "rgba(17,94,89,0.08)",
            color: "var(--accent)",
            border: "1px solid rgba(17,94,89,0.2)",
            borderRadius: "var(--radius-md)",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-sm)",
            fontWeight: 500,
            padding: "0 16px",
            cursor: "pointer",
            minHeight: "44px",
          }}
        >
          {t(language, "profile.add")}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {values.map((v) => (
          <span
            key={v}
            className="flex items-center gap-1 px-3 py-1 text-xs font-medium"
            style={{ background: "rgba(17,94,89,0.08)", color: "var(--accent)", border: "1px solid rgba(17,94,89,0.2)", borderRadius: "var(--radius-full)" }}
          >
            {v}
            <button
              onClick={() => onChange(values.filter((x) => x !== v))}
              style={{ color: "var(--accent)", background: "transparent", border: "none", cursor: "pointer", lineHeight: 1, fontSize: "1rem" }}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Profile({ language, profile, updateProfile, clearProfile }) {
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!profile) return null;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">

      <motion.div variants={itemVariants} className="p-3" style={{ background: "#f0fdf9", border: "1px solid #99f6e4", borderLeft: "3px solid var(--accent)", borderRadius: "var(--radius-lg)" }}>
        <p style={{ color: "#065f46", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", lineHeight: 1.6 }}>
          {t(language, "profile.privacy_banner_pre")}
          <strong>{t(language, "profile.privacy_banner_optional")}</strong>
          {t(language, "profile.privacy_banner_mid")}
          <strong>{t(language, "profile.privacy_banner_strong")}</strong>
          {t(language, "profile.privacy_banner_post")}
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}>{t(language, "profile.age")}</label>
          <input
            type="text"
            value={profile.age}
            onChange={(e) => updateProfile({ age: e.target.value })}
            placeholder={t(language, "profile.age_placeholder")}
            style={inputStyle}
            onFocus={(e) => (e.target.style.boxShadow = "0 0 0 2px var(--accent)")}
            onBlur={(e) => (e.target.style.boxShadow = "none")}
          />
        </div>
        <div>
          <label style={labelStyle}>{t(language, "profile.biological_sex")}</label>
          <select
            value={profile.biologicalSex}
            onChange={(e) => updateProfile({ biologicalSex: e.target.value })}
            style={inputStyle}
            onFocus={(e) => (e.target.style.boxShadow = "0 0 0 2px var(--accent)")}
            onBlur={(e) => (e.target.style.boxShadow = "none")}
          >
            <option value="">{t(language, "profile.select")}</option>
            <option value="male">{t(language, "profile.male")}</option>
            <option value="female">{t(language, "profile.female")}</option>
            <option value="other">{t(language, "profile.other")}</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>{t(language, "profile.height")}</label>
          <input
            type="number"
            placeholder={t(language, "profile.height_placeholder")}
            value={profile.height}
            onChange={(e) => updateProfile({ height: e.target.value })}
            style={inputStyle}
            onFocus={(e) => (e.target.style.boxShadow = "0 0 0 2px var(--accent)")}
            onBlur={(e) => (e.target.style.boxShadow = "none")}
          />
        </div>
        <div>
          <label style={labelStyle}>{t(language, "profile.weight")}</label>
          <input
            type="number"
            placeholder={t(language, "profile.weight_placeholder")}
            value={profile.weight}
            onChange={(e) => updateProfile({ weight: e.target.value })}
            style={inputStyle}
            onFocus={(e) => (e.target.style.boxShadow = "0 0 0 2px var(--accent)")}
            onBlur={(e) => (e.target.style.boxShadow = "none")}
          />
        </div>
      </motion.div>

      {[
        { labelKey: "profile.known_conditions", field: "knownConditions", placeholderKey: "profile.known_conditions_placeholder" },
        { labelKey: "profile.current_medications", field: "currentMedications", placeholderKey: "profile.current_medications_placeholder" },
        { labelKey: "profile.allergies", field: "allergies", placeholderKey: "profile.allergies_placeholder" },
        { labelKey: "profile.family_history", field: "familyHistory", placeholderKey: "profile.family_history_placeholder" },
      ].map(({ labelKey, field, placeholderKey }) => (
        <motion.div key={field} variants={itemVariants}>
          <label style={labelStyle}>{t(language, labelKey)}</label>
          <TagInput
            language={language}
            values={profile[field]}
            onChange={(v) => updateProfile({ [field]: v })}
            placeholder={t(language, placeholderKey)}
          />
        </motion.div>
      ))}

      <motion.div variants={itemVariants}>
        <label style={labelStyle}>{t(language, "profile.notes")}</label>
        <textarea
          value={profile.notes}
          onChange={(e) => updateProfile({ notes: e.target.value })}
          placeholder={t(language, "profile.notes_placeholder")}
          rows={3}
          style={{ ...inputStyle, lineHeight: 1.6, resize: "none" }}
          onFocus={(e) => (e.target.style.boxShadow = "0 0 0 2px var(--accent)")}
          onBlur={(e) => (e.target.style.boxShadow = "none")}
        />
      </motion.div>

      <motion.div variants={itemVariants} className="flex gap-3">
        <motion.button
          onClick={handleSave}
          whileHover={{ boxShadow: "var(--shadow-accent)", scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          transition={safeSpring}
          className="flex-1 font-semibold text-white"
          style={{ background: "var(--accent)", borderRadius: "var(--radius-md)", padding: "14px 0", fontFamily: "var(--font-body)", fontSize: "var(--text-base)", border: "none", cursor: "pointer", minHeight: "44px" }}
        >
          {saved ? t(language, "profile.saved") : t(language, "profile.save")}
        </motion.button>
        <motion.button
          onClick={() => { if (confirm(t(language, "profile.confirm_delete"))) clearProfile(); }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          transition={safeSpring}
          style={{ background: "transparent", color: "#dc2626", border: "1px solid rgba(220,38,38,0.3)", borderRadius: "var(--radius-md)", padding: "14px 16px", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", cursor: "pointer", minHeight: "44px" }}
        >
          {t(language, "profile.delete_all")}
        </motion.button>
      </motion.div>

      <motion.div variants={itemVariants} className="text-center pb-2">
        <p style={{ color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)" }}>
          {t(language, "profile.local_only_footer")}
        </p>
      </motion.div>
    </motion.div>
  );
}
