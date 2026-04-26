export default function DoctorsNoteCard({ script, followupPrompt }) {
  if (!script && !followupPrompt) return null;

  return (
    <div className="space-y-3">
      {script && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-blue-800 mb-2">
            📋 What to say when you arrive:
          </p>
          <p className="text-sm text-blue-900 italic">"{script}"</p>
          <p className="text-xs text-blue-600 mt-2">
            You can read this directly to the clinician.
          </p>
        </div>
      )}

      {followupPrompt && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-amber-800 mb-2">
            🕐 Watch for in the next 24 hours:
          </p>
          <p className="text-sm text-amber-900">{followupPrompt}</p>
        </div>
      )}
    </div>
  );
}
