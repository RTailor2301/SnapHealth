import { useState } from "react";
import AnalyzeBody from "./pages/AnalyzeBody";
import AnalyzeLabel from "./pages/AnalyzeLabel";
import Profile from "./pages/Profile";
import { useProfile } from "./hooks/useProfile";
import { t } from "./i18n";

const TAB_IDS = ["body", "label", "profile"];

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
            <p className="text-xs text-gray-400">{t(language, "app.tagline")}</p>
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
            {t(language, "app.privacy_banner")}
          </p>
        </div>
      </header>

      <div className="bg-white border-b border-gray-200 sticky top-[73px] z-10">
        <div className="max-w-lg mx-auto flex">
          {TAB_IDS.map((id) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 py-3 text-sm font-medium transition border-b-2 ${
                activeTab === id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t(language, `app.tab.${id}`)}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-lg mx-auto w-full px-4 py-5 flex-1">
        {!loaded ? (
          <div className="text-center text-gray-400 py-10">{t(language, "app.loading")}</div>
        ) : activeTab === "body" ? (
          <AnalyzeBody language={language} profile={profile} />
        ) : activeTab === "label" ? (
          <AnalyzeLabel language={language} profile={profile} />
        ) : (
          <Profile
            language={language}
            profile={profile}
            updateProfile={updateProfile}
            clearProfile={clearProfile}
          />
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-3 px-4 text-center">
        <p className="text-xs text-gray-400">
          {t(language, "app.footer")}
        </p>
      </footer>
    </div>
  );
}

export default App;
