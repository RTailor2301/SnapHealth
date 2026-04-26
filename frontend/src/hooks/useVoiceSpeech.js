import { useState, useEffect, useRef } from "react";

function pickVoice() {
  const voices = window.speechSynthesis.getVoices();
  // Prefer high-quality named US English voices first
  const preferred = [
    "Google US English",
    "Microsoft Aria Online (Natural) - English (United States)",
    "Microsoft Guy Online (Natural) - English (United States)",
    "Samantha",          // macOS/iOS built-in
    "Alex",              // macOS
  ];
  for (const name of preferred) {
    const match = voices.find((v) => v.name === name);
    if (match) return match;
  }
  // Fall back to any en-US voice, then any en voice
  return (
    voices.find((v) => v.lang === "en-US") ||
    voices.find((v) => v.lang.startsWith("en")) ||
    null
  );
}

export function useVoiceSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const voicesReady = useRef(false);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    if (!supported) return;
    // Voices load asynchronously on first use
    const onVoicesChanged = () => { voicesReady.current = true; };
    window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);
    // Trigger load
    window.speechSynthesis.getVoices();
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
      window.speechSynthesis.cancel();
    };
  }, [supported]);

  function speak(text) {
    if (!supported || !text) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const voice = pickVoice();
    if (voice) u.voice = voice;
    u.lang = "en-US";
    u.rate = 0.95;   // slightly slower than default for clarity
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  }

  function stop() {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }

  return { speak, stop, speaking, supported };
}
