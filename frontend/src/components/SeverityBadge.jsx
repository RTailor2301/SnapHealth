const SEVERITY_CONFIG = {
  green: {
    bg: "bg-green-500",
    text: "text-white",
    label: "Treat at Home",
    icon: "✓",
  },
  yellow: {
    bg: "bg-yellow-400",
    text: "text-gray-900",
    label: "Urgent Care Within 24 hrs",
    icon: "⚠",
  },
  red: {
    bg: "bg-red-600",
    text: "text-white",
    label: "Emergency Room — Go Now",
    icon: "!",
  },
  call_911: {
    bg: "bg-gray-900",
    text: "text-white",
    label: "Call 911 Immediately",
    icon: "🚨",
  },
};

export default function SeverityBadge({ severity, severityLabel }) {
  const config = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.yellow;

  return (
    <div className={`rounded-xl px-5 py-4 ${config.bg} ${config.text} text-center`}>
      <div className="text-3xl mb-1">{config.icon}</div>
      <div className="text-xl font-bold">{severityLabel || config.label}</div>
      <div className="text-sm opacity-80 mt-1">{config.label}</div>
    </div>
  );
}
