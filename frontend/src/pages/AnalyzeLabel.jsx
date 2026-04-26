import { useState } from "react";
import CameraCapture from "../components/CameraCapture";
import SeverityBadge from "../components/SeverityBadge";
import ReasoningAccordion from "../components/ReasoningAccordion";
import ChatWindow from "../components/ChatWindow";
import MicButton from "../components/MicButton";
import SpeakButton from "../components/SpeakButton";
import { analyzeLabel } from "../services/api";
import { t } from "../i18n";

function buildSpeechText(result) {
  const parts = [result.plain_explanation];
  if (result.recommendation_reasoning) parts.push(result.recommendation_reasoning);
  if (result.action_steps?.length) parts.push("Key information: " + result.action_steps.join(". "));
  if (result.warning_signs?.length) parts.push("Important warnings: " + result.warning_signs.join(". "));
  return parts.join(". ");
}

export default function AnalyzeLabel({ language, profile }) {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [medInput, setMedInput] = useState("");
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const hasInput = Boolean(image) || description.trim().length > 0;

  function addMed() {
    const m = medInput.trim();
    if (m && !medications.includes(m)) {
      setMedications([...medications, m]);
    }
    setMedInput("");
  }

  async function handleAnalyze() {
    if (!hasInput) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const allMeds = [
        ...medications,
        ...(profile?.currentMedications || []),
      ];
      const data = await analyzeLabel({
        image,
        description,
        medications: [...new Set(allMeds)],
        language,
        history: [],
        profile,
      });
      setResult(data);
    } catch {
      setError(t(language, "label.error"));
    } finally {
      setLoading(false);
    }
  }

  const chatHistory = result
    ? [
        {
          role: "user",
          content: description || t(language, "label.default_user_message"),
        },
        { role: "assistant", content: result.plain_explanation },
      ]
    : [];

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs text-gray-500 mb-2">
          {t(language, "label.photo_optional")}
        </p>
        <CameraCapture language={language} onCapture={setImage} />
      </div>


      <div className="relative">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ask about a medication or paste label text (e.g. 'What is amoxicillin used for?')..."
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        <MicButton
          onTranscript={(t) => setDescription((prev) => prev ? prev + " " + t : t)}
          lang={language}
          className="absolute bottom-2 right-2 w-8 h-8"
        />
      </div>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder={t(language, "label.placeholder")}
        rows={3}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />


      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">
          {t(language, "label.other_meds")}
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={medInput}
            onChange={(e) => setMedInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addMed()}
            placeholder={t(language, "label.med_placeholder")}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addMed}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm"
          >
            {t(language, "label.add")}
          </button>
        </div>
        {medications.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {medications.map((m) => (
              <span
                key={m}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1"
              >
                {m}
                <button
                  onClick={() => setMedications(medications.filter((x) => x !== m))}
                  className="text-blue-500 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleAnalyze}
        disabled={!hasInput || loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold disabled:opacity-40 transition"
      >
        {loading
          ? t(language, "label.decoding")
          : image
          ? t(language, "label.decode")
          : t(language, "label.ask")}
      </button>

      {error && <p className="text-red-600 text-sm text-center">{error}</p>}

      {result && (
        <div className="space-y-4">

          <div className="flex items-center justify-between gap-3">
            <SeverityBadge severity={result.severity} severityLabel={result.severity_label} />
            <SpeakButton text={buildSpeechText(result)} />
          </div>

          <SeverityBadge
            language={language}
            severity={result.severity}
            severityLabel={result.severity_label}
          />

          <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-700">
            <p>{result.plain_explanation}</p>
          </div>

          {result.action_steps?.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm">
              <p className="font-semibold text-gray-800 mb-2">{t(language, "label.key_information")}</p>
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
              <p className="font-semibold text-red-800 mb-2">{t(language, "label.warnings")}</p>
              <ul className="space-y-1">
                {result.warning_signs.map((sign, i) => (
                  <li key={i} className="text-red-700">• {sign}</li>
                ))}
              </ul>
            </div>
          )}

          <ReasoningAccordion
            language={language}
            reasoning={result.reasoning_transparency}
            severity={result.severity}
          />

          <div className="text-xs text-gray-400 text-center border-t border-gray-100 pt-3">
            {result.disclaimer}
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">{t(language, "label.followup_label")}</p>
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
