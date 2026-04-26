import { useRef, useState } from "react";
import Webcam from "react-webcam";

function resizeBase64(dataUrl, maxWidth = 800) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = img.width > maxWidth ? maxWidth / img.width : 1;
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      // Strip the data:image/jpeg;base64, prefix
      const base64 = canvas.toDataURL("image/jpeg", 0.85).split(",")[1];
      resolve(base64);
    };
    img.src = dataUrl;
  });
}

export default function CameraCapture({ onCapture }) {
  const webcamRef = useRef(null);
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [mode, setMode] = useState("camera"); // "camera" | "file"

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

    // Convert HEIC/any format to JPEG via canvas
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
        <button
          onClick={() => setMode("camera")}
          className={`flex-1 py-2 text-sm rounded-lg border transition ${
            mode === "camera"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-600 border-gray-200"
          }`}
        >
          📷 Camera
        </button>
        <button
          onClick={() => setMode("file")}
          className={`flex-1 py-2 text-sm rounded-lg border transition ${
            mode === "file"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-600 border-gray-200"
          }`}
        >
          🖼 Upload Photo
        </button>
      </div>

      {mode === "camera" && (
        <div className="space-y-2">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full rounded-xl"
            videoConstraints={{ facingMode: "environment" }}
          />
          <button
            onClick={handleWebcamCapture}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition"
          >
            📸 Capture
          </button>
        </div>
      )}

      {mode === "file" && (
        <div>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={fileRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-300 rounded-xl py-8 text-gray-500 hover:border-blue-400 hover:text-blue-500 transition text-sm"
          >
            Tap to choose or take a photo
          </button>
        </div>
      )}

      {preview && (
        <div>
          <p className="text-xs text-gray-500 mb-1">Preview:</p>
          <img src={preview} alt="Captured" className="w-full rounded-xl max-h-48 object-cover" />
        </div>
      )}
    </div>
  );
}
