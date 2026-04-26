import { useVoiceInput } from "../hooks/useVoiceInput";

export default function MicButton({ onTranscript, lang = "en-US", className = "" }) {
  const { listening, startListening, stopListening, supported } = useVoiceInput(onTranscript);

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={() => listening ? stopListening() : startListening(lang)}
      title={listening ? "Stop listening" : "Speak your input"}
      className={`flex items-center justify-center rounded-full transition ${
        listening
          ? "bg-red-100 text-red-500 animate-pulse"
          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
      } ${className}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12v-2h-2z"/>
      </svg>
    </button>
  );
}
