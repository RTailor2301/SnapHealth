import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnalyzeBody from "./pages/AnalyzeBody";
import AnalyzeLabel from "./pages/AnalyzeLabel";
import Profile from "./pages/Profile";
import { useProfile } from "./hooks/useProfile";
import { t } from "./i18n";
import { pageVariants, safeSpring } from "./motion";

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
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)", fontFamily: "var(--font-body)" }}>

      <header className="sticky top-0 z-20" style={{ background: "var(--surface)", boxShadow: "var(--shadow-sm)" }}>
        <div className="max-w-xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/snaphealthlogo.png"
              alt="SnapHealth logo"
              style={{ height: "40px", width: "auto", display: "block", flexShrink: 0 }}
            />
            <div>
              <h1 className="text-xl font-bold leading-tight tracking-tight" style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}>
                SnapHealth
              </h1>
              <p className="text-xs mt-0.5" style={{ color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                {t(language, "app.tagline")}
              </p>
            </div>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-sm px-3 py-2 border transition"
            style={{ borderRadius: "var(--radius-md)", borderColor: "var(--muted)", color: "var(--text)", background: "var(--surface)", fontFamily: "var(--font-body)", minHeight: "44px", outline: "none" }}
            onFocus={(e) => (e.target.style.boxShadow = "0 0 0 2px var(--accent)")}
            onBlur={(e) => (e.target.style.boxShadow = "none")}
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>

        <div className="mx-auto px-4 py-1.5 text-center border-t" style={{ background: "#f0fdf9", borderColor: "#99f6e4" }}>
          <p className="text-xs" style={{ color: "#065f46", fontFamily: "var(--font-mono)" }}>
            {t(language, "app.privacy_banner")}
          </p>
        </div>

        <div className="border-t" style={{ borderColor: "rgba(100,116,139,0.12)" }}>
          <div className="max-w-lg mx-auto flex">
            {TAB_IDS.map((id) => {
              const active = activeTab === id;
              return (
                <motion.button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 py-3 text-sm font-medium transition-colors border-b-2"
                  style={{ fontFamily: "var(--font-body)", borderBottomColor: active ? "var(--accent)" : "transparent", color: active ? "var(--accent)" : "var(--muted)", background: "transparent", minHeight: "44px" }}
                >
                  {t(language, `app.tab.${id}`)}
                </motion.button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto w-full px-4 py-6 flex-1">
        {!loaded ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
            <p style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}>{t(language, "app.loading")}</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} variants={pageVariants} initial="hidden" animate="visible">
              {activeTab === "body" ? (
                <AnalyzeBody language={language} profile={profile} />
              ) : activeTab === "label" ? (
                <AnalyzeLabel language={language} profile={profile} />
              ) : (
                <Profile language={language} profile={profile} updateProfile={updateProfile} clearProfile={clearProfile} />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      <footer className="py-4 px-4 text-center border-t" style={{ background: "var(--surface)", borderColor: "rgba(100,116,139,0.12)" }}>
        <p className="text-xs" style={{ color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
          {t(language, "app.footer")}
        </p>
      </footer>
    </div>
  );
}

export default App;
