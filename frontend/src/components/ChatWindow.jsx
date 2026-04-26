import { useState, useEffect, useRef } from "react";
import { sendChat } from "../services/api";
import MicButton from "./MicButton";
import SpeakButton from "./SpeakButton";

export default function ChatWindow({ initialHistory, language, profile, disabled }) {
  const [messages, setMessages] = useState(initialHistory || []);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading || disabled) return;

    const userMsg = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const response = await sendChat({
        history: updated,
        message: text,
        language,
        profile,
      });
      setMessages([...updated, { role: "assistant", content: response }]);
    } catch {
      setMessages([
        ...updated,
        {
          role: "assistant",
          content: "I'm having trouble responding right now. If this is urgent, please seek care or call 911.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden flex flex-col h-72">
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`text-sm rounded-lg px-3 py-2 max-w-xs ${
              m.role === "user"
                ? "ml-auto bg-blue-600 text-white"
                : "mr-auto bg-white border border-gray-200 text-gray-800"
            }`}
          >
            {m.content}
            {m.role === "assistant" && (
              <div className="mt-1">
                <SpeakButton text={m.content} />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="mr-auto bg-white border border-gray-200 text-gray-400 text-sm rounded-lg px-3 py-2 animate-pulse">
            Thinking...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center gap-2 px-3 py-2 bg-white border-t border-gray-200">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={disabled ? "Emergency — call 911 now" : "Ask a follow-up question..."}
          disabled={disabled}
          className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
        <MicButton
          onTranscript={(t) => setInput(t)}
          className="w-8 h-8 shrink-0"
        />
        <button
          onClick={handleSend}
          disabled={loading || disabled || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded-lg disabled:opacity-40 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
