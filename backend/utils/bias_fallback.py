BIAS_SAFE_FALLBACK = {
    "severity": "yellow",
    "severity_label": "Uncertain - Seek Evaluation",
    "plain_explanation": (
        "We could not assess this confidently from the image and/or description. "
        "AI skin analysis has known limitations depending on image quality and skin tone."
    ),
    "recommendation": "urgent_care",
    "recommendation_reasoning": "When AI confidence is low, in-person evaluation is always the safer choice.",
    "reasoning_transparency": {
        "what_i_saw": "Image could not be assessed reliably.",
        "why_this_matters": (
            "AI systems trained on medical images have documented accuracy gaps "
            "across skin tones. Erring toward caution protects you."
        ),
        "what_would_change_assessment": "A clearer photo or in-person evaluation.",
    },
    "what_to_say_when_you_arrive": (
        "I have a skin concern I was unable to assess at home and would like it evaluated."
    ),
    "action_steps": ["Try retaking with better lighting", "Try a different angle", "Try a better description", "Seek in-person evaluation"],
    "warning_signs": [],
    "followup_prompt": "",
    "disclaimer": "This is not medical advice. Always consult a healthcare professional.",
}
