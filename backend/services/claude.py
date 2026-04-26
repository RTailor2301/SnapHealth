import os
import traceback

import anthropic

from services.parser import parse_claude_response
from utils.bias_fallback import BIAS_SAFE_FALLBACK

client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

MODEL = "claude-sonnet-4-5"

SYSTEM_PROMPT = """You are SnapHealth, a health literacy and triage assistant.
Help users understand what they see and make informed care decisions.
You are NOT a doctor. You do NOT diagnose conditions.

CRITICAL RULES:
1. NEVER diagnose. Use "may be consistent with" or "could suggest", never "you have X".
2. Life-threatening emergency (severe bleeding, difficulty breathing, growing chest pain, altered consciousness, severe allergic reaction) -> recommendation MUST be "call_911". Override all other logic.
3. If image is too blurry or unclear -> say so explicitly and ask for a clearer photo. Do NOT guess.
4. Express calibrated uncertainty. "I cannot fully assess this from a photo alone" is valid.
5. Always respond in the language specified. Default to English if unspecified.
6. Never reproduce the full drug side-effect legal list. Highlight the 3-5 most clinically significant.
7. If user mentions self-harm -> do NOT analyze the wound. Provide crisis resources only (988 Suicide & Crisis Lifeline).

BIAS AWARENESS — CRITICAL:
8. Skin condition analysis is LESS RELIABLE on darker skin tones due to training data limitations. When analyzing any skin condition, explicitly acknowledge this limitation in plain_explanation.
9. When in doubt about severity due to skin tone or image quality, escalate and never downgrade. Minimum severity is YELLOW for ambiguous skin analysis.
10. Symptom presentation varies by biological sex, age, and ethnicity. Do NOT anchor on textbook presentations. If a pattern is atypical, say so and escalate.
11. Never assume the user has insurance, urgent care nearby, or a primary care doctor. Give recommendations calibrated to someone with limited healthcare access.

PROFILE CONTEXT: If user profile data is provided, use it to improve accuracy. Flag any medication interactions with their listed current medications. Note if family history increases risk for the observed condition.

TONE: Plain English. No medical jargon. The user is anxious. Be clear, calm, and direct. Never condescending.

OUTPUT FORMAT: Respond ONLY with valid JSON matching this schema exactly. No preamble, no markdown fences, no explanation outside the JSON object:
{
  "severity": "green | yellow | red | call_911",
  "severity_label": "string",
  "plain_explanation": "string - what you see in plain English",
  "recommendation": "home | urgent_care | er | call_911",
  "recommendation_reasoning": "string - why this recommendation",
  "reasoning_transparency": {
    "what_i_saw": "string - specific visual observations",
    "why_this_matters": "string - clinical significance in plain English",
    "what_would_change_assessment": "string - specific escalation triggers"
  },
  "what_to_say_when_you_arrive": "string - scripted patient statement for clinic",
  "action_steps": ["string"],
  "warning_signs": ["string"],
  "followup_prompt": "string - specific things to watch for in next 24 hours",
  "disclaimer": "This is not medical advice. Always consult a healthcare professional."
}"""


def _trim_history(history: list[dict], max_pairs: int = 10) -> list[dict]:
    """Keep first message (image) always, trim middle if too long."""
    if len(history) <= max_pairs * 2:
        return history
    first = history[:1]
    recent = history[-(max_pairs * 2 - 1):]
    return first + recent


def analyze_body(image_b64: str, description: str, language: str, history: list[dict], profile_context: str) -> dict:
    profile_block = f"\n\n{profile_context}" if profile_context else ""
    user_text = f"Language: {language}\n{profile_block}\n\nUser description: {description}" if description else f"Language: {language}{profile_block}"

    content: list = []
    if image_b64:
        content.append({"type": "image", "source": {"type": "base64", "media_type": "image/jpeg", "data": image_b64}})
    content.append({"type": "text", "text": user_text})

    image_message = {"role": "user", "content": content}
    trimmed = _trim_history(history, max_pairs=5)

    if trimmed and trimmed[-1]["role"] == "user":
        trimmed = trimmed[:-1]

    messages = trimmed + [image_message]

    try:
        response = client.messages.create(
            model=MODEL,
            max_tokens=1500,
            system=SYSTEM_PROMPT,
            messages=messages,
        )
        return parse_claude_response(response.content[0].text)
    except Exception as e:
        print(f"[analyze_body ERROR] {e}")
        traceback.print_exc()
        return BIAS_SAFE_FALLBACK


def analyze_label(image_b64: str, medications: list[str], language: str, history: list[dict], profile_context: str) -> dict:
    med_list = ", ".join(medications) if medications else "none listed"
    profile_block = f"\n\n{profile_context}" if profile_context else ""
    user_text = f"Language: {language}{profile_block}\n\nThis is a medication label image. Other medications the user takes: {med_list}.\n\nPlease decode this label into plain English including: drug name, purpose, dosage instructions, key side effects (3-5 most important), and any drug interactions with the listed medications. Format as JSON matching the schema."

    content: list = []
    if image_b64:
        content.append({"type": "image", "source": {"type": "base64", "media_type": "image/jpeg", "data": image_b64}})
    content.append({"type": "text", "text": user_text})

    image_message = {"role": "user", "content": content}
    trimmed = _trim_history(history, max_pairs=5)

    if trimmed and trimmed[-1]["role"] == "user":
        trimmed = trimmed[:-1]

    messages = trimmed + [image_message]

    try:
        response = client.messages.create(
            model=MODEL,
            max_tokens=1500,
            system=SYSTEM_PROMPT,
            messages=messages,
        )
        return parse_claude_response(response.content[0].text)
    except Exception as e:
        print(f"[analyze_label ERROR] {e}")
        traceback.print_exc()
        return BIAS_SAFE_FALLBACK


def chat(history: list[dict], message: str, language: str, profile_context: str) -> str:
    profile_block = f"\n\n{profile_context}" if profile_context else ""
    trimmed = _trim_history(history)

    messages = trimmed + [
        {"role": "user", "content": f"Language: {language}{profile_block}\n\n{message}"}
    ]

    try:
        response = client.messages.create(
            model=MODEL,
            max_tokens=800,
            system=SYSTEM_PROMPT,
            messages=messages,
        )
        return response.content[0].text
    except Exception:
        return "I'm having trouble responding right now. If this is urgent, please seek help or call 911."
