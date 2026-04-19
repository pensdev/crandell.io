import os
import uuid

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

from limiter import limiter
from routers import simulate
from settings import settings

APP_VERSION = os.getenv("APP_VERSION", "0.1.0")


class RequestIdMiddleware(BaseHTTPMiddleware):
    """Propagate or assign X-Request-ID for traceability."""

    async def dispatch(self, request, call_next):
        req_id = request.headers.get("x-request-id") or str(uuid.uuid4())
        response = await call_next(request)
        response.headers["X-Request-ID"] = req_id
        return response


app = FastAPI(
    title="Policy Impact Simulator API",
    description="Illustrative fiscal scoring for policy scenarios. Not official government estimates.",
    version=APP_VERSION,
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(RequestIdMiddleware)
app.add_middleware(SlowAPIMiddleware)

origins = [o.strip() for o in settings.allowed_origins.split(",") if o.strip()]
if os.getenv("ALLOWED_ORIGINS"):
    origins = [o.strip() for o in os.environ["ALLOWED_ORIGINS"].split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(simulate.router, prefix="/simulate", tags=["simulate"])


@app.get("/health")
def health() -> dict[str, str]:
    return {
        "status": "ok",
        "version": APP_VERSION,
        "git_sha": os.getenv("GIT_COMMIT", "unknown"),
    }


@app.get("/")
def root() -> dict[str, str]:
    return {"service": "policy-impact-simulator-api", "docs": "/docs"}
