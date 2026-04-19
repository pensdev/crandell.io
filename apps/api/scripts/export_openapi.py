#!/usr/bin/env python3
"""Emit OpenAPI JSON from the FastAPI app (stdout). Used for TS type generation."""

import json
import sys
from pathlib import Path

# Allow `python scripts/export_openapi.py` from apps/api
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from main import app  # noqa: E402


def main() -> None:
    print(json.dumps(app.openapi(), indent=2))


if __name__ == "__main__":
    main()
