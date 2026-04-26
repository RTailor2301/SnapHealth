import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Webcam from "react-webcam";
import { t } from "../i18n";
import { safeSpring } from "../motion";

function resizeBase64(dataUrl, maxWidth = 800) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = img.width > maxWidth ? maxWidth / img.width : 1;
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      const base64 = canvas.toDataURL("image/jpeg", 0.85).split(",")[1];
      resolve(base64);
    };
    img.src = dataUrl;
  });
}

const tabStyle = (active) => ({
  flex: 1,
  padding: "10px 0",
  fontSize: "var(--text-sm)",
  fontFamily: "var(--font-body)",
  fontWeight: 500,
  border: "1px solid",
  borderColor: active ? "var(--accent)" : "rgba(100,116,139,0.3)",
  borderRadius: "var(--radius-md)",
  background: active ? "var(--accent)" : "var(--surface)",
  color: active ? "#fff" : "var(--muted)",
  cursor: "pointer",
  minHeight: "44px",
  transition: "all 0.15s ease",
});

export default function CameraCapture({ language, onCapture }) {
  const webcamRef = useRef(null);
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [mode, setMode] = useState("camera");

  async function handleWebcamCapture() {
    const screenshot = webcamRef.current?.getScreenshot();
    if (!screenshot) return;
    const base64 = await resizeBase64(screenshot);
    setPreview(screenshot);
    onCapture(base64);
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = async () => {
      const canvas = document.createElement("canvas");
      const scale = img.width > 800 ? 800 / img.width : 1;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      const base64 = dataUrl.split(",")[1];
      setPreview(dataUrl);
      onCapture(base64);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button onClick={() => setMode("camera")} style={tabStyle(mode === "camera")}>
          {t(language, "camera.tab_camera")}
        </button>
        <button onClick={() => setMode("file")} style={tabStyle(mode === "file")}>
          {t(language, "camera.tab_file")}
        </button>
      </div>

      {mode === "camera" && (
        <div className="space-y-2">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full"
            style={{ borderRadius: "var(--radius-lg)" }}
            videoConstraints={{ facingMode: "environment" }}
          />
          <motion.button
            onClick={handleWebcamCapture}
            whileHover={{ boxShadow: "var(--shadow-accent)", scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={safeSpring}
            className="w-full font-medium text-white"
            style={{ background: "var(--accent)", borderRadius: "var(--radius-md)", padding: "12px 0", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", minHeight: "44px", border: "none", cursor: "pointer" }}
          >
            {t(language, "camera.capture")}
          </motion.button>
        </div>
      )}

      {mode === "file" && (
        <div>
          <input type="file" accept="image/*" ref={fileRef} onChange={handleFileChange} className="hidden" />
          <motion.button
            onClick={() => fileRef.current?.click()}
            whileHover={{ borderColor: "var(--accent)", color: "var(--accent)" }}
            transition={safeSpring}
            className="w-full border-2 border-dashed py-8 text-sm transition-colors"
            style={{ borderColor: "rgba(100,116,139,0.4)", color: "var(--muted)", borderRadius: "var(--radius-lg)", fontFamily: "var(--font-body)", background: "transparent", cursor: "pointer", minHeight: "44px" }}
          >
            {t(language, "camera.tap_to_choose")}
          </motion.button>
        </div>
      )}

      {preview && (
        <div>
          <p className="text-xs mb-1" style={{ color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
            {t(language, "camera.preview")}
          </p>
          <img src={preview} alt="Captured preview" className="w-full object-cover" style={{ borderRadius: "var(--radius-lg)", maxHeight: "12rem" }} />
        </div>
      )}
    </div>
  );
}
