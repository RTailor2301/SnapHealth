import json
import re

from utils.bias_fallback import BIAS_SAFE_FALLBACK


def parse_claude_response(raw_text: str) -> dict:
    # remove markdown fences in case model responds with md, then parse JSON
    cleaned = re.sub(r"```json\s*", "", raw_text)
    cleaned = re.sub(r"```\s*", "", cleaned).strip()

    try:
        return json.loads(cleaned)
    except (json.JSONDecodeError, ValueError):
        return BIAS_SAFE_FALLBACK
