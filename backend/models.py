from pydantic import BaseModel


class ProfileContext(BaseModel):
    age: str = ""
    biologicalSex: str = ""
    knownConditions: list[str] = []
    currentMedications: list[str] = []
    allergies: list[str] = []
    familyHistory: list[str] = []
    notes: str = ""


class Message(BaseModel):
    role: str
    content: str


class AnalyzeBodyRequest(BaseModel):
    image: str = ""
    description: str = ""
    language: str = "en"
    history: list[Message] = []
    profile: ProfileContext = ProfileContext()


class AnalyzeLabelRequest(BaseModel):
    image: str = ""
    medications: list[str] = []
    language: str = "en"
    history: list[Message] = []
    profile: ProfileContext = ProfileContext()


class ChatRequest(BaseModel):
    history: list[Message]
    message: str
    language: str = "en"
    profile: ProfileContext = ProfileContext()
