
import asyncio
import pytest
from httpx import AsyncClient
from main import app
from datetime import datetime
import uuid

# Mock data for testing
mock_user = {
    "email": "test@example.com",
    "password": "testpassword",
    "name": "Test User",
    "role": "patient"
}

@pytest.fixture
async def async_client():
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client

@pytest.mark.asyncio
async def test_root_endpoint(async_client):
    response = await async_client.get("/")
    assert response.status_code == 200
    assert response.json()["service"] == "NeuroShield AI API"

@pytest.mark.asyncio
async def test_register_user(async_client):
    # This test would typically use a test database
    # For now, it's a simple API call test
    response = await async_client.post("/api/v1/auth/register", json=mock_user)
    if response.status_code == 400 and "already registered" in response.json()["detail"]:
        # User already exists, which is fine for this test
        assert True
    else:
        assert response.status_code == 200
        assert response.json()["email"] == mock_user["email"]

if __name__ == "__main__":
    print("Run tests with pytest instead")
