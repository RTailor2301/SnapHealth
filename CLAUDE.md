# Project Overview
SnapHealth is a mobile-first, AI-powered health literacy and triage tool built for a 10-hour hackathon. It analyzes images of wounds/symptoms and decodes medication labels, acting as the "first informed voice in the room". It is strictly a triage tool, not a diagnostic medical device.

## Tech Stack & Environment
* **Frontend:** React 18, Vite, Tailwind CSS v3. State is managed locally, and the camera is handled via `react-webcam`.
* **Backend:** FastAPI (Python 3), Pydantic v2, uvicorn.
* **AI Model:** Anthropic SDK using `claude-sonnet-4-5` with Vision capabilities.
* **Storage:** Zero server-side persistence. Profile data is strictly stored on-device via `localStorage`. 

## Design & UI Constraints (Ada Health Inspired)
The UI must feel clinical, trustworthy, highly accessible, and calming—taking heavy inspiration from "Ada - check your health" (`ada.com/symptom-assessment-ai/`). Use generous whitespace, highly readable typography (open letter spacing, generous line height), and a soothing color palette (e.g., deep teals, mint greens, soft blues, warm off-whites, and high-contrast dark text).

**STRICT NEGATIVE CONSTRAINTS:**
* **NEVER** use: Inter, Roboto, Space Grotesk, Arial, or system fonts. (Instead, default to high-quality, readable custom web fonts like DM Sans, Lexend, or Poppins).
* **NEVER** use: purple-to-blue gradients on white backgrounds.
* **NEVER** use: ShadCN default component styling without heavy customization.
* **NEVER** use: `rounded-xl` cards on `gray-50` backgrounds as the primary layout pattern.

## Project Architecture
* `backend/services/claude.py`: Contains all Claude API calls and the highly critical system prompt.
* `backend/utils/bias_fallback.py`: Houses the `BIAS_SAFE_FALLBACK` dictionary for graceful error handling.
* `backend/services/parser.py`: Responsible for stripping markdown fences and extracting JSON from Claude's outputs.
* `frontend/src/components/CameraCapture.jsx`: Handles all client-side image capture, resizing, and format conversion.
* `frontend/src/hooks/useProfile.js`: Custom hook managing the `localStorage` health profile.
* `frontend/src/services/api.js`: Axios API layer connecting the React frontend to the FastAPI backend.

## Coding Standards & Patterns
Please adhere to the following strict patterns when writing or modifying code for this project:

1.  **Fail Safe on AI Errors:** Wrap all Claude API calls and JSON parsing in `try/except` blocks. On any failure, silently degrade and return the `BIAS_SAFE_FALLBACK` object, ensuring the user always receives a safe "yellow" (urgent care) response.
2.  **Stateless Chat History:** The backend stores nothing. The full conversation history array must be sent from the frontend on every chat request. Trim the history server-side if it grows too large, but **always** preserve `message[0]` (the initial image context).
3.  **Optional Profile Context:** Profile data is entirely optional. Default all fields to empty strings or arrays (`""` or `[]`). Only inject the profile context into the Claude system prompt text block if the user has provided non-empty fields.
4.  **Strict Client-Side Image Processing:** To optimize payload size and avoid API timeouts, images must be resized to a maximum width of 800px on the client. Convert iOS HEIC formats to JPEG via an HTML canvas, and strictly strip the `data:image/jpeg;base64,` prefix before POSTing to the backend.
5.  **Severity-Driven UI:** The application's UI state is strictly driven by the `severity` string returned in the JSON (`green`, `yellow`, `red`, `call_911`). If the severity is `call_911`, the normal interface must lock and display a hard-coded emergency override screen.
6.  **Medical & Legal Compliance:** **Never** write code or prompts that use the word "diagnose" or claim to provide medical advice. Always frame outputs with "may be consistent with". Ensure disclaimers remain prominently visible in the UI at all times.

## Key Commands
**Frontend:**
* Install dependencies: `npm install`
* Start dev server: `npm run dev`

**Backend:**
* Install dependencies: `pip install -r requirements.txt`
* Start dev server: `uvicorn main:app --reload`