import { useState } from "react";
import CameraCapture from "../components/CameraCapture";
import SeverityBadge from "../components/SeverityBadge";
import ReasoningAccordion from "../components/ReasoningAccordion";
import DoctorsNoteCard from "../components/DoctorsNoteCard";
import ChatWindow from "../components/ChatWindow";
import { analyzeBody } from "../services/api";

const CRISIS_KEYWORDS = ["hurt myself", "self harm", "cut myself", "suicide", "kill myself"];

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
      const data = await analyzeBody({
        image,
        description,
        language,
        history: [],
        profile,
      });
      setResult(data);
    } catch {
      setError("Unable to reach the analysis service. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  const chatHistory = result
    ? [
        {
          role: "user",
          content: description || "Please analyze this image",
        },
        {
          role: "assistant",
          content: result.plain_explanation,
        },
      ]
    : [];

  return (
    <div className="space-y-5">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
        <strong>AI Limitation:</strong> Skin analysis is less reliable on darker skin tones.
        If in doubt, always seek in-person evaluation regardless of the result shown.
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-2">
          Photo is optional — describe your symptoms below for a text-only analysis.
        </p>
        <CameraCapture onCapture={setImage} />
      </div>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe your symptoms (or ask a question)..."
        rows={3}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />

      {isCrisis && (
        <div className="bg-purple-50 border border-purple-300 rounded-xl p-4 text-sm text-purple-900">
          <p className="font-semibold mb-1">We're concerned about you.</p>
          <p>
            Please contact the{" "}
            <strong>988 Suicide & Crisis Lifeline</strong> — call or text{" "}
            <strong>988</strong>.
          </p>
        </div>
      )}

      {!isCrisis && (
        <button
          onClick={handleAnalyze}
          disabled={!hasInput || loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold disabled:opacity-40 transition"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      )}

      {error && (
        <p className="text-red-600 text-sm text-center">{error}</p>
      )}

      {isEmergency && (
        <div className="bg-black rounded-xl p-5 text-white text-center space-y-3">
          <p className="text-4xl">🚨</p>
          <p className="text-xl font-bold">Call 911 Now</p>
          <p className="text-sm opacity-80">{result.plain_explanation}</p>
          <a
            href="tel:911"
            className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold"
          >
            Tap to Call 911
          </a>
        </div>
      )}

      {result && !isEmergency && (
        <div className="space-y-4">
          <SeverityBadge severity={result.severity} severityLabel={result.severity_label} />

          <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-700">
            <p>{result.plain_explanation}</p>
          </div>

          {result.recommendation_reasoning && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm">
              <p className="font-semibold text-gray-800 mb-1">Recommendation:</p>
              <p className="text-gray-700">{result.recommendation_reasoning}</p>
            </div>
          )}

          {result.action_steps?.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm">
              <p className="font-semibold text-gray-800 mb-2">Action Steps:</p>
              <ul className="space-y-1">
                {result.action_steps.map((step, i) => (
                  <li key={i} className="flex gap-2 text-gray-700">
                    <span className="text-blue-500">→</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.warning_signs?.length > 0 && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm">
              <p className="font-semibold text-red-800 mb-2">⚠ Seek care immediately if:</p>
              <ul className="space-y-1">
                {result.warning_signs.map((sign, i) => (
                  <li key={i} className="flex gap-2 text-red-700">
                    <span>•</span>
                    <span>{sign}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <ReasoningAccordion
            reasoning={result.reasoning_transparency}
            severity={result.severity}
          />

          <DoctorsNoteCard
            script={result.what_to_say_when_you_arrive}
            followupPrompt={result.followup_prompt}
          />

          <div className="text-xs text-gray-400 text-center border-t border-gray-100 pt-3">
            {result.disclaimer}
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Ask a follow-up:</p>
            <ChatWindow
              initialHistory={chatHistory}
              language={language}
              profile={profile}
              disabled={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}
