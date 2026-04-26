import { useState, useRef, useEffect } from "react";

export function useVoiceInput(onTranscript) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const callbackRef = useRef(onTranscript);

  useEffect(() => { callbackRef.current = onTranscript; }, [onTranscript]);

  const supported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  function startListening(lang = "en-US") {
    if (!supported || listening) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = lang;
    rec.onresult = (e) => callbackRef.current(e.results[0][0].transcript);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
    setListening(true);
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  return { listening, startListening, stopListening, supported };
}
