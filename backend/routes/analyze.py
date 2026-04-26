from fastapi import APIRouter, HTTPException

from models import AnalyzeBodyRequest, AnalyzeLabelRequest
from services.claude import analyze_body, analyze_label
from services.profile_context import build_profile_context

router = APIRouter()


@router.post("/analyze/body")
async def analyze_body_route(req: AnalyzeBodyRequest):
    if not req.image and not req.description:
        raise HTTPException(status_code=400, detail="Either an image or a description is required")

    profile_ctx = build_profile_context(req.profile)
    history = [{"role": m.role, "content": m.content} for m in req.history]

    result = analyze_body(
        image_b64=req.image,
        description=req.description,
        language=req.language,
        history=history,
        profile_context=profile_ctx,
    )
    return result


@router.post("/analyze/label")
async def analyze_label_route(req: AnalyzeLabelRequest):
    if not req.image and not req.medications:
        raise HTTPException(status_code=400, detail="Either an image or medications list is required")

    profile_ctx = build_profile_context(req.profile)
    history = [{"role": m.role, "content": m.content} for m in req.history]

    result = analyze_label(
        image_b64=req.image,
        medications=req.medications,
        language=req.language,
        history=history,
        profile_context=profile_ctx,
    )
    return result
