import asyncio
from functools import partial

from fastapi import APIRouter, Request

from limiter import limiter
from model.presets import PRESETS
from model.schemas import SimulateRequest, SimulateResponse
from model.scoring import run_simulation
from settings import settings

router = APIRouter()


def _limit() -> str:
    return f"{settings.rate_limit_per_minute}/minute"


@router.post("", response_model=SimulateResponse)
@limiter.limit(_limit())
async def simulate_policy(
    request: Request,
    body: SimulateRequest,
) -> SimulateResponse:
    """Run illustrative scoring. CPU work is offloaded to a thread pool."""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, partial(run_simulation, body))


@router.get("/presets")
@limiter.limit(_limit())
def list_presets(request: Request) -> dict[str, dict]:
    """Named scenario defaults for the UI."""
    return {"presets": {k: v.model_dump() for k, v in PRESETS.items()}}
