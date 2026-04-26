import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({ baseURL: BASE_URL });

export async function analyzeBody({ image, description, language, history, profile }) {
  const { data } = await api.post("/analyze/body", {
    image,
    description,
    language,
    history,
    profile,
  });
  return data;
}

export async function analyzeLabel({ image, description, medications, language, history, profile }) {
  const { data } = await api.post("/analyze/label", {
    image,
    description,
    medications,
    language,
    history,
    profile,
  });
  return data;
}

export async function sendChat({ history, message, language, profile }) {
  const { data } = await api.post("/chat", {
    history,
    message,
    language,
    profile,
  });
  return data.response;
}
