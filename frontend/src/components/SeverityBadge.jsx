import { t } from "../i18n";

const SEVERITY_CONFIG = {
  green: { bg: "bg-green-500", text: "text-white", labelKey: "severity.green", icon: "✓" },
  yellow: { bg: "bg-yellow-400", text: "text-gray-900", labelKey: "severity.yellow", icon: "⚠" },
  red: { bg: "bg-red-600", text: "text-white", labelKey: "severity.red", icon: "!" },
  call_911: { bg: "bg-gray-900", text: "text-white", labelKey: "severity.call_911", icon: "🚨" },
};

export default function SeverityBadge({ language, severity, severityLabel }) {
  const config = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.yellow;
  const localizedLabel = t(language, config.labelKey);

  return (
    <div className={`rounded-xl px-5 py-4 ${config.bg} ${config.text} text-center`}>
      <div className="text-3xl mb-1">{config.icon}</div>
      <div className="text-xl font-bold">{severityLabel || localizedLabel}</div>
      <div className="text-sm opacity-80 mt-1">{localizedLabel}</div>
    </div>
  );
}
