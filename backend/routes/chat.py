from fastapi import APIRouter

from models import ChatRequest
from services.claude import chat
from services.profile_context import build_profile_context

router = APIRouter()


@router.post("/chat")
async def chat_route(req: ChatRequest):
    profile_ctx = build_profile_context(req.profile)
    history = [{"role": m.role, "content": m.content} for m in req.history]

    response_text = chat(
        history=history,
        message=req.message,
        language=req.language,
        profile_context=profile_ctx,
    )
    return {"response": response_text}
