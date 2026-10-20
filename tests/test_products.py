import pytest
from datetime import date
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_list_products_returns_four_products():
    response = client.get("/api/products")
    assert response.status_code == 200
    data = response.json()
    assert "products" in data
    assert isinstance(data["products"], list)
    assert len(data["products"]) == 4


def test_get_product_one_returns_laptop_pro_14_with_all_fields():
    response = client.get("/api/products/1")
    assert response.status_code == 200
    data = response.json()

    assert data["id"] == 1
    assert data["name"] == "Laptop Pro 14"

    expected_fields = {"id", "name", "price", "description", "lastUpdated"}
    assert set(data.keys()) == expected_fields
    assert isinstance(data["id"], int)
    assert isinstance(data["name"], str)
    assert isinstance(data["price"], float)
    assert isinstance(data["description"], str)
    assert isinstance(data["lastUpdated"], str)


def test_get_product_returns_valid_last_updated_iso_date():
    response = client.get("/api/products/2")
    assert response.status_code == 200
    data = response.json()

    assert "lastUpdated" in data
    # lastUpdated must be a non-empty string that parses to a real date.
    assert isinstance(data["lastUpdated"], str)
    assert data["lastUpdated"] != ""

    parsed = date.fromisoformat(data["lastUpdated"])
    # If parsing succeeded we got a real date; sanity-check it's not the
    # default/minimum value.
    assert parsed.year >= 2024


def test_get_unknown_product_returns_404():
    response = client.get("/api/products/9999")
    assert response.status_code == 404
    assert response.json() == {"detail": "Product not found"}