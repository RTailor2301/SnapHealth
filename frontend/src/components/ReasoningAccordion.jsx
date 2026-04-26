import { useState } from "react";

export default function ReasoningAccordion({ reasoning, severity }) {
  const [open, setOpen] = useState(false);

  if (!reasoning) return null;

  const label =
    severity === "green"
      ? "Why is this green?"
      : severity === "yellow"
      ? "Why is this yellow?"
      : severity === "red"
      ? "Why is this red?"
      : "Why 911?";

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
            <p className="font-semibold text-gray-900 mb-1">What I saw:</p>
            <p>{reasoning.what_i_saw}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-1">Why this matters:</p>
            <p>{reasoning.why_this_matters}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-1">What would change this assessment:</p>
            <p>{reasoning.what_would_change_assessment}</p>
          </div>
        </div>
      )}
    </div>
  );
}
