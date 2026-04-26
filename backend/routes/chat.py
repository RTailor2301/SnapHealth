from fastapi import APIRouter, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from models import ChatRequest
from services.claude import chat
from services.profile_context import build_profile_context

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)


@router.post("/chat")
@limiter.limit("20/minute")
async def chat_route(request: Request, req: ChatRequest):
    profile_ctx = build_profile_context(req.profile)
    history = [{"role": m.role, "content": m.content} for m in req.history]

    response_text = chat(
        history=history,
        message=req.message,
        language=req.language,
        profile_context=profile_ctx,
    )
    return {"response": response_text}
