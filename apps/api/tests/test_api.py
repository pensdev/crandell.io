import pytest
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_health() -> None:
    r = client.get("/health")
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "ok"
    assert "version" in data
    assert "git_sha" in data
    assert r.headers.get("x-request-id")


def test_simulate_baseline() -> None:
    r = client.post("/simulate", json={})
    assert r.status_code == 200
    data = r.json()
    assert "revenue_change_10yr_bn" in data
    assert len(data["distributional"]) == 5


def test_simulate_invalid_sunset_year() -> None:
    r = client.post("/simulate", json={"tcja_sunset_year": 1999})
    assert r.status_code == 422


def test_simulate_golden() -> None:
    body = {
        "top_marginal_rate_ppt": 1.0,
        "corporate_rate_ppt": 0.0,
        "discretionary_spending_pct_gdp_ppt": 0.5,
    }
    r = client.post("/simulate", json=body)
    assert r.status_code == 200
    data = r.json()
    assert data["deficit_change_10yr_bn"] != 0


def test_presets() -> None:
    r = client.get("/simulate/presets")
    assert r.status_code == 200
    assert "presets" in r.json()
    assert "tcja_sunset_2026" in r.json()["presets"]
