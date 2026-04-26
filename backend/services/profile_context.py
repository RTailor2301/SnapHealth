from models import ProfileContext


def build_profile_context(profile: ProfileContext) -> str:
    parts = []
    if profile.age:
        parts.append(f"Patient age: {profile.age}")
    if profile.biologicalSex:
        parts.append(f"Biological sex: {profile.biologicalSex}")
    if profile.knownConditions:
        conditions = ", ".join(profile.knownConditions[:8])
        parts.append(f"Known conditions: {conditions}")
    if profile.currentMedications:
        meds = ", ".join(profile.currentMedications[:8])
        parts.append(f"Current medications: {meds}")
    if profile.allergies:
        allergies = ", ".join(profile.allergies[:8])
        parts.append(f"Known allergies: {allergies}")
    if profile.familyHistory:
        history = ", ".join(profile.familyHistory[:8])
        parts.append(f"Family history: {history}")
    if profile.notes:
        parts.append(f"Additional context: {profile.notes}")

    if not parts:
        return ""
    return "PATIENT CONTEXT (provided by user):\n" + "\n".join(parts)
