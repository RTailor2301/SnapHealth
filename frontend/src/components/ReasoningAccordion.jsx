import { useState } from "react";
import { t } from "../i18n";

export default function ReasoningAccordion({ language, reasoning, severity }) {
  const [open, setOpen] = useState(false);

  if (!reasoning) return null;

  const label =
    severity === "green"
      ? t(language, "reasoning.why_green")
      : severity === "yellow"
      ? t(language, "reasoning.why_yellow")
      : severity === "red"
      ? t(language, "reasoning.why_red")
      : t(language, "reasoning.why_911");

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 text-left text-sm font-medium text-gray-700"
      >
        <span>🔍 {label}</span>
        <span className="text-gray-400">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="px-4 py-3 space-y-3 text-sm text-gray-700 bg-white">
          <div>
            <p className="font-semibold text-gray-900 mb-1">{t(language, "reasoning.what_i_saw")}</p>
            <p>{reasoning.what_i_saw}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-1">{t(language, "reasoning.why_this_matters")}</p>
            <p>{reasoning.why_this_matters}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-1">{t(language, "reasoning.what_would_change")}</p>
            <p>{reasoning.what_would_change_assessment}</p>
          </div>
        </div>
      )}
    </div>
  );
}
