import { motion } from "framer-motion";
import { t } from "../i18n";
import { itemVariants } from "../motion";

const SEVERITY_CONFIG = {
  green: {
    bg: "#dcfce7", border: "#16a34a", text: "#14532d",
    labelKey: "severity.green", icon: "✓", iconBg: "#16a34a", iconText: "#fff",
  },
  yellow: {
    bg: "#fefce8", border: "#ca8a04", text: "#713f12",
    labelKey: "severity.yellow", icon: "⚠", iconBg: "#ca8a04", iconText: "#fff",
  },
  red: {
    bg: "#fef2f2", border: "#dc2626", text: "#7f1d1d",
    labelKey: "severity.red", icon: "!", iconBg: "#dc2626", iconText: "#fff",
  },
  call_911: {
    bg: "#0f172a", border: "#0f172a", text: "#f8fafc",
    labelKey: "severity.call_911", icon: "🚨", iconBg: "transparent", iconText: "#f8fafc",
  },
};

export default function SeverityBadge({ language, severity, severityLabel }) {
  const config = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.yellow;
  const localizedLabel = t(language, config.labelKey);

  return (
    <motion.div
      variants={itemVariants}
      className="flex items-center gap-4 p-4 w-full"
      style={{
        background: config.bg,
        border: `1px solid ${config.border}`,
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold shrink-0"
        style={{ background: config.iconBg, color: config.iconText }}
      >
        {config.icon}
      </div>
      <div>
        <p className="font-semibold text-base leading-tight" style={{ color: config.text, fontFamily: "var(--font-body)" }}>
          {severityLabel || localizedLabel}
        </p>
        <p className="text-xs mt-0.5" style={{ color: config.text, opacity: 0.7, fontFamily: "var(--font-mono)" }}>
          {localizedLabel}
        </p>
      </div>
    </motion.div>
  );
}
