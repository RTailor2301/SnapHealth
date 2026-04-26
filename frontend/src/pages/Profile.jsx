import { useState } from "react";
import { t } from "../i18n";

function TagInput({ language, values, onChange, placeholder }) {
  const [input, setInput] = useState("");

  function add() {
    const v = input.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setInput("");
  }

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder={placeholder}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={add} className="bg-gray-100 px-3 py-2 rounded-lg text-sm">
          {t(language, "profile.add")}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {values.map((v) => (
          <span key={v} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
            {v}
            <button onClick={() => onChange(values.filter((x) => x !== v))}>×</button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Profile({ language, profile, updateProfile, clearProfile }) {
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!profile) return null;

  return (
    <div className="space-y-5">
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
        {t(language, "profile.privacy_banner_pre")}
        <strong>{t(language, "profile.privacy_banner_strong")}</strong>
        {t(language, "profile.privacy_banner_post")}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">{t(language, "profile.age")}</label>
          <input
            type="text"
            value={profile.age}
            onChange={(e) => updateProfile({ age: e.target.value })}
            placeholder={t(language, "profile.age_placeholder")}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">{t(language, "profile.biological_sex")}</label>
          <select
            value={profile.biologicalSex}
            onChange={(e) => updateProfile({ biologicalSex: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t(language, "profile.select")}</option>
            <option value="male">{t(language, "profile.male")}</option>
            <option value="female">{t(language, "profile.female")}</option>
            <option value="other">{t(language, "profile.other")}</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            {t(language, "profile.height")}
          </label>
          <input
            type="number"
            placeholder={t(language, "profile.height_placeholder")}
            value={profile.height}
            onChange={(e) => updateProfile({ height: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            {t(language, "profile.weight")}
          </label>
          <input
            type="number"
            placeholder={t(language, "profile.weight_placeholder")}
            value={profile.weight}
            onChange={(e) => updateProfile({ weight: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">{t(language, "profile.known_conditions")}</label>
        <TagInput
          language={language}
          values={profile.knownConditions}
          onChange={(v) => updateProfile({ knownConditions: v })}
          placeholder={t(language, "profile.known_conditions_placeholder")}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">{t(language, "profile.current_medications")}</label>
        <TagInput
          language={language}
          values={profile.currentMedications}
          onChange={(v) => updateProfile({ currentMedications: v })}
          placeholder={t(language, "profile.current_medications_placeholder")}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">{t(language, "profile.allergies")}</label>
        <TagInput
          language={language}
          values={profile.allergies}
          onChange={(v) => updateProfile({ allergies: v })}
          placeholder={t(language, "profile.allergies_placeholder")}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">{t(language, "profile.family_history")}</label>
        <TagInput
          language={language}
          values={profile.familyHistory}
          onChange={(v) => updateProfile({ familyHistory: v })}
          placeholder={t(language, "profile.family_history_placeholder")}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">{t(language, "profile.notes")}</label>
        <textarea
          value={profile.notes}
          onChange={(e) => updateProfile({ notes: e.target.value })}
          placeholder={t(language, "profile.notes_placeholder")}
          rows={3}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
        >
          {saved ? t(language, "profile.saved") : t(language, "profile.save")}
        </button>
        <button
          onClick={() => {
            if (confirm(t(language, "profile.confirm_delete"))) clearProfile();
          }}
          className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-3 px-4 rounded-xl text-sm transition"
        >
          {t(language, "profile.delete_all")}
        </button>
      </div>

      <p className="text-xs text-gray-400 text-center">{t(language, "profile.local_only_footer")}</p>
    </div>
  );
}
