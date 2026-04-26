import { useState } from "react";

const CONDITIONS = ["Type 2 Diabetes", "Hypertension", "Asthma", "Heart disease", "Thyroid disorder"];
const HISTORY_OPTIONS = ["Heart disease", "Cancer", "Diabetes", "Stroke", "Autoimmune disease"];

function TagInput({ values, onChange, placeholder }) {
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
        <button onClick={add} className="bg-gray-100 px-3 py-2 rounded-lg text-sm">Add</button>
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

export default function Profile({ profile, updateProfile, clearProfile }) {
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!profile) return null;

  return (
    <div className="space-y-5">
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
        🔒 This information is stored <strong>only on this device</strong> and is never uploaded to our servers.
        It is only included in an analysis request when you tap Analyze.
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Age</label>
          <input
            type="text"
            value={profile.age}
            onChange={(e) => updateProfile({ age: e.target.value })}
            placeholder="e.g. 45"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Biological Sex</label>
          <select
            value={profile.biologicalSex}
            onChange={(e) => updateProfile({ biologicalSex: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other / Prefer not to say</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Height
          </label>
          <input
            type="number"
            placeholder="Enter height in inches"
            value={profile.height}
            onChange={(e) => updateProfile({ age: height.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Weight
          </label>
          <input
            type="number"
            placeholder="Enter weight in pounds"
            value={profile.weight}
            onChange={(e) => updateProfile({ weight: height.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Known Conditions</label>
        <TagInput
          values={profile.knownConditions}
          onChange={(v) => updateProfile({ knownConditions: v })}
          placeholder="e.g. Type 2 Diabetes"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Current Medications</label>
        <TagInput
          values={profile.currentMedications}
          onChange={(v) => updateProfile({ currentMedications: v })}
          placeholder="e.g. Metformin 500mg"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Allergies</label>
        <TagInput
          values={profile.allergies}
          onChange={(v) => updateProfile({ allergies: v })}
          placeholder="e.g. Penicillin"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Family History</label>
        <TagInput
          values={profile.familyHistory}
          onChange={(v) => updateProfile({ familyHistory: v })}
          placeholder="e.g. Heart disease (father)"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Additional Notes</label>
        <textarea
          value={profile.notes}
          onChange={(e) => updateProfile({ notes: e.target.value })}
          placeholder="Anything else the AI should know (e.g. immune-compromised)"
          rows={3}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
        >
          {saved ? "✓ Saved" : "Save Profile"}
        </button>
        <button
          onClick={() => {
            if (confirm("Delete all profile data from this device?")) clearProfile();
          }}
          className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-3 px-4 rounded-xl text-sm transition"
        >
          Delete All Data
        </button>
      </div>

      <p className="text-xs text-gray-400 text-center">Saved to this browser only. Switching devices or clearing cookies removes this data.</p>
    </div>
  );
}
