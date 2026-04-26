import { useState } from "react";
import AnalyzeBody from "./pages/AnalyzeBody";
import AnalyzeLabel from "./pages/AnalyzeLabel";
import Profile from "./pages/Profile";
import { useProfile } from "./hooks/useProfile";

const TABS = [
  { id: "body", label: "🩺 Symptom" },
  { id: "label", label: "💊 Med Label" },
  { id: "profile", label: "👤 Profile" },
];

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
];

function App() {
  const [activeTab, setActiveTab] = useState("body");
  const [language, setLanguage] = useState("en");
  const { profile, updateProfile, clearProfile, loaded } = useProfile();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-blue-700 leading-tight">SnapHealth</h1>
            <p className="text-xs text-gray-400">Health literacy &amp; triage</p>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>
        <div className="bg-green-50 border-t border-green-100 px-4 py-1 text-center">
          <p className="text-xs text-green-700">
            🔒 Your photos are <strong>never saved</strong>. Everything is deleted when you close this session.
          </p>
        </div>
      </header>

      <div className="bg-white border-b border-gray-200 sticky top-[73px] z-10">
        <div className="max-w-lg mx-auto flex">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-sm font-medium transition border-b-2 ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-lg mx-auto w-full px-4 py-5 flex-1">
        {!loaded ? (
          <div className="text-center text-gray-400 py-10">Loading...</div>
        ) : activeTab === "body" ? (
          <AnalyzeBody language={language} profile={profile} />
        ) : activeTab === "label" ? (
          <AnalyzeLabel language={language} profile={profile} />
        ) : (
          <Profile profile={profile} updateProfile={updateProfile} clearProfile={clearProfile} />
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-3 px-4 text-center">
        <p className="text-xs text-gray-400">
          This is not medical advice. Always consult a healthcare professional for diagnosis and treatment.
        </p>
      </footer>
    </div>
  );
}

export default App;
